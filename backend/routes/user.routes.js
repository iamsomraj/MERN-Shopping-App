import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
import userLogin from "../controllers/userControllers/userLogin.js";
const Router = express.Router();

Router.route("/").post(userRegister);
Router.route("/login").get(userLogin);

export default Router;
