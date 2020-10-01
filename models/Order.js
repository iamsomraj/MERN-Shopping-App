const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "user",
	},
	product: {
		type: Schema.Types.ObjectId,
		ref: "product",
	},
	quantity: {
		type: Number,
		default: 1,
	},
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
