import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['unit/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/public/**',
      '**/webmscore-fork/**',
      '**/tests/**', // Playwright e2e tests
      '**/test-results/**',
      '**/playwright-report/**',
      '**/blob-report/**',
    ],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'html', 'lcov'],
      all: true,
      include: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'scripts/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        'next-env.d.ts',
        '.next/**',
        'public/**',
        'webmscore-fork/**',
        'tests/**',
        'unit/**',
      ],
    },
  },
});

