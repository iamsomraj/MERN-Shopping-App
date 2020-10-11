import User from "../../models/User.js";
import asyncHandler from "express-async-handler";
import getToken from "../../util/getToken.js";

// @desc:   create or register new user
// @access: public
// @route:  POST api/users

const userRegister = asyncHandler(async (req, res) => {
	const { name, email, password, isAdmin } = req.body;
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({ message: "User exists" });
	}

	const user = await User.create({
		name,
		email,
		password,
		isAdmin: isAdmin || false,
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
		const message = "User data is invalid";
		res.status(400).json({ message });
		throw new Error(message);
	}
});

export default userRegister;
