import User from "../../models/User.js";
import getToken from "../../util/getToken.js";
import asyncHandler from "express-async-handler";

// @desc:   login user and return a new token
// @access: public
// @route:  POST /api/users/login

const userLogin = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.status(200).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: getToken(user._id),
		});
	} else {
		const message = "Inavalid credentials";
		res.status(401).json({ message });
		throw new Error(message);
	}
});

export default userLogin;
