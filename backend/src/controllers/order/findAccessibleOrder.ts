import type { Request } from 'express';
import { Order, type OrderDocument } from '../../models/Order.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';

/** Loads an order the current user owns (admins can load any order); otherwise 404. */
export const findAccessibleOrder = async (req: Request<{ id: string }>): Promise<OrderDocument> => {
  const user = requireUser(req);
  const order = await Order.findById(req.params.id);
  if (!order || (!user.isAdmin && !order.user.equals(user._id))) {
    throw new HttpError(404, 'Order unavailable');
  }
  return order;
};
