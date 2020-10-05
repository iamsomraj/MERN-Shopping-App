import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
import userLogin from "../controllers/userControllers/userLogin.js";
import getUserProfile from "../controllers/userControllers/getUserProfile.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import updateUserProfile from "../controllers/userControllers/updateUserProfile.js";
import getAllUsers from "../controllers/userControllers/getAllUsersByAdmin.js";
import getUserByAdminByAdmin from "../controllers/userControllers/getUserByAdmin.js";
import deleteUserByAdmin from "../controllers/userControllers/deleteUserByAdmin.js";
import updateUserByAdmin from "../controllers/userControllers/updateUserByAdmin.js";

const Router = express.Router();

Router.route("/").post(userRegister).get(userAuth, adminAuth, getAllUsers);
Router.route("/login").get(userLogin);
Router.route("/profile")
	.get(userAuth, getUserProfile)
	.put(userAuth, updateUserProfile);
Router.route("/:id")
	.delete(userAuth, adminAuth, deleteUserByAdmin)
	.get(userAuth, adminAuth, getUserByAdminByAdmin)
	.get(userAuth, adminAuth, updateUserByAdmin);

export default Router;
