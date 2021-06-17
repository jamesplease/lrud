import { warning } from './warning';

describe('warning', () => {
  beforeEach(() => {
    if (warning.mockRestore) {
      warning.mockRestore();
    }
  });

  it('defaults to warning', () => {
    warning('uh oh', 'key');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toEqual('uh oh');
  });

  it('should log one time for duplicate calls', () => {
    warning('uh oh', 'key');
    warning('uh oh', 'key');

    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error.mock.calls[0][0]).toEqual('uh oh');
  });
});
