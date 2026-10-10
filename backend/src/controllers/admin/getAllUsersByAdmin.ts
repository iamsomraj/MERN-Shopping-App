import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc    Get all users except the requesting admin, newest first
// @access  private (admin)
// @route   GET /api/users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({ _id: { $ne: requireUser(req)._id } })
    .sort({ createdAt: -1 })
    .select('-password -wishlist');
  res.status(200).json(users);
};
