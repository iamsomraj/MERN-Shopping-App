import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc    delete user by id
// @access  private (admin)
// @route   DELETE /api/users/:id
export const deleteUserByAdmin = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User unavailable');
  }
  if (user._id.equals(requireUser(req)._id)) {
    throw new HttpError(400, 'You cannot delete your own account');
  }
  await user.deleteOne();
  res.status(200).json({ message: 'User removed' });
};
