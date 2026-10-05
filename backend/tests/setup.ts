import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll } from 'vitest';

// Runs before any app module is imported, so env() validates against these values, never the real .env.
process.env.NODE_ENV = 'test';
process.env.SECRET = 'test-secret';
process.env.PAYPAL_CLIENT_ID = 'test-paypal-client';

const mongo = await MongoMemoryServer.create();
process.env.MONGODB_URI = mongo.getUri('mern-shop-test');

afterAll(async () => {
  const { disconnectFromDatabase } = await import('../src/config/database.js');
  await disconnectFromDatabase();
  await mongo.stop();
});
