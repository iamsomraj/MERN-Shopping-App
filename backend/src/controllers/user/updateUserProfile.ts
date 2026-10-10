import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   update user profile
// @access: private
// @route:  PUT api/users/profile
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(requireUser(req)._id);
  if (!user) {
    throw new HttpError(404, 'User is unavailable');
  }

  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  if (email && email !== user.email && (await User.exists({ email }))) {
    throw new HttpError(400, 'Email is already in use');
  }
  user.name = name || user.name;
  user.email = email || user.email;
  if (password) user.password = password;
  await user.save();

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};
