import Order from "../../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc:   Get all orders
// @access: private
// @route:  GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "id name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    const message = "Order unavailable";
    res.status(404).json({message});
    throw new Error(message);
  }
});

export default getOrder;
