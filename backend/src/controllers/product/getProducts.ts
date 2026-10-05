import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';

const PRODUCTS_PER_PAGE = 8;

// @desc:   getting products in terms of page number
// @access: public
// @route:  GET api/products/
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const [products, totalProducts] = await Promise.all([
    Product.find()
      .limit(PRODUCTS_PER_PAGE)
      .skip(PRODUCTS_PER_PAGE * (page - 1)),
    Product.countDocuments({}),
  ]);
  const pages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  res.status(200).json({ products, page, pages });
};
