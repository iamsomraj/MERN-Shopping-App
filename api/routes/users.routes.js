require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// @desc    registering a new user
// @access  public
// @route   api/users/register/
router.post(
	"/register",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Email is not valid").isEmail(),
		check("password", "Password is less than 6 characters").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			let user = await User.findOne({ email });

			if (user) {
				return res
					.status(400)
					.json({ errors: [{ msg: "User already exists" }] });
			}

			user = new User({
				name,
				email,
				password,
			});

			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

			const payload = {
				user: {
					id: user._id,
				},
			};

			jwt.sign(
				payload,
				process.env.SECRET_KEY,
				{
					expiresIn: 36000,
				},
				(err, token) => {
					if (err) {
						throw err;
					}
					res.status(200).json({ msg: "User is registered", token });
				}
			);
		} catch (error) {
			console.log(error);
			return res
				.status(500)
				.json({ errors: [{ msg: "Internal server error" }] });
		}
	}
);

// @desc    getting all the users
// @access  public
// @route   api/users/
router.get("/", async (req, res) => {
	try {
		const users = await User.find();
		console.log(users);
		res.status(200).json({ msg: "Users are fetched", users: users });
	} catch (error) {
		res.status(500).json({ errors: [{ msg: "Internal server error" }] });
	}
});

module.exports = router;
