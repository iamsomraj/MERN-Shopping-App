import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';

// @desc    get user by id
// @access  private
// @route   GET /api/users/:id
export const getUserByAdmin = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    throw new HttpError(404, 'User unavailable');
  }
  res.status(200).json(user);
};
