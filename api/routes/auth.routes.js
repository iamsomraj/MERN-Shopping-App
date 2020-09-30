const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../../models/User");
const auth = require("../middleware/auth");

// @desc    Get authenticated user and get token
// @access  public
// @route   api/auth/
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.status(200).json({ user, msg: "User is verified" });
	} catch (error) {
		res.status(500).json({ errors: [{ msg: "Auth error" }] });
	}
});

// @desc     Login user and get token
// @access   Public
// @route    api/auth/login
router.post(
	"/login",
	[
		body("email", "Please include a valid email").isEmail(),
		body("password", "Password is required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			const isPassMatch = await bcrypt.compare(password, user.password);

			if (!isPassMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				process.env.SECRET,
				{ expiresIn: "5 days" },
				(err, token) => {
					if (err) throw err;
					res.json({ msg: "User is logged in", token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ errors: [{ msg: "Internal Server Error" }] });
		}
	}
);

module.exports = router;
