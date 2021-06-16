module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**'],
  coverageDirectory: 'coverage',
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest-setup.js'],
};
