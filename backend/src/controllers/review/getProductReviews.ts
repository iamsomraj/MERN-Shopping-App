import type { Request, Response } from 'express';
import { z } from 'zod';
import { optionalUserId } from '../../middlewares/auth.js';
import { Review } from '../../models/Review.js';
import { validate } from '../../utils/validate.js';
import { findProduct } from '../product/findProduct.js';

const REVIEWS_PER_PAGE = 10;

const querySchema = z.object({ page: z.coerce.number().int().positive().default(1) });

// @desc:   a page of reviews (newest first) plus the rating distribution
// @access: public
// @route:  GET api/products/:id/reviews?page
export const getProductReviews = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { page } = validate(querySchema, req.query);
  const product = await findProduct(req.params.id);

  const viewerId = optionalUserId(req);
  const [reviews, counts, viewerReview] = await Promise.all([
    Review.find({ product: product._id })
      .sort({ createdAt: -1 })
      .skip(REVIEWS_PER_PAGE * (page - 1))
      .limit(REVIEWS_PER_PAGE),
    Review.aggregate<{ _id: number; count: number }>([
      { $match: { product: product._id } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
    ]),
    viewerId ? Review.exists({ product: product._id, user: viewerId }) : null,
  ]);

  const distribution = Object.fromEntries([1, 2, 3, 4, 5].map((star) => [star, 0])) as Record<number, number>;
  for (const { _id, count } of counts) distribution[_id] = count;
  const total = counts.reduce((acc, { count }) => acc + count, 0);

  res.status(200).json({
    reviews,
    page,
    pages: Math.ceil(total / REVIEWS_PER_PAGE),
    total,
    rating: product.rating,
    distribution,
    // Lets the UI hide "Write a review" even when the viewer's review is on another page.
    viewerHasReviewed: Boolean(viewerReview),
  });
};
