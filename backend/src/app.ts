import cors from 'cors';
import express, { type Express } from 'express';
import morgan from 'morgan';
import { connectToDatabase } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, pageNotFound } from './middlewares/error.js';
import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';

export const createApp = (): Express => {
  const config = env();
  const app = express();

  app.use(
    cors({
      origin: config.NODE_ENV === 'production' ? config.PRODUCTION_CLIENT_ORIGIN : config.DEVELOPMENT_CLIENT_ORIGIN,
      methods: ['POST', 'GET', 'PUT', 'DELETE'],
    })
  );

  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use(express.json());

  app.get('/', (_req, res) => {
    res.send('Our Express API is running..');
  });

  // Every API request waits for the (cached) DB connection, so cold starts on Vercel don't race it.
  app.use('/api', async (_req, _res, next) => {
    await connectToDatabase();
    next();
  });

  app.use('/api/users', userRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.get('/api/config/paypal', (_req, res) => {
    res.send(config.PAYPAL_CLIENT_ID);
  });

  app.use(pageNotFound);
  app.use(errorHandler);

  return app;
};

const app = createApp();

export default app;
