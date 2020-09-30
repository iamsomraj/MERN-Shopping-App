const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @desc     Get current logged in user's profile
// @access   Private
// @route    api/profile/
router.get("/", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "email"]);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}

		res.status(200).json({ msg: "Profile fetched successfully", profile });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @desc     Create or update user profile
// @access   Private
// @route    api/profile
router.post(
	"/",
	[
		auth,
		[
			body("contact", "Contact is not valid").isLength({ min: 10 }).isNumeric(),
			body("address", "Address is not valid")
				.not()
				.isEmpty()
				.isLength({ min: 5 }),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		const { contact, address } = req.body;

		const profileFields = {
			user: req.user.id,
			image: "image.jpg",
			contact,
			address,
		};

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res
					.status(200)
					.json({ msg: "Profile updated successfully", profile });
			}

			profile = new Profile(profileFields);

			await profile.save();

			res.status(200).json({ msg: "Profile created successfully", profile });
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// @route    DELETE api/profile
// @desc     Delete profile, user & orders, products
// @access   Private
router.delete("/", auth, async (req, res) => {
	try {
		// @TODO: remove orders
		// @TODO: remove products

		// Remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// Remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: "Account deleted" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
