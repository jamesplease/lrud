require('@testing-library/jest-dom');
const warning = require('./src/utils/warning');

beforeEach(() => {
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }

  if (console.warn.mockRestore) {
    console.warn.mockRestore();
  }

  if (warning.warning.mockRestore) {
    warning.warning.mockRestore();
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(warning, 'warning').mockImplementation(() => {});

  warning.resetCodeCache();
});
