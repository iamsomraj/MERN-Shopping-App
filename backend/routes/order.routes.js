import express from "express";
import getAllOrdersByAdmin from "../controllers/adminControllers/getOrdersByAdmin.js";
import getAllOrders from "../controllers/orderControllers/getAllOrders.js";
import getOrder from "../controllers/orderControllers/getOrder.js";
import payOrder from "../controllers/orderControllers/payOrder.js";
import placeOrder from "../controllers/orderControllers/placeOrder.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/").post(userAuth, placeOrder).get(userAuth, getAllOrders);
Router.route("/:id").get(userAuth, getOrder).put(userAuth, payOrder);
Router.route("/admin/all").get(userAuth, adminAuth, getAllOrdersByAdmin);

export default Router;
