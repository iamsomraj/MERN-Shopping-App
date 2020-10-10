import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc:   get one product by id
// @access: public
// @route:  GET api/products/:id

const getProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		res.status(200).json(product);
	} else {
		const message = "Product is unavailable";
		res.status(404).json({ message });
		throw new Error(message);
	}
});

export default getProduct;
