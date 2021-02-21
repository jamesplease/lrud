import warning, {resetCodeCache} from "./warning";

beforeEach(() => {
  jest.resetModules();
  jest.resetAllMocks();
})

describe('warning()', () => {
  it('calls console.error', () => {
    expect.assertions(2);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => ({error: () => {}}));

    const mockErrorMessage = 'Cake wasn\'t good!';
    const mockErrorCode = 'BAD_CAKE';
    warning(mockErrorMessage, mockErrorCode);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockErrorMessage);
  });

  it('does not call console.error again if warning() was called with the same code', () => {
    expect.assertions(2);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => ({error: () => {}}));

    const mockErrorMessage = 'Who ate all the cake?';
    const mockErrorCode = 'NEED_MORE_CAKE';

    warning(mockErrorMessage, mockErrorCode);

    warning(mockErrorMessage, mockErrorCode);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockErrorMessage);
  });
})

describe('resetCodeCache()', () => {
  it('clears the codeCache, allowing repeat calls of the same code', () => {
    expect.assertions(2);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => ({error: () => {}}));

    const mockErrorMessage = 'Where is my slice of cake?';
    const mockErrorCode = 'USER_MISSING_CAKE';

    warning(mockErrorMessage, mockErrorCode);

    resetCodeCache();

    warning(mockErrorMessage, mockErrorCode);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockErrorMessage);
  })
})