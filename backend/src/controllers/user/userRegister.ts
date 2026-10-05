import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { getToken } from '../../utils/getToken.js';
import { HttpError } from '../../utils/httpError.js';

// @desc:   create or register new user
// @access: public
// @route:  POST api/users
export const userRegister = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
  if (!name || !email || !password) {
    throw new HttpError(400, 'User data is invalid');
  }
  if (await User.exists({ email })) {
    throw new HttpError(400, 'User exists');
  }

  // Self-registration never grants admin; admins are seeded or promoted by another admin.
  const user = await User.create({ name, email, password, isAdmin: false });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: getToken(user._id),
  });
};
