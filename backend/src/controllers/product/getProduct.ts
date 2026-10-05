import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';

// @desc:   get one product by id
// @access: public
// @route:  GET api/products/:id
export const getProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new HttpError(404, 'Product is unavailable');
  }
  res.status(200).json(product);
};
