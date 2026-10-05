import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { requireUser } from '../../utils/requireUser.js';

// @desc:   create a new product
// @access: private
// @route:  POST api/products/
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  if (!req.file) {
    throw new HttpError(400, 'A JPEG or PNG product image is required');
  }
  const { name, price, qtyInStock } = req.body as { name?: string; price?: string; qtyInStock?: string };
  const product = new Product({
    user: user._id,
    name,
    image: req.file.path,
    price,
    qtyInStock: Number(qtyInStock) > 0 ? Number(qtyInStock) : 1,
  });
  const newProduct = await product.save();
  res.status(200).json(newProduct);
};
