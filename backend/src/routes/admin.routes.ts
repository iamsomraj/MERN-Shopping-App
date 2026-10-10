import { Router } from 'express';
import { getAdminStats } from '../controllers/admin/getAdminStats.js';
import { getImageLibrary } from '../controllers/admin/getImageLibrary.js';
import { getProductsByAdmin } from '../controllers/admin/getProductsByAdmin.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';

const router = Router();

router.use(userAuth, adminAuth);
router.get('/stats', getAdminStats);
router.get('/products', getProductsByAdmin);
router.get('/image-library', getImageLibrary);

export default router;
