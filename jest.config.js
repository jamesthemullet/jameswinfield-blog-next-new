/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testPathIgnorePatterns: ['<rootDir>/e2e/'],
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        moduleResolution: 'node',
        rootDir: '.',
        ignoreDeprecations: '6.0',
      },
    }],
  },
};
