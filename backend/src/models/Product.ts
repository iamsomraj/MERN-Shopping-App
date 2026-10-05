import { type HydratedDocument, Schema, type Types, model } from 'mongoose';

export interface IProduct {
  user: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  qtyInStock: number;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ProductDocument = HydratedDocument<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    qtyInStock: { type: Number, required: true, default: 1 },
    isAvailable: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
