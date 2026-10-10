import dotenv from 'dotenv';
import { z } from 'zod';

// Tests provide their own env (in-memory MongoDB); never load the real .env there.
if (process.env.NODE_ENV !== 'test') {
  dotenv.config({ quiet: true });
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4500),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  SECRET: z.string().min(1, 'SECRET is required'),
  PAYPAL_CLIENT_ID: z.string().default(''),
  // When set, PayPal captures are verified server-side before an order is marked paid.
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  PAYPAL_API_BASE: z.url().default('https://api-m.sandbox.paypal.com'),
  PRODUCTION_CLIENT_ORIGIN: z.url().optional(),
  DEVELOPMENT_CLIENT_ORIGIN: z.url().default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

export const parseEnv = (source: NodeJS.ProcessEnv): Env => {
  // Blank entries (e.g. `PORT=` copied from .env.example) count as unset so defaults apply.
  const raw = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== ''));
  const result = envSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  return result.data;
};

let cached: Env | undefined;

export const env = (): Env => {
  cached ??= parseEnv(process.env);
  return cached;
};

/** Re-reads process.env on the next env() call; for tests that change configuration. */
export const resetEnvCache = (): void => {
  cached = undefined;
};
