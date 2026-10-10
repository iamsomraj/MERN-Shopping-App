import bcrypt from 'bcryptjs';
import type { IUser } from '../models/User.js';

// Passwords are pre-hashed because insertMany skips the save hook.
export const users: Array<Omit<IUser, 'isAdmin' | 'wishlist'> & { isAdmin?: boolean }> = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    name: 'Somraj Mukherjee',
    email: 'somraj@example.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
  },
];
