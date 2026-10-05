import { type HydratedDocument, Schema, type Types, model } from 'mongoose';

export interface IOrderItem {
  name: string;
  qty: number;
  price: number;
  product: Types.ObjectId;
}

export interface IOrder {
  user: Types.ObjectId;
  products: IOrderItem[];
  totalPrice: number;
  isPaymentDone: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    products: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaymentDone: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Order', OrderSchema);
