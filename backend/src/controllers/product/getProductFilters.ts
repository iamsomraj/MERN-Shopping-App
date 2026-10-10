import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';

// @desc:   categories (with counts and a cover image), brands and price range of available products
// @access: public
// @route:  GET api/products/filters
export const getProductFilters = async (_req: Request, res: Response): Promise<void> => {
  const match = { $match: { isAvailable: true } };
  const [categories, brands, [priceRange]] = await Promise.all([
    Product.aggregate<{ name: string; count: number; image: string }>([
      match,
      { $sort: { isFeatured: -1, rating: -1 } },
      { $group: { _id: '$category', count: { $sum: 1 }, image: { $first: '$image' } } },
      { $sort: { count: -1, _id: 1 } },
      { $project: { _id: 0, name: '$_id', count: 1, image: 1 } },
    ]),
    Product.distinct('brand', { isAvailable: true, brand: { $ne: '' } }),
    Product.aggregate<{ min: number; max: number }>([
      match,
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } },
      { $project: { _id: 0, min: 1, max: 1 } },
    ]),
  ]);

  res.status(200).json({
    categories,
    brands: brands.sort((a, b) => a.localeCompare(b)),
    priceRange: priceRange ?? { min: 0, max: 0 },
  });
};
