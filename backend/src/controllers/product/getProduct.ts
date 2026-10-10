import type { Request, Response } from 'express';
import { findProduct } from './findProduct.js';

// @desc:   get one product by id or slug
// @access: public
// @route:  GET api/products/:id
export const getProduct = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  res.status(200).json(await findProduct(req.params.id));
};
