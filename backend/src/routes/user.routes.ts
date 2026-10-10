import { Router } from 'express';
import { deleteUserByAdmin } from '../controllers/admin/deleteUserByAdmin.js';
import { getAllUsers } from '../controllers/admin/getAllUsersByAdmin.js';
import { getUserByAdmin } from '../controllers/admin/getUserByAdmin.js';
import { updateUserByAdmin } from '../controllers/admin/updateUserByAdmin.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';
import { updateUserProfile } from '../controllers/user/updateUserProfile.js';
import { userLogin } from '../controllers/user/userLogin.js';
import { userRegister } from '../controllers/user/userRegister.js';
import { addToWishlist } from '../controllers/wishlist/addToWishlist.js';
import { getWishlist } from '../controllers/wishlist/getWishlist.js';
import { removeFromWishlist } from '../controllers/wishlist/removeFromWishlist.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';

const router = Router();

router.route('/').post(userRegister).get(userAuth, adminAuth, getAllUsers);
router.route('/login').post(userLogin);
router.route('/profile').get(userAuth, getUserProfile).put(userAuth, updateUserProfile);
// Registered before /:id so "wishlist" isn't treated as a user id.
router.route('/wishlist').get(userAuth, getWishlist).post(userAuth, addToWishlist);
router.route('/wishlist/:productId').delete(userAuth, removeFromWishlist);
router
  .route('/:id')
  .delete(userAuth, adminAuth, deleteUserByAdmin)
  .get(userAuth, adminAuth, getUserByAdmin)
  .put(userAuth, adminAuth, updateUserByAdmin);

export default router;
