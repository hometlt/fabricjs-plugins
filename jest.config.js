module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
};
