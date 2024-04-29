import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  verbose: true,
  maxWorkers: 1,
  testPathIgnorePatterns: ['/node_modules/', 'telegram-logger-pkg/__tests__/support/', '/dist/'],
  setupFiles: ['<rootDir>/telegram-logger-pkg/__tests__/support/boot.ts'],
};

export default config;
