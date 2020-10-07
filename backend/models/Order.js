import mongoose from "mongoose";

const { Schema, model } = mongoose;

const OrderSchema = Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		products: [
			{
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				price: { type: Number, required: true },
				product: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
			},
		],
		totalPrice: {
			type: Number,
			required: true,
			default: 0.0,
		},
		isPaymentDone: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const Order = model("Order", OrderSchema);

export default Order;
