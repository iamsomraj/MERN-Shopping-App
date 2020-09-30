const express = require("express");
const path = require("path");
const router = express.Router();
const auth = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

const multer = require("multer");

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./uploads/");
	},
	filename: function (req, file, cb) {
		cb(null, req.user.id + ".png");
	},
});

const fileFilter = (req, file, cb) => {
	// reject a file
	if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5,
	},
	fileFilter: fileFilter,
});

// @desc     Get current logged in user's profile
// @access   Private
// @route    api/profile/
router.get("/", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "email"]);

		if (!profile) {
			return res
				.status(400)
				.json({ errors: [{ msg: "There is no profile for this user" }] });
		}

		res.status(200).json({ msg: "Profile fetched successfully", profile });
	} catch (err) {
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error : Get profile" }] });
	}
});

// @desc     Create or update user profile
// @access   Private
// @route    api/profile
router.post(
	"/",
	[
		auth,
		upload.single("image"),
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
			image: req.file.path,
			contact,
			address,
		};

		try {
			let user = await User.findById(req.user.id);

			if (!user) {
				return res.status(400).json({ errors: [{ msg: "User not found" }] });
			}

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
			return res
				.status(400)
				.json({ errors: [{ msg: "Internal server error : C/U profile" }] });
		}
	}
);

// @route    DELETE api/profile
// @desc     Delete profile, user & orders, products
// @access   Private
router.delete("/delete", auth, async (req, res) => {
	try {
		// @TODO	remove orders
		// @TODO	remove products

		await Profile.findOneAndRemove({ user: req.user.id });
		await User.findOneAndRemove({ _id: req.user.id });

		const fs = require("fs");

		const path = "./uploads/" + req.user.id + ".png";

		fs.unlink(path, (err) => {
			if (err) {
				return;
			}
		});

		res.json({ msg: "Profile deleted" });
	} catch (err) {
		console.error(err.message);
		return res
			.status(500)
			.json({ errors: [{ msg: "Internal Server Error : Delete account" }] });
	}
});

module.exports = router;
