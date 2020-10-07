import Order from "../../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc:   Get all orders
// @access: private
// @route:  /api/orders
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find().populate("user", "id name email");
	res.json(orders);
});

export default getOrders;
