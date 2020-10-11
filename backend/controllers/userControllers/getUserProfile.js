import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc:   getting user profile
// @access: private
// @route:  GET api/users/profile

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    const message = "User is unavailable";
    res.status(404).json({ message });
    throw new Error(message);
  }
});

export default getUserProfile;
