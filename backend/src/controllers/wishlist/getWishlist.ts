import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   the current user's saved products
// @access: private
// @route:  GET api/users/wishlist
export const getWishlist = async (req: Request, res: Response): Promise<void> => {
  const { wishlist } = requireUser(req);
  const products = await Product.find({ _id: { $in: wishlist } });
  // Keep the order in which items were saved, newest first.
  const byId = new Map(products.map((product) => [product._id.toString(), product]));
  res.status(200).json(
    wishlist
      .map((id) => byId.get(id.toString()))
      .filter(Boolean)
      .reverse()
  );
};
