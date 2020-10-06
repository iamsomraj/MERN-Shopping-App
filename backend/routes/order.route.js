import express from "express";
import payOrder from "../controllers/orderControllers/payOrder.js";
import placeOrder from "../controllers/orderControllers/placeOrder.js";
import { userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/").post(userAuth, placeOrder);
Router.route("/:id").put(userAuth, payOrder);

export default Router;
