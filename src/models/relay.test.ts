import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';

const writeSyncMock = jest.fn();
const unexportMock = jest.fn();

const gpioConstructorMock = jest.fn().mockImplementation(() => ({
  writeSync: writeSyncMock,
  unexport: unexportMock,
}));

jest.unstable_mockModule('onoff', () => ({
  Gpio: gpioConstructorMock,
}));

const { Relay } = await import('./relay.ts');

describe('Relay', () => {
  let consoleLogSpy: jest.SpiedFunction<typeof console.log>;
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    jest.clearAllMocks();

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('initializes gpio as output and sets relay off', () => {
    const relay = new Relay(17, 'pump', 0);

    expect(gpioConstructorMock).toHaveBeenCalledWith(17, 'out');
    expect(writeSyncMock).toHaveBeenCalledWith(1);
    expect(relay.getState()).toBe(false);
  });

  it('sets relay state to on and writes inverted gpio value', () => {
    const relay = new Relay(17, 'pump', 0);

    relay.setState(true);

    expect(relay.getState()).toBe(true);
    expect(writeSyncMock).toHaveBeenLastCalledWith(0);
  });

  it('sets relay state to off and writes inverted gpio value', () => {
    const relay = new Relay(17, 'pump', 0);

    relay.setState(true);
    relay.setState(false);

    expect(relay.getState()).toBe(false);
    expect(writeSyncMock).toHaveBeenLastCalledWith(1);
  });

  it('does not throw when gpio initialization fails', () => {
    gpioConstructorMock.mockImplementationOnce(() => {
      throw new Error('GPIO unavailable');
    });

    const relay = new Relay(17, 'pump', 0);

    expect(relay.getState()).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize relay pump:',
      expect.any(Error),
    );

    expect(() => relay.setState(true)).not.toThrow();
    expect(relay.getState()).toBe(true);
  });

  it('sets gpio to null when writing fails', () => {
    writeSyncMock.mockImplementationOnce(() => undefined);
    writeSyncMock.mockImplementationOnce(() => {
      throw new Error('Write failed');
    });

    const relay = new Relay(17, 'pump', 0);

    relay.setState(true);
    relay.setState(false);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to write relay pump:',
      expect.any(Error),
    );

    writeSyncMock.mockClear();

    relay.setState(true);

    expect(writeSyncMock).not.toHaveBeenCalled();
    expect(relay.getState()).toBe(true);
  });

  it('registers state change callback and calls it immediately with current state', () => {
    const relay = new Relay(17, 'pump', 0);
    const callback = jest.fn();

    relay.onStateChange('test-callback', callback);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(false);
  });

  it('warns when state change callback id already exists', () => {
    const relay = new Relay(17, 'pump', 0);

    relay.onStateChange('duplicate-id', jest.fn());
    relay.onStateChange('duplicate-id', jest.fn());

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "State change callback with id 'duplicate-id' already exists. Overwriting...",
    );
  });

  it('removes state change callback without throwing', () => {
    const relay = new Relay(17, 'pump', 0);

    relay.onStateChange('test-callback', jest.fn());

    expect(() => relay.removeStateChangeCallback('test-callback')).not.toThrow();
  });

  it('unexports gpio and resets state on destroy', () => {
    const relay = new Relay(17, 'pump', 0);

    relay.setState(true);
    relay.destroy();

    expect(unexportMock).toHaveBeenCalledTimes(1);
    expect(relay.getState()).toBe(false);
  });
});