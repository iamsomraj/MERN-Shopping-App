import express from "express";
import getOrders from "../controllers/orderControllers/getOrders.js";
import payOrder from "../controllers/orderControllers/payOrder.js";
import placeOrder from "../controllers/orderControllers/placeOrder.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/")
	.post(userAuth, placeOrder)
	.get(userAuth, adminAuth, getOrders);
Router.route("/:id").put(userAuth, payOrder);

export default Router;
