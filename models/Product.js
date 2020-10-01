const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "user" },
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
