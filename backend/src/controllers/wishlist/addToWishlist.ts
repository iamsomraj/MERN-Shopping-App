import type { Request, Response } from 'express';
import { z } from 'zod';
import { Product } from '../../models/Product.js';
import { User } from '../../models/User.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';
import { validate } from '../../utils/validate.js';

const bodySchema = z.object({ productId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid product id') });

// @desc:   save a product to the wishlist (idempotent)
// @access: private
// @route:  POST api/users/wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const { productId } = validate(bodySchema, req.body);
  if (!(await Product.exists({ _id: productId }))) {
    throw new HttpError(404, 'Product is unavailable');
  }
  const updated = await User.findByIdAndUpdate(
    user._id,
    { $addToSet: { wishlist: productId } },
    { returnDocument: 'after', projection: 'wishlist' }
  );
  res.status(200).json(updated?.wishlist ?? []);
};
