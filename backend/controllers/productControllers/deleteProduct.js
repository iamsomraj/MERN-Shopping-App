import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc:   delete product by id
// @access: private
// @route:  DELETE api/products/:id

const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (product) {
		product.isAvailable = false;
		const updatedProduct = await product.save();
		res.status(200).json(updatedProduct);
	} else {
		const message = "Product is unavailable";
		res.status(404).json({ message });
		throw new Error(message);
	}
});

export default deleteProduct;
