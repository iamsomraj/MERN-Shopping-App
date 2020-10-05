import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
import userLogin from "../controllers/userControllers/userLogin.js";
import getUserProfile from "../controllers/userControllers/getUserProfile.js";
import { userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/").post(userRegister);
Router.route("/login").get(userLogin);
Router.route("/profile").get(userAuth, getUserProfile);

export default Router;
