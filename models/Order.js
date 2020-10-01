const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: "user" },
	orders: [
		{
			products: [
				{
					productId: { type: String, required: true },
					price: { type: String, required: true },
					quantity: { type: Number, required: true },
				},
			],
			date: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
