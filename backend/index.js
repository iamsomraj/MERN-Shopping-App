import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import colors from 'colors';
import connectToDatabase from './config/database.js';
import { errorHandler, pageNotFound } from './middlewares/error.js';

import orderRoutes from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

connectToDatabase();

const app = express();

app.use(
  cors({
    origin: [process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_CLIENT_ORIGIN : process.env.DEVELOPMENT_CLIENT_ORIGIN],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) => res.send(process.env.PAYPAL_CLIENT_ID));

const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 4500;

app.get('/', (_req, res) => {
  res.send('Our Express API is running..');
});

app.use(pageNotFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${MODE} mode on port ${PORT}`.yellow.bold);
});
