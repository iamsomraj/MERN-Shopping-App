const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const Order = require("../../models/Order");
const User = require("../../models/User");
const Product = require("../../models/Product");

// @desc    get all the orders
// @access  private
// @route   api/orders/
router.get("/", auth, async (req, res) => {
	try {
		const orders = await Order.findOne({ user: req.user.id })
			.populate("user", ["name", "email"])
			.populate("product", ["name", "price", "category"]);

		if (!orders) {
			return res
				.status(400)
				.json({ errors: [{ msg: "There are no orders for this user" }] });
		}
		res.status(200).json({ msg: "Orders are fetched successfully", orders });
	} catch (error) {
		console.log(error.message);
		res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error : Get Orders" }] });
	}
});

// @desc    create one order
// @access  private
// @route   api/orders/create
router.post(
	"/create",
	[
		auth,
		[
			body("product", "Product is invalid").not().isEmpty(),
			body("quantity", "Quantity is invalid").not().isEmpty().isNumeric(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { product, quantity } = req.body;

		if (!product.match(/^[0-9a-fA-F]{24}$/)) {
			return res
				.status(400)
				.json({ errors: [{ msg: "Invalid order details" }] });
		}

		const orderFields = {
			user: req.user.id,
			product,
			quantity: quantity <= 0 ? 1 : quantity,
		};

		try {
			const user = await User.findById(req.user.id);

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User does not exist" }] });
			}

			const prod = await Product.findById(product);

			if (!prod) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Product does not exist" }] });
			}

			const newOrder = new Order(orderFields);

			await newOrder.save();

			res.status(200).json({ msg: "Order has been placed" });
		} catch (error) {
			console.log(error.message);
			res
				.status(500)
				.json({ errors: [{ msg: "Internal Server Error : Place Orders" }] });
		}
	}
);

module.exports = router;
