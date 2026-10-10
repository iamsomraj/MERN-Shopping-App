import { randomUUID } from 'node:crypto';
import request from 'supertest';
import app from '../src/app.js';
import { connectToDatabase } from '../src/config/database.js';
import { seedDatabase } from '../src/data/seed.js';

export const api = () => request(app);

/** Users and products only; pass `{ demo: true }` to also seed demo orders and reviews. */
export const seed = async ({ demo = false }: { demo?: boolean } = {}) => {
  if (!process.env.MONGODB_URI?.includes('127.0.0.1')) {
    throw new Error('Refusing to seed: tests must run against the in-memory MongoDB');
  }
  await connectToDatabase();
  await seedDatabase({ demo });
};

export const seedWithDemoData = () => seed({ demo: true });

// The public demo password every seeded user has (see src/data/users.ts and the README).
export const SEED_PASSWORD = '123456';

/** Fresh throwaway password, so tests carry no hardcoded credentials. */
export const randomPassword = (): string => randomUUID();

export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export const SHIPPING_ADDRESS = {
  fullName: 'John Doe',
  address: '1 Test Street',
  city: 'Testville',
  postalCode: '12345',
  country: 'Testland',
};

export const login = async (email: string, password = SEED_PASSWORD): Promise<string> => {
  const res = await api().post('/api/users/login').send({ email, password });
  return res.body.token as string;
};

export const ADMIN = 'admin@example.com';
export const CUSTOMER = 'john@example.com';
export const OTHER_CUSTOMER = 'jane@example.com';
