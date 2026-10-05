import type { Request, Response } from 'express';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   getting user profile
// @access: private
// @route:  GET api/users/profile
export const getUserProfile = (req: Request, res: Response): void => {
  const user = requireUser(req);
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};
