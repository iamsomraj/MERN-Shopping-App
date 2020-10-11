import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
import userLogin from "../controllers/userControllers/userLogin.js";
import getUserProfile from "../controllers/userControllers/getUserProfile.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import updateUserProfile from "../controllers/userControllers/updateUserProfile.js";
import getAllUsers from "../controllers/adminControllers/getAllUsersByAdmin.js";
import getUserByAdmin from "../controllers/adminControllers/getUserByAdmin.js";
import deleteUserByAdmin from "../controllers/adminControllers/deleteUserByAdmin.js";
import updateUserByAdmin from "../controllers/adminControllers/updateUserByAdmin.js";



const Router = express.Router();

Router.route("/").post(userRegister).get(userAuth, adminAuth, getAllUsers);
Router.route("/login").post(userLogin);
Router.route("/profile")
	.get(userAuth, getUserProfile)
	.put(userAuth, updateUserProfile);
Router.route("/:id")
	.delete(userAuth, adminAuth, deleteUserByAdmin)
	.get(userAuth, adminAuth, getUserByAdmin)
	.put(userAuth, adminAuth, updateUserByAdmin);

export default Router;
