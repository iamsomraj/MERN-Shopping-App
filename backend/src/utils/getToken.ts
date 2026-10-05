import jwt from 'jsonwebtoken';
import type { Types } from 'mongoose';
import { env } from '../config/env.js';

export const getToken = (id: Types.ObjectId | string): string =>
  jwt.sign({ id: id.toString() }, env().SECRET, { expiresIn: '5d' });
