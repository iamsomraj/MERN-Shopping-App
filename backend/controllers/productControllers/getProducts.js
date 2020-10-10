import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc:   getting products in terms of page number
// @access: public
// @route:  GET api/products/

const getProducts = asyncHandler(async (req, res) => {
  const noOfProductsPerPage = 10;
  const page = req.query.page || 1;
  const products = await Product.find()
    .limit(noOfProductsPerPage)
    .skip(noOfProductsPerPage * (page - 1));
  res.status(200).json(products);
});

export default getProducts;
