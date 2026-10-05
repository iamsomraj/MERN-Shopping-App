import mongoose from 'mongoose';
import { styleText } from 'node:util';
import { env } from './env.js';

let connection: Promise<typeof mongoose> | undefined;

// Reuses one connection per process, which also keeps Vercel's warm function invocations from reconnecting.
export const connectToDatabase = (): Promise<typeof mongoose> => {
  if (!connection) {
    connection = mongoose
      .connect(env().MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
      .then((conn) => {
        if (env().NODE_ENV !== 'test') {
          console.log(styleText(['yellow', 'bold'], 'Database is connected'));
        }
        return conn;
      })
      .catch((error: unknown) => {
        connection = undefined;
        throw error;
      });
  }
  return connection;
};

export const disconnectFromDatabase = async (): Promise<void> => {
  connection = undefined;
  await mongoose.disconnect();
};
