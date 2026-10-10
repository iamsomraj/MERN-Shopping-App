import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

const UNAUTHORIZED_USER = 'Unauthorized User Access';

const bearerToken = (req: Request): string | undefined => {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : undefined;
};

/** The signed-in user's id on public routes, or undefined for guests and invalid tokens. */
export const optionalUserId = (req: Request): string | undefined => {
  const token = bearerToken(req);
  if (!token) return undefined;
  try {
    const id = (jwt.verify(token, env().SECRET) as jwt.JwtPayload).id;
    return typeof id === 'string' ? id : undefined;
  } catch {
    return undefined;
  }
};

export const userAuth = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  const token = bearerToken(req);
  if (!token) {
    throw new HttpError(401, UNAUTHORIZED_USER);
  }

  let userId: unknown;
  try {
    userId = (jwt.verify(token, env().SECRET) as jwt.JwtPayload).id;
  } catch {
    throw new HttpError(401, UNAUTHORIZED_USER);
  }

  const user = typeof userId === 'string' ? await User.findById(userId).select('-password') : null;
  if (!user) {
    throw new HttpError(401, UNAUTHORIZED_USER);
  }

  req.user = user;
  next();
};

export const adminAuth = (req: Request, _res: Response, next: NextFunction): void => {
  if (!req.user?.isAdmin) {
    throw new HttpError(401, 'Unauthorized Admin Access');
  }
  next();
};
