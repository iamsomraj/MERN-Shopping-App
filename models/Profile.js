const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
		image: {
			type: String,
			required: true,
		},
		contact: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
