import type { Request, Response } from 'express';
import { findAccessibleOrder } from './findAccessibleOrder.js';

// @desc:   Pay for order by id
// @access: private (owner or admin)
// @route:  PUT /api/orders/:id
export const payOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const order = await findAccessibleOrder(req);
  order.isPaymentDone = true;
  const updatedOrder = await order.save();
  res.status(200).json(updatedOrder);
};
