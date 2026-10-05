import { describe, expect, it } from 'vitest';
import { parseEnv } from '../src/config/env.js';

const required = { MONGODB_URI: 'mongodb://localhost:27017/x', SECRET: 's' };

describe('parseEnv', () => {
  it('applies defaults, treating blank values from .env.example as unset', () => {
    const env = parseEnv({
      ...required,
      PORT: '',
      NODE_ENV: '',
      PRODUCTION_CLIENT_ORIGIN: '',
      DEVELOPMENT_CLIENT_ORIGIN: '',
      PAYPAL_CLIENT_ID: '',
    });
    expect(env).toMatchObject({
      NODE_ENV: 'development',
      PORT: 4500,
      DEVELOPMENT_CLIENT_ORIGIN: 'http://localhost:5173',
      PAYPAL_CLIENT_ID: '',
    });
    expect(env.PRODUCTION_CLIENT_ORIGIN).toBeUndefined();
  });

  it('coerces PORT to a number', () => {
    expect(parseEnv({ ...required, PORT: '8080' }).PORT).toBe(8080);
  });

  it('fails fast listing every missing or invalid variable', () => {
    expect(() => parseEnv({ PORT: 'abc', NODE_ENV: 'staging' })).toThrowError(
      /MONGODB_URI[\s\S]*SECRET|SECRET[\s\S]*MONGODB_URI/
    );
    expect(() => parseEnv({ ...required, PORT: 'abc' })).toThrowError(/PORT/);
    expect(() => parseEnv({ ...required, NODE_ENV: 'staging' })).toThrowError(/NODE_ENV/);
    expect(() => parseEnv({ ...required, PRODUCTION_CLIENT_ORIGIN: 'not a url' })).toThrowError(
      /PRODUCTION_CLIENT_ORIGIN/
    );
  });
});
