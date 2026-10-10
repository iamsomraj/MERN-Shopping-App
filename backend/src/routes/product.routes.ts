import { Router } from 'express';
import { createProduct } from '../controllers/product/createProduct.js';
import { deleteProduct } from '../controllers/product/deleteProduct.js';
import { getProduct } from '../controllers/product/getProduct.js';
import { getProductFilters } from '../controllers/product/getProductFilters.js';
import { getProducts } from '../controllers/product/getProducts.js';
import { getRelatedProducts } from '../controllers/product/getRelatedProducts.js';
import { updateProduct } from '../controllers/product/updateProduct.js';
import { createProductReview } from '../controllers/review/createProductReview.js';
import { getProductReviews } from '../controllers/review/getProductReviews.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';

const router = Router();

router.route('/').get(getProducts).post(userAuth, adminAuth, createProduct);
// Registered before /:id so "filters" isn't treated as a product id or slug.
router.route('/filters').get(getProductFilters);
router.route('/:id').get(getProduct).put(userAuth, adminAuth, updateProduct).delete(userAuth, adminAuth, deleteProduct);
router.route('/:id/related').get(getRelatedProducts);
router.route('/:id/reviews').get(getProductReviews).post(userAuth, createProductReview);

export default router;
