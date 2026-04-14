import type { JestConfigWithTsJest } from 'ts-jest';

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '\\.pcss$': '<rootDir>/src/__mocks__/styleMock.cjs',
  },
  coverageReporters: ['lcov', 'json-summary', 'text-summary'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      { useESM: true },
    ],
  },
} as JestConfigWithTsJest;
