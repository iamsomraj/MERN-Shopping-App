import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { getToken } from '../../utils/getToken.js';
import { HttpError } from '../../utils/httpError.js';

// @desc:   login user and return a new token
// @access: public
// @route:  POST /api/users/login
export const userLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  const user = email ? await User.findOne({ email }) : null;

  if (!user || !password || !(await user.matchPassword(password))) {
    throw new HttpError(401, 'Invalid Email Address or Password');
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: getToken(user._id),
  });
};
