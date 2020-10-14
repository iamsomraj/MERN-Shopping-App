import Product from "../../models/Product.js";
import asyncHandler from "express-async-handler";

// @desc:   getting products in terms of page number
// @access: public
// @route:  GET api/products/

const getProducts = asyncHandler(async (req, res) => {
  const noOfProductsPerPage = 8;
  const page = Number(req.query.page) || 1;
  const products = await Product.find()
    .limit(noOfProductsPerPage)
    .skip(noOfProductsPerPage * (page - 1));
  const totalProducts = await Product.countDocuments({});
  const pages = Math.ceil(totalProducts / noOfProductsPerPage);
  res.status(200).json({ products, page, pages });
});

export default getProducts;
