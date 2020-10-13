import Order from "../../models/Order.js";
import asyncHandler from "express-async-handler";

// @desc:   Pay for order by id
// @access: Private
// @route:  /api/orders/:id
const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "id name email"
  );
  if (order) {
    order.isPaymentDone = true;
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    const message = "Order unavailable";
    res.status(404).json({message});
    throw new Error(message);
  }
});

export default payOrder;
