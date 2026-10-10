import type { Request, Response } from 'express';
import { z } from 'zod';
import { Order, type OrderStatus } from '../../models/Order.js';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { validate } from '../../utils/validate.js';

const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const TIMESTAMP = { shipped: 'shippedAt', delivered: 'deliveredAt', cancelled: 'cancelledAt' } as const;

const bodySchema = z.object({ status: z.enum(['shipped', 'delivered', 'cancelled']) });

// @desc:   move an order along its lifecycle (paid → shipped → delivered, or cancel)
// @access: private (admin)
// @route:  PUT /api/orders/:id/status
export const updateOrderStatus = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { status } = validate(bodySchema, req.body);
  const order = await Order.findById(req.params.id);
  if (!order) {
    throw new HttpError(404, 'Order unavailable');
  }
  if (!NEXT_STATUSES[order.status].includes(status)) {
    throw new HttpError(400, `Cannot change a ${order.status} order to ${status}`);
  }
  const wasPaid = order.status === 'paid';
  // Conditional on the status we validated, so concurrent changes (or a payment) can't be overwritten.
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, status: order.status },
    { $set: { status, isPaymentDone: status !== 'cancelled', [TIMESTAMP[status]]: new Date() } },
    { returnDocument: 'after' }
  ).populate('user', 'id name email');
  if (!updated) {
    throw new HttpError(409, 'The order changed in the meantime. Reload and try again.');
  }

  // Payment decremented stock, so a cancelled paid order puts it back.
  if (status === 'cancelled' && wasPaid) {
    await Product.bulkWrite(
      order.products.map((item) => ({
        updateOne: { filter: { _id: item.product }, update: { $inc: { qtyInStock: item.qty } } },
      }))
    );
  }
  res.status(200).json(updated);
};
