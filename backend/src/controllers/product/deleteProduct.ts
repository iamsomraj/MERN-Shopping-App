import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';

// @desc:   toggle product availability (soft delete)
// @access: private
// @route:  DELETE api/products/:id
export const deleteProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new HttpError(404, 'Product is unavailable');
  }
  product.isAvailable = !product.isAvailable;
  const updatedProduct = await product.save();
  res.status(200).json(updatedProduct);
};
