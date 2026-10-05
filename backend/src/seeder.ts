import { styleText } from 'node:util';
import { connectToDatabase, disconnectFromDatabase } from './config/database.js';
import { products } from './data/products.js';
import { users } from './data/users.js';
import { Order } from './models/Order.js';
import { Product } from './models/Product.js';
import { User } from './models/User.js';

const clearData = async (): Promise<void> => {
  await Order.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
};

const importData = async (): Promise<void> => {
  await clearData();
  const [adminUser] = await User.insertMany(users);
  if (!adminUser) throw new Error('Seed data has no users');
  await Product.insertMany(products.map((product) => ({ ...product, user: adminUser._id })));
  console.log(styleText(['green', 'bold'], 'Data is added!'));
};

const destroyData = async (): Promise<void> => {
  await clearData();
  console.log(styleText(['cyan', 'bold'], 'Data is deleted!'));
};

try {
  await connectToDatabase();
  await (process.argv[2] === '-d' ? destroyData() : importData());
  await disconnectFromDatabase();
} catch (error) {
  console.error(styleText('red', String(error)));
  process.exit(1);
}
