import Order from "../../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc:   Get all orders by admin
// @access: private
// @route:  GET /api/orders/admin/all
const getAllOrdersByAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "id name email");
  if (orders.length > 0) {
    res.json(orders);
  } else {
    const message = "Orders are unvailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getAllOrdersByAdmin;
