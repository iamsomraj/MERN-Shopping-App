import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { findProduct } from './findProduct.js';

const RELATED_LIMIT = 4;

// @desc:   products from the same category (best rated first), topped up with top-rated products from others
// @access: public
// @route:  GET api/products/:id/related
export const getRelatedProducts = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const product = await findProduct(req.params.id);
  const sameCategory = await Product.find({
    category: product.category,
    isAvailable: true,
    _id: { $ne: product._id },
  })
    .sort({ rating: -1, numReviews: -1 })
    .limit(RELATED_LIMIT);

  const others =
    sameCategory.length < RELATED_LIMIT
      ? await Product.find({ category: { $ne: product.category }, isAvailable: true, qtyInStock: { $gt: 0 } })
          .sort({ rating: -1, numReviews: -1 })
          .limit(RELATED_LIMIT - sameCategory.length)
      : [];

  res.status(200).json([...sameCategory, ...others]);
};
