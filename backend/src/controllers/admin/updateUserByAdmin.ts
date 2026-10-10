import type { Request, Response } from 'express';
import { z } from 'zod';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';
import { validate } from '../../utils/validate.js';

const bodySchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.email().optional(),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean().optional(),
});

// @desc:   update a user's profile or admin role
// @access: private (admin)
// @route:  PUT api/users/:id
export const updateUserByAdmin = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { name, email, password, isAdmin } = validate(bodySchema, req.body);
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new HttpError(404, 'User is unavailable');
  }
  if (isAdmin === false && user._id.equals(requireUser(req)._id)) {
    throw new HttpError(400, 'You cannot remove your own admin access');
  }
  if (email && email !== user.email && (await User.exists({ email }))) {
    throw new HttpError(400, 'Email is already in use');
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;
  if (isAdmin !== undefined) user.isAdmin = isAdmin;
  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt,
  });
};
