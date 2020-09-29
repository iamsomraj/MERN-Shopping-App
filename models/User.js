const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		// contact: {
		// 	type: String,
		// 	required: true,
		// },
		// image: {
		// 	type: String,
		// 	required: true,
		// },
		// date: {
		// 	type: Date,
		// 	default: Date.now,
		// },
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("user", userSchema);

module.exports = User;
