import type { Request, Response } from 'express';
import { Order } from '../../models/Order.js';
import { HttpError } from '../../utils/httpError.js';
import { findAccessibleOrder } from './findAccessibleOrder.js';

// @desc:   cancel an unpaid order
// @access: private (owner or admin)
// @route:  PUT /api/orders/:id/cancel
export const cancelOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const order = await findAccessibleOrder(req);
  // Conditional update: a payment that lands at the same moment wins, never both.
  const cancelled = await Order.findOneAndUpdate(
    { _id: order._id, status: 'pending' },
    { $set: { status: 'cancelled', cancelledAt: new Date() } },
    { returnDocument: 'after' }
  );
  if (!cancelled) {
    throw new HttpError(400, 'Only unpaid orders can be cancelled');
  }
  res.status(200).json(cancelled);
};
