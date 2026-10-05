import type { Request, Response } from 'express';
import { findAccessibleOrder } from './findAccessibleOrder.js';

// @desc:   Get order by id
// @access: private (owner or admin)
// @route:  GET /api/orders/:id
export const getOrder = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const order = await findAccessibleOrder(req);
  await order.populate('user', 'id name email');
  res.status(200).json(order);
};
