import type { Types } from 'mongoose';
import type { IOrder, IShippingAddress, OrderStatus } from '../models/Order.js';
import { priceOrder } from '../utils/pricing.js';

interface SeedUser {
  _id: Types.ObjectId;
  name: string;
}

interface SeedProduct {
  _id: Types.ObjectId;
  name: string;
  image: string;
  price: number;
}

const DAY = 24 * 60 * 60 * 1000;

const address = (fullName: string): IShippingAddress => ({
  fullName,
  address: '221B Baker Street',
  city: 'London',
  postalCode: 'NW1 6XE',
  country: 'United Kingdom',
});

// [days ago, status, [product index, qty][]] — spread over the last month so the dashboard chart has data.
const plan: Array<[number, OrderStatus, Array<[number, number]>]> = [
  [
    28,
    'delivered',
    [
      [0, 1],
      [1, 2],
    ],
  ],
  [25, 'delivered', [[13, 1]]],
  [
    22,
    'delivered',
    [
      [8, 1],
      [9, 1],
    ],
  ],
  [19, 'delivered', [[4, 1]]],
  [
    16,
    'shipped',
    [
      [14, 1],
      [17, 2],
    ],
  ],
  [13, 'delivered', [[11, 1]]],
  [
    10,
    'shipped',
    [
      [2, 1],
      [6, 2],
    ],
  ],
  [7, 'paid', [[12, 1]]],
  [
    5,
    'paid',
    [
      [15, 1],
      [19, 1],
    ],
  ],
  [3, 'shipped', [[10, 2]]],
  [
    1,
    'paid',
    [
      [0, 1],
      [16, 1],
    ],
  ],
  [0, 'pending', [[5, 1]]],
];

/** Demo orders in every status, alternating between the given customers. */
export const buildDemoOrders = (customers: SeedUser[], products: SeedProduct[], now = Date.now()): IOrder[] =>
  plan.map(([daysAgo, status, lines], index) => {
    const customer = customers[index % customers.length]!;
    const items = lines.map(([productIndex, qty]) => {
      const product = products[productIndex % products.length]!;
      return { product: product._id, name: product.name, image: product.image, price: product.price, qty };
    });
    const createdAt = new Date(now - daysAgo * DAY - 2 * 60 * 60 * 1000);
    const paidAt = status === 'pending' ? undefined : new Date(createdAt.getTime() + 10 * 60 * 1000);
    const shippedAt = ['shipped', 'delivered'].includes(status) ? new Date(createdAt.getTime() + DAY) : undefined;
    const deliveredAt = status === 'delivered' ? new Date(createdAt.getTime() + 3 * DAY) : undefined;
    return {
      user: customer._id,
      products: items,
      shippingAddress: address(customer.name),
      ...priceOrder(items),
      status,
      isPaymentDone: status !== 'pending',
      paymentResult: paidAt ? { id: `DEMO-${index + 1}`, status: 'COMPLETED' } : undefined,
      paidAt,
      shippedAt,
      deliveredAt,
      createdAt,
      updatedAt: deliveredAt ?? shippedAt ?? paidAt ?? createdAt,
    };
  });
