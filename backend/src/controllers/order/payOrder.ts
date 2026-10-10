import type { Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { type IPaymentResult, Order, type OrderDocument } from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { capturePaypalOrder, isPaypalServerCaptureEnabled } from '../../utils/paypal.js';
import { validate } from '../../utils/validate.js';
import { findAccessibleOrder } from './findAccessibleOrder.js';

// The PayPal order id; without server capture, also the capture details the client received.
// Without PAYPAL_CLIENT_SECRET these details are trusted as-is (fine for the demo; set the secret for real payments).
const paymentSchema = z.object({
  id: z.string().min(1).max(64),
  status: z.string().max(32).default('COMPLETED'),
  update_time: z.string().max(64).optional(),
  payer: z.object({ email_address: z.string().max(254).optional() }).optional(),
});

const assertPayable = (order: OrderDocument) => {
  if (order.status !== 'pending') {
    throw new HttpError(400, order.status === 'cancelled' ? 'Order was cancelled' : 'Order is already paid');
  }
};

const assertInStock = async (order: OrderDocument) => {
  const products = await Product.find({ _id: { $in: order.products.map((item) => item.product) } });
  const stock = new Map(products.map((product) => [product.id, product]));
  for (const item of order.products) {
    const product = stock.get(item.product.toString());
    if (!product?.isAvailable || product.qtyInStock < item.qty) {
      throw new HttpError(409, `${item.name} is no longer available in that quantity`);
    }
  }
};

// @desc:   Pay for order by id
// @access: private (owner or admin)
// @route:  PUT /api/orders/:id/pay
export const payOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const order = await findAccessibleOrder(req);
  assertPayable(order);
  const payment = validate(paymentSchema, req.body);

  let paymentResult: IPaymentResult;
  if (isPaypalServerCaptureEnabled()) {
    if (await Order.exists({ 'paymentResult.id': payment.id })) {
      throw new HttpError(409, 'This PayPal payment has already been used');
    }
    // Everything that could reject the order is checked before any money moves.
    await assertInStock(order);
    paymentResult = await capturePaypalOrder(payment.id, order);
  } else {
    if (env().NODE_ENV === 'production') {
      console.warn(`Order ${order.id} marked paid without server-side PayPal capture`);
    }
    paymentResult = {
      id: payment.id,
      status: payment.status,
      updateTime: payment.update_time,
      email: payment.payer?.email_address,
    };
  }

  // Atomic: only one concurrent request can move the order out of "pending".
  const paidOrder = await Order.findOneAndUpdate(
    { _id: order._id, status: 'pending' },
    { $set: { status: 'paid', isPaymentDone: true, paidAt: new Date(), paymentResult } },
    { returnDocument: 'after' }
  );
  if (!paidOrder) {
    throw new HttpError(400, 'Order is already paid');
  }

  // Never below zero: without server capture, the client has already been charged.
  await Product.bulkWrite(
    order.products.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: [{ $set: { qtyInStock: { $max: [0, { $subtract: ['$qtyInStock', item.qty] }] } } }],
      },
    }))
  );

  res.status(200).json(paidOrder);
};
