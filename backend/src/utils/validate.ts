import type { z } from 'zod';
import { HttpError } from './httpError.js';

/** Parses `data` with `schema`, turning the first validation issue into a 400. */
export const validate = <T extends z.ZodType>(schema: T, data: unknown): z.infer<T> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const [issue] = result.error.issues;
    const field = issue?.path.join('.');
    throw new HttpError(400, field ? `${field}: ${issue?.message}` : (issue?.message ?? 'Invalid request'));
  }
  return result.data;
};
