const express = require("express");
const Product = require("../../models/Product");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const User = require("../../models/User");

// @desc    get products
// @access  public
// @route   api/products/
router.get("/", async (req, res) => {
	try {
		const products = await Product.find().select("-user");

		if (products.length === 0) {
			return res.status(401).json({
				errors: [{ msg: "There are no products currently available" }],
			});
		}

		res
			.status(200)
			.json({ message: "Products are fetched succesfully", products });
	} catch (error) {
		res.status(500).json({
			errors: [{ msg: "Internal Server Error : Get Products" }],
		});
	}
});

// @desc    create product
// @access  private
// @route   api/products/create
router.post(
	"/create",
	[
		auth,
		[
			body("name", "Product name is invalid").not().isEmpty(),
			body("category", "Product category is invalid").not().isEmpty(),
			body("price", "Product price is invalid").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, category, price } = req.body;

		const productFields = {
			user: req.user.id,
			name,
			category,
			price: price <= 99 ? 100 : price,
		};

		try {
			const user = await User.findById(req.user.id);

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User does not exist" }] });
			}

			const newProduct = new Product(productFields);

			await newProduct.save();

			res.status(200).json({ message: "Product is created succesfully" });
		} catch (error) {
			console.log(error.message);
			res.status(500).json({
				errors: [{ msg: "Internal Server Error : Create Products" }],
			});
		}
	}
);

module.exports = router;
