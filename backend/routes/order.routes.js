import express from "express";
import getOrder from "../controllers/orderControllers/getOrder.js";
import getOrders from "../controllers/orderControllers/getOrders.js";
import payOrder from "../controllers/orderControllers/payOrder.js";
import placeOrder from "../controllers/orderControllers/placeOrder.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/")
  .post(userAuth, placeOrder)
  .get(userAuth, adminAuth, getOrders);
Router.route("/:id").get(userAuth, getOrder).put(userAuth, payOrder);

export default Router;
