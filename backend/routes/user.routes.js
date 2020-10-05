import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
import userLogin from "../controllers/userControllers/userLogin.js";
import getUserProfile from "../controllers/userControllers/getUserProfile.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";
import updateUserProfile from "../controllers/userControllers/updateUserProfile.js";
import getAllUsers from "../controllers/userControllers/getAllUsers.js";

const Router = express.Router();

Router.route("/").post(userRegister).get(userAuth, adminAuth, getAllUsers);
Router.route("/login").get(userLogin);
Router.route("/profile")
	.get(userAuth, getUserProfile)
	.put(userAuth, updateUserProfile);

export default Router;
