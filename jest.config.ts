import type { Config } from 'jest';

const config: Config = {
  bail: true,
  clearMocks: true,
  coverageProvider: 'v8',
  preset: 'ts-jest',
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: ['node_modules/(?!(@prisma)/)'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        module: 'esnext'
      }
    }
  }
};

export default config;