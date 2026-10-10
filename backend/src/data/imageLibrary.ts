import { products } from './products.js';

/** Bundled product images (served by the frontend from /public) that admins can pick from. */
export const imageLibrary: string[] = [...new Set(products.flatMap((product) => product.images))];
