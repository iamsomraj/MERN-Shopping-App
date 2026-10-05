import type { Request, Response } from 'express';
import { z } from 'zod';
import { Order } from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';

const orderBodySchema = z.object({
  products: z
    .array(
      z.object({
        product: z.string().min(1),
        // The cart treats a missing qty as 1.
        qty: z.preprocess((qty) => qty ?? 1, z.coerce.number().int().positive()),
      })
    )
    .min(1),
});

// @desc:   Create new order
// @access: Private
// @route:  POST /api/orders
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const parsed = orderBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new HttpError(400, 'Ordered products unavailable');
  }

  // Name and price come from the database, never from the client.
  const ids = parsed.data.products.map((item) => item.product);
  const dbProducts = await Product.find({ _id: { $in: ids }, isAvailable: true });
  const byId = new Map(dbProducts.map((product) => [product._id.toString(), product]));

  const products = parsed.data.products.map((item) => {
    const product = byId.get(item.product);
    if (!product) {
      throw new HttpError(400, 'Ordered products unavailable');
    }
    return { product: product._id, name: product.name, price: product.price, qty: item.qty };
  });

  const totalPrice = Number(products.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2));
  const createdOrder = await Order.create({ user: user._id, products, totalPrice });
  res.status(201).json(createdOrder);
};
