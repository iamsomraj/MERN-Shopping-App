const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	name: {
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
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;
