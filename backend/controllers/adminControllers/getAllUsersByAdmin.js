import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    Get all users
// @access  private
// @route   GET /api/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({
    _id: {
      $ne: req.user._id,
    },
  });
  res.status(200).json(users);
});

export default getAllUsers;
