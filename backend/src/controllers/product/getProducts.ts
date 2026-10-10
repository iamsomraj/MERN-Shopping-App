import type { Request, Response } from 'express';
import type { QueryFilter, SortOrder } from 'mongoose';
import { type IProduct, Product } from '../../models/Product.js';
import { escapeRegex } from '../../utils/escapeRegex.js';
import { validate } from '../../utils/validate.js';
import { productQuerySchema } from './productSchemas.js';

const SORTS: Record<string, Record<string, SortOrder>> = {
  featured: { isFeatured: -1, rating: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  rating: { rating: -1, numReviews: -1 },
};

// @desc:   list available products with search, filters, sorting and pagination
// @access: public
// @route:  GET api/products?keyword&category&brand&minPrice&maxPrice&inStock&featured&onSale&sort&page&limit
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const query = validate(productQuerySchema, req.query);
  const filter: QueryFilter<IProduct> = { isAvailable: true };

  if (query.keyword) {
    const pattern = new RegExp(escapeRegex(query.keyword), 'i');
    filter.$or = [{ name: pattern }, { brand: pattern }, { category: pattern }];
  }
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = query.brand;
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    filter.price = {
      ...(query.minPrice !== undefined && { $gte: query.minPrice }),
      ...(query.maxPrice !== undefined && { $lte: query.maxPrice }),
    };
  }
  if (query.inStock) filter.qtyInStock = { $gt: 0 };
  if (query.featured) filter.isFeatured = true;
  if (query.onSale) filter.compareAtPrice = { $gt: 0 };

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ ...SORTS[query.sort], _id: 1 })
      .skip(query.limit * (query.page - 1))
      .limit(query.limit),
    Product.countDocuments(filter),
  ]);

  res.status(200).json({ products, page: query.page, pages: Math.ceil(total / query.limit), total });
};
