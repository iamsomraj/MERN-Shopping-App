import User from "../../models/User.js";
import asyncHandler from "express-async-handler";

// @desc: 	update user profile
// @access: private
// @route: 	api/users/profile

const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		const { name, email, password } = req.body;
		user.name = name || user.name;
		user.email = email || user.email;
		user.password = password || user.password;

		const emailExists = await User.findOne({ email: user.email });
		if (emailExists) {
			return res.status(400).json({ message: "Email already registered" });
		}

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

export default updateUserProfile;
