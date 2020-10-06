import express from "express";
import createProduct from "../controllers/productControllers/createProduct.js";
import deleteProduct from "../controllers/productControllers/deleteProduct.js";
import getProduct from "../controllers/productControllers/getProduct.js";
import getProducts from "../controllers/productControllers/getProducts.js";
import upload from "../controllers/productControllers/uploadImage.js";
import { adminAuth, userAuth } from "../middlewares/auth.js";

const Router = express.Router();

Router.route("/")
	.get(getProducts)
	.post(userAuth, adminAuth, upload.single("image"), createProduct);
Router.route("/:id").get(getProduct).delete(userAuth, adminAuth, deleteProduct);

export default Router;
