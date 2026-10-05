import request from 'supertest';
import app from '../src/app.js';
import { connectToDatabase } from '../src/config/database.js';
import { products } from '../src/data/products.js';
import { users } from '../src/data/users.js';
import { Order } from '../src/models/Order.js';
import { Product } from '../src/models/Product.js';
import { User } from '../src/models/User.js';

export const api = () => request(app);

export const seed = async () => {
  if (!process.env.MONGODB_URI?.includes('127.0.0.1')) {
    throw new Error('Refusing to seed: tests must run against the in-memory MongoDB');
  }
  await connectToDatabase();
  await Promise.all([Order.deleteMany(), Product.deleteMany(), User.deleteMany()]);
  const [admin] = await User.insertMany(users);
  await Product.insertMany(products.map((product) => ({ ...product, user: admin!._id })));
};

export const login = async (email: string, password = '123456'): Promise<string> => {
  const res = await api().post('/api/users/login').send({ email, password });
  return res.body.token as string;
};

export const ADMIN = 'admin@example.com';
export const CUSTOMER = 'john@example.com';
export const OTHER_CUSTOMER = 'jane@example.com';
