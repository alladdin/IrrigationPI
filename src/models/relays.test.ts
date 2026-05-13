import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { RelaysConfig } from '../config/relayConfig.ts';

type MockRelay = {
  pin: number;
  name: string;
  index: number;
  state: boolean;
  getState: jest.Mock<() => boolean>;
  setState: jest.Mock<(state: boolean) => void>;
};

let configRelays: RelaysConfig = {};
const relayInstances: MockRelay[] = [];

const configGetMock = jest.fn<(key: string) => RelaysConfig>((key: string) => {
  if (key !== 'relays') {
    throw new Error(`Unexpected config key: ${key}`);
  }

  return configRelays;
});

const relayConstructorMock = jest.fn(
  (pin: number, name: string, index: number): MockRelay => {
    const relay: MockRelay = {
      pin,
      name,
      index,
      state: false,
      getState: jest.fn(() => relay.state),
      setState: jest.fn((state: boolean) => {
        relay.state = state;
      }),
    };

    relayInstances[index] = relay;

    return relay;
  },
);

jest.unstable_mockModule('config', () => ({
  default: {
    get: configGetMock,
  },
}));

jest.unstable_mockModule('./relay.ts', () => ({
  Relay: relayConstructorMock,
}));

const importRelays = async () => {
  const module = await import('./relays.ts');
  return module.relays;
};

describe('relays', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    relayInstances.length = 0;
    configRelays = {
      pump: { pin: 17, relay: 0 },
      valve: { pin: 27, relay: 2 },
    };
  });

  it('creates relays from config by configured relay index', async () => {
    await importRelays();

    expect(configGetMock).toHaveBeenCalledWith('relays');
    expect(relayConstructorMock).toHaveBeenCalledTimes(2);
    expect(relayConstructorMock).toHaveBeenCalledWith(17, 'pump', 0);
    expect(relayConstructorMock).toHaveBeenCalledWith(27, 'valve', 2);
    expect(relayInstances[0]?.name).toBe('pump');
    expect(relayInstances[2]?.name).toBe('valve');
  });

  it('returns relay states by relay index and preserves gaps', async () => {
    const relays = await importRelays();

    relayInstances[0]!.state = true;
    relayInstances[2]!.state = false;

    const states = relays.getRelayStates();

    expect(states).toHaveLength(3);
    expect(states[0]).toBe(true);
    expect(states[1]).toBeUndefined();
    expect(states[2]).toBe(false);
    expect(relayInstances[0]!.getState).toHaveBeenCalledTimes(1);
    expect(relayInstances[2]!.getState).toHaveBeenCalledTimes(1);
  });

  it('sets state only for an existing relay', async () => {
    const relays = await importRelays();

    relays.setRelayState(0, true);
    relays.setRelayState(1, true);

    expect(relayInstances[0]!.setState).toHaveBeenCalledWith(true);
    expect(relayInstances[2]!.setState).not.toHaveBeenCalled();
  });

  it('returns false for a missing relay state', async () => {
    const relays = await importRelays();

    expect(relays.getRelayState(1)).toBe(false);
  });

  it('returns state for an existing relay', async () => {
    const relays = await importRelays();

    relayInstances[2]!.state = true;

    expect(relays.getRelayState(2)).toBe(true);
    expect(relayInstances[2]!.getState).toHaveBeenCalledTimes(1);
  });
});
