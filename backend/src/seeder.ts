import { styleText } from 'node:util';
import { connectToDatabase, disconnectFromDatabase } from './config/database.js';
import { clearDatabase, seedDatabase } from './data/seed.js';

try {
  await connectToDatabase();
  if (process.argv[2] === '-d') {
    await clearDatabase();
    console.log(styleText(['cyan', 'bold'], 'Data is deleted!'));
  } else {
    await seedDatabase();
    console.log(styleText(['green', 'bold'], 'Data is added!'));
  }
  await disconnectFromDatabase();
} catch (error) {
  console.error(styleText('red', String(error)));
  process.exit(1);
}
