import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';

// @desc:   update a user's profile
// @access: private
// @route:  PUT api/users/:id
export const updateUserByAdmin = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User is unavailable');
  }

  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  user.name = name || user.name;
  user.email = email || user.email;
  if (password) user.password = password;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};
