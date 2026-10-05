import { Router } from 'express';
import { getAllOrdersByAdmin } from '../controllers/admin/getOrdersByAdmin.js';
import { getAllOrders } from '../controllers/order/getAllOrders.js';
import { getOrder } from '../controllers/order/getOrder.js';
import { payOrder } from '../controllers/order/payOrder.js';
import { placeOrder } from '../controllers/order/placeOrder.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';

const router = Router();

router.route('/').post(userAuth, placeOrder).get(userAuth, getAllOrders);
// Registered before /:id so "admin" isn't treated as an order id.
router.route('/admin/all').get(userAuth, adminAuth, getAllOrdersByAdmin);
router.route('/:id').get(userAuth, getOrder).put(userAuth, payOrder);

export default router;
