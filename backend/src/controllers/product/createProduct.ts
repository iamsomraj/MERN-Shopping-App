import type { Request, Response } from 'express';
import { Product } from '../../models/Product.js';
import { requireUser } from '../../utils/requireUser.js';
import { validate } from '../../utils/validate.js';
import { createProductSchema } from './productSchemas.js';

// @desc:   create a new product
// @access: private (admin)
// @route:  POST api/products/
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req);
  const data = validate(createProductSchema, req.body);
  const product = await Product.create({ ...data, image: data.images[0], user: user._id });
  res.status(201).json(product);
};
