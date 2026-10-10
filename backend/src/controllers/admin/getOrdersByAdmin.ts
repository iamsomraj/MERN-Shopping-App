import type { Request, Response } from 'express';
import { z } from 'zod';
import { ORDER_STATUSES, Order } from '../../models/Order.js';
import { validate } from '../../utils/validate.js';

const querySchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// @desc:   Get all orders by admin, newest first, optionally filtered by status
// @access: private (admin)
// @route:  GET /api/orders/admin/all?status&page&limit
export const getAllOrdersByAdmin = async (req: Request, res: Response): Promise<void> => {
  const { status, page, limit } = validate(querySchema, req.query);
  const filter = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .populate('user', 'id name email'),
    Order.countDocuments(filter),
  ]);
  res.status(200).json({ orders, page, pages: Math.ceil(total / limit), total });
};
