import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    exclude: [...configDefaults.exclude, 'dist/**'],
    setupFiles: ['tests/setup.ts'],
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
