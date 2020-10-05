import User from "../../models/User.js";
import asyncHandler from "express-async-handler";
import getToken from "../../util/getToken.js";

// @desc:   create or register new user
// @access: public
// @route:  api/user
const userRegister = asyncHandler(async (req, res) => {
	const { name, email, password } = req.body;
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({ message: "User exists" });
	}

	const user = await User.create({
		name,
		email,
		password,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: getToken(user._id),
		});
	} else {
		res.status(400).json({ message: "User data is invalid" });
		throw new Error("User data is invalid");
	}
});

export default userRegister;
