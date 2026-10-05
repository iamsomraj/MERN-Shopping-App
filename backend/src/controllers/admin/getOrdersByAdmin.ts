import type { Request, Response } from 'express';
import { Order } from '../../models/Order.js';

// @desc:   Get all orders by admin
// @access: private
// @route:  GET /api/orders/admin/all
export const getAllOrdersByAdmin = async (_req: Request, res: Response): Promise<void> => {
  const orders = await Order.find().populate('user', 'id name email');
  res.status(200).json(orders);
};
