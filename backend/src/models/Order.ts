import { type HydratedDocument, Schema, type Types, model } from 'mongoose';

export const ORDER_STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/** Statuses that mean the order has been paid for. */
export const PAID_STATUSES: OrderStatus[] = ['paid', 'shipped', 'delivered'];

export interface IOrderItem {
  name: string;
  image?: string;
  qty: number;
  price: number;
  product: Types.ObjectId;
}

export interface IShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface IPaymentResult {
  id: string;
  status: string;
  updateTime?: string;
  email?: string;
}

export interface IOrder {
  user: Types.ObjectId;
  products: IOrderItem[];
  shippingAddress?: IShippingAddress;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: OrderStatus;
  /** Kept in sync with `status` for older clients. */
  isPaymentDone: boolean;
  paymentResult?: IPaymentResult;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
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
        image: { type: String },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
        product: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
      },
    ],
    shippingAddress: {
      fullName: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
    },
    itemsPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    isPaymentDone: { type: Boolean, required: true, default: false },
    paymentResult: { id: String, status: String, updateTime: String, email: String },
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

// A PayPal payment can only ever pay for one order.
OrderSchema.index(
  { 'paymentResult.id': 1 },
  { unique: true, partialFilterExpression: { 'paymentResult.id': { $type: 'string' } } }
);

OrderSchema.pre('save', function () {
  this.isPaymentDone = PAID_STATUSES.includes(this.status);
});

export const Order = model<IOrder>('Order', OrderSchema);
