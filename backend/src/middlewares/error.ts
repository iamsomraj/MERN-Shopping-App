import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export const pageNotFound = (req: Request, _res: Response, next: NextFunction): void => {
  next(new HttpError(404, `Page Not Found - ${req.originalUrl}`));
};

const statusFor = (err: unknown): number => {
  if (err instanceof HttpError) return err.status;
  // Malformed ObjectIds in :id params should read as "not found", not a server error.
  if (err instanceof mongoose.Error.CastError) return 404;
  if (err instanceof mongoose.Error.ValidationError) return 400;
  return 500;
};

export const errorHandler = (err: unknown, _req: Request, res: Response, next: NextFunction): void => {
  if (res.headersSent) {
    next(err);
    return;
  }
  const error = err instanceof Error ? err : new Error(String(err));
  const status = statusFor(err);
  if (status >= 500 && env().NODE_ENV !== 'test') {
    console.error(error);
  }
  res.status(status).json({
    message: error.message,
    stack: env().NODE_ENV === 'production' ? null : error.stack,
  });
};
