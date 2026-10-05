import type { Request } from 'express';
import type { UserDocument } from '../models/User.js';
import { HttpError } from './httpError.js';

/** Returns the user set by `userAuth`; only use on routes behind that middleware. */
export const requireUser = (req: Request): UserDocument => {
  if (!req.user) {
    throw new HttpError(401, 'Unauthorized User Access');
  }
  return req.user;
};
