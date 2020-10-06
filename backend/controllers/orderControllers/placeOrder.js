import Order from "../../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc:   Create new order
// @access: Private
// @route:  /api/orders
const placeOrder = asyncHandler(async (req, res) => {
	const user = req.user._id;
	const { products, totalPrice } = req.body;
	if (products && products.length === 0) {
		const message = "Ordered products unavailable";
		res.status(404).json(message);
		throw new Error(message);
	} else {
		const order = new Order({
			user,
			products,
			totalPrice,
		});
		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
});

export default placeOrder;
