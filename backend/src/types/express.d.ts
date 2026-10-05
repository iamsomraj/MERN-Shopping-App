import type { UserDocument } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}

export {};
