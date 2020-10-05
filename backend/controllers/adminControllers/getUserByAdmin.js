import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc    get user by id
// @access  private
// @route   /api/users/:id
const getUserByAdminByAdmin = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
	if (user) {
		res.status(200).json(user);
	} else {
		const message = "User unavailable";
		res.status(404).json({ message });
		throw new Error(message);
	}
});

export default getUserByAdminByAdmin;
