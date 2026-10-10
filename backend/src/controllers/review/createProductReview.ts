import type { Request, Response } from 'express';
import { z } from 'zod';
import { Order, PAID_STATUSES } from '../../models/Order.js';
import { Review } from '../../models/Review.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';
import { validate } from '../../utils/validate.js';
import { findProduct } from '../product/findProduct.js';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(100).default(''),
  comment: z.string().trim().min(3).max(1000),
});

// @desc:   review a product (one review per user); marked verified if the user bought it
// @access: private
// @route:  POST api/products/:id/reviews
export const createProductReview = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const user = requireUser(req);
  const data = validate(reviewSchema, req.body);
  const product = await findProduct(req.params.id);

  if (await Review.exists({ product: product._id, user: user._id })) {
    throw new HttpError(409, 'You have already reviewed this product');
  }

  const hasPurchased = await Order.exists({
    user: user._id,
    'products.product': product._id,
    status: { $in: PAID_STATUSES },
  });

  const review = await Review.create({
    ...data,
    product: product._id,
    user: user._id,
    name: user.name,
    isVerifiedPurchase: Boolean(hasPurchased),
  });
  await Review.recalcProductRating(product._id);
  res.status(201).json(review);
};
