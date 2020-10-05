import express from "express";
import userRegister from "../controllers/userControllers/userRegister.js";
const Router = express.Router();

Router.route("/").post(userRegister);

export default Router;
