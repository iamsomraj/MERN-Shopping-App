import { Router } from 'express';
import { deleteUserByAdmin } from '../controllers/admin/deleteUserByAdmin.js';
import { getAllUsers } from '../controllers/admin/getAllUsersByAdmin.js';
import { getUserByAdmin } from '../controllers/admin/getUserByAdmin.js';
import { updateUserByAdmin } from '../controllers/admin/updateUserByAdmin.js';
import { getUserProfile } from '../controllers/user/getUserProfile.js';
import { updateUserProfile } from '../controllers/user/updateUserProfile.js';
import { userLogin } from '../controllers/user/userLogin.js';
import { userRegister } from '../controllers/user/userRegister.js';
import { adminAuth, userAuth } from '../middlewares/auth.js';

const router = Router();

router.route('/').post(userRegister).get(userAuth, adminAuth, getAllUsers);
router.route('/login').post(userLogin);
router.route('/profile').get(userAuth, getUserProfile).put(userAuth, updateUserProfile);
router
  .route('/:id')
  .delete(userAuth, adminAuth, deleteUserByAdmin)
  .get(userAuth, adminAuth, getUserByAdmin)
  .put(userAuth, adminAuth, updateUserByAdmin);

export default router;
