import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';
import { validate } from '../../utils/validate.js';
import { updateProductSchema } from './productSchemas.js';

// @desc:   update a product
// @access: private (admin)
// @route:  PUT api/products/:id
export const updateProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const data = validate(updateProductSchema, req.body);
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new HttpError(404, 'Product is unavailable');
  }
  product.set(data);
  if (data.images) product.image = data.images[0]!;
  if (product.compareAtPrice != null && product.compareAtPrice <= product.price) {
    throw new HttpError(400, 'compareAtPrice: Compare-at price must be higher than the price');
  }
  res.status(200).json(await product.save());
};
