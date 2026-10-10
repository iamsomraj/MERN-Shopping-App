import type { Request, Response } from 'express';
import { z } from 'zod';
import { Order } from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { priceOrder } from '../../utils/pricing.js';
import { requireUser } from '../../utils/requireUser.js';
import { validate } from '../../utils/validate.js';

const text = (max: number) => z.string().trim().min(2).max(max);

const orderBodySchema = z.object({
  products: z
    .array(
      z.object({
        product: z.string().min(1),
        // The cart treats a missing qty as 1.
        qty: z.preprocess((qty) => qty ?? 1, z.coerce.number().int().positive().max(99)),
      })
    )
    .min(1),
  shippingAddress: z.object({
    fullName: text(80),
    address: text(160),
    city: text(80),
    postalCode: z.string().trim().min(3).max(12),
    country: text(60),
    phone: z.string().trim().max(20).optional(),
  }),
});

// @desc:   Create new order
// @access: Private
// @route:  POST /api/orders
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const { products: lines, shippingAddress } = validate(orderBodySchema, req.body);

  // Name and price come from the database, never from the client.
  const ids = lines.map((item) => item.product);
  const dbProducts = await Product.find({ _id: { $in: ids }, isAvailable: true });
  const byId = new Map(dbProducts.map((product) => [product._id.toString(), product]));

  const products = lines.map((item) => {
    const product = byId.get(item.product);
    if (!product) {
      throw new HttpError(400, 'Ordered products unavailable');
    }
    if (item.qty > product.qtyInStock) {
      throw new HttpError(400, `Only ${product.qtyInStock} of ${product.name} left in stock`);
    }
    return { product: product._id, name: product.name, image: product.image, price: product.price, qty: item.qty };
  });

  const createdOrder = await Order.create({ user: user._id, products, shippingAddress, ...priceOrder(products) });
  res.status(201).json(createdOrder);
};
