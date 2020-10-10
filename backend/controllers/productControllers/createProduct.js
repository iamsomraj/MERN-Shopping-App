import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";


// @desc:   create a new product
// @access: private
// @route:  POST api/products/

const createProduct = asyncHandler( async (req, res) => {
	const user = req.user._id;
	const { name, price, qtyInStock } = req.body;
	const image = req.file.path;
	const product = new Product({
		user,
		name,
		image,
		price,
		qtyInStock: +qtyInStock > 0 ? +qtyInStock : 1,
	});
	const newProduct = await product.save();
	res.status(200).json(newProduct);
});

export default createProduct;
