import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc:   getting user profile
// @access: private
// @route:  GET api/users/profile

const getUserProfile = asyncHandler(async (req, res) => {
	if (req.user) {
		res.json({
			_id: req.user._id,
			name: req.user.name,
			email: req.user.email,
			isAdmin: req.user.isAdmin,
		});
	} else {
		const message = "User is unavailable";
		res.status(404).json({ message });
		throw new Error(message);
	}
});

export default getUserProfile;
