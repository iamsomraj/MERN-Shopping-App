import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc: 	update user profile
// @access: private
// @route: 	PUT api/users/:id

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { name, email, password } = req.body;
    user.name = name || user.name;
    user.email = email || user.password;
    if (password) user.password = password;

    await user.save();
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

export default updateUserByAdmin;
