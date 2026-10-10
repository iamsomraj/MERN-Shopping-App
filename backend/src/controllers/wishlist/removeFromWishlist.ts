import type { Request, Response } from 'express';
import { User } from '../../models/User.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   remove a product from the wishlist
// @access: private
// @route:  DELETE api/users/wishlist/:productId
export const removeFromWishlist = async (req: Request<{ productId: string }>, res: Response): Promise<void> => {
  const user = requireUser(req);
  const updated = await User.findByIdAndUpdate(
    user._id,
    { $pull: { wishlist: req.params.productId } },
    { returnDocument: 'after', projection: 'wishlist' }
  );
  res.status(200).json(updated?.wishlist ?? []);
};
