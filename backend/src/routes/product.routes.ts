import { Router } from 'express';
import { createProduct } from '../controllers/product/createProduct.js';
import { deleteProduct } from '../controllers/product/deleteProduct.js';
import { getProduct } from '../controllers/product/getProduct.js';
import { getProducts } from '../controllers/product/getProducts.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

router.route('/').get(getProducts).post(userAuth, adminAuth, upload.single('image'), createProduct);
router.route('/:id').get(getProduct).delete(userAuth, adminAuth, deleteProduct);

export default router;
