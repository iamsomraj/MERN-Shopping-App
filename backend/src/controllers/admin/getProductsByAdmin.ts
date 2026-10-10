import type { Request, Response } from 'express';
import type { QueryFilter } from 'mongoose';
import { z } from 'zod';
import { type IProduct, Product } from '../../models/Product.js';
import { escapeRegex } from '../../utils/escapeRegex.js';
import { validate } from '../../utils/validate.js';

const querySchema = z.object({
  keyword: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// @desc:   every product (including unavailable ones), newest first, with optional search
// @access: private (admin)
// @route:  GET /api/admin/products?keyword&page&limit
export const getProductsByAdmin = async (req: Request, res: Response): Promise<void> => {
  const { keyword, page, limit } = validate(querySchema, req.query);
  const filter: QueryFilter<IProduct> = {};
  if (keyword) {
    const pattern = new RegExp(escapeRegex(keyword), 'i');
    filter.$or = [{ name: pattern }, { brand: pattern }, { category: pattern }];
  }
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({ createdAt: -1, _id: 1 })
      .skip(limit * (page - 1))
      .limit(limit),
    Product.countDocuments(filter),
  ]);
  res.status(200).json({ products, page, pages: Math.ceil(total / limit), total });
};
