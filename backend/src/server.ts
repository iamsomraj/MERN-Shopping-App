import { styleText } from 'node:util';
import app from './app.js';
import { connectToDatabase } from './config/database.js';
import { env } from './config/env.js';

const { NODE_ENV, PORT } = env();

await connectToDatabase();

app.listen(PORT, () => {
  console.log(styleText(['yellow', 'bold'], `Server running in ${NODE_ENV} mode on port ${PORT}`));
});
