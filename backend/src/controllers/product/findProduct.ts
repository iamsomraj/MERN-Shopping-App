import { isValidObjectId } from 'mongoose';
import { Product, type ProductDocument } from '../../models/Product.js';
import { HttpError } from '../../utils/httpError.js';

/** Looks a product up by ObjectId or slug; otherwise 404. */
export const findProduct = async (idOrSlug: string): Promise<ProductDocument> => {
  const product = isValidObjectId(idOrSlug)
    ? await Product.findById(idOrSlug)
    : await Product.findOne({ slug: idOrSlug.toLowerCase() });
  if (!product) {
    throw new HttpError(404, 'Product is unavailable');
  }
  return product;
};
