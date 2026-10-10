import type { Request, Response } from 'express';
import { Order } from '../../models/Order.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   Get the current user's orders, newest first
// @access: private
// @route:  GET /api/orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await Order.find({ user: requireUser(req)._id })
    .sort({ createdAt: -1 })
    .populate('user', 'id name email');
  res.status(200).json(orders);
};
