import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';

const getRelayStatesMock = jest.fn<() => boolean[]>();
const getRelayStateMock = jest.fn<(id: number) => boolean>();
const setRelayStateMock = jest.fn<(id: number, state: boolean) => void>();

jest.unstable_mockModule('../models/relays.ts', () => ({
  relays: {
    getRelayStates: getRelayStatesMock,
    getRelayState: getRelayStateMock,
    setRelayState: setRelayStateMock,
  },
}));

const { getRelays, getRelay, setRelay, setAllRelays } = await import('./relayController.ts');

describe('relayController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      params: {},
      body: {},
    } as unknown as Request;
    res = {
      json: jest.fn().mockReturnValue({}),
    } as unknown as Response;
    next = jest.fn() as unknown as NextFunction;
  });

  describe('getRelays', () => {
    it('should return all relay states', () => {
      const mockStates = [true, false];
      getRelayStatesMock.mockReturnValue(mockStates);

      getRelays(req, res, next);

      expect(getRelayStatesMock).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockStates);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if it throws', () => {
      const error = new Error('Test error');
      getRelayStatesMock.mockImplementation(() => {
        throw error;
      });

      getRelays(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getRelay', () => {
    it('should return a single relay state', () => {
      req.params.id = '1';
      getRelayStateMock.mockReturnValue(true);

      getRelay(req, res, next);

      expect(getRelayStateMock).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ state: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if it throws', () => {
      req.params.id = '1';
      const error = new Error('Test error');
      getRelayStateMock.mockImplementation(() => {
        throw error;
      });

      getRelay(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('setRelay', () => {
    it('should set a relay state and return it', () => {
      req.params.id = '1';
      req.body.state = true;
      getRelayStateMock.mockReturnValue(true);

      setRelay(req, res, next);

      expect(setRelayStateMock).toHaveBeenCalledWith(1, true);
      expect(getRelayStateMock).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ state: true });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if it throws', () => {
      req.params.id = '1';
      req.body.state = true;
      const error = new Error('Test error');
      setRelayStateMock.mockImplementation(() => {
        throw error;
      });

      setRelay(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('setAllRelays', () => {
    it('should set all relays and return their states', () => {
      req.body.state = false;
      const initialStates = [true, true];
      const finalStates = [false, false];
      
      getRelayStatesMock
        .mockReturnValueOnce(initialStates)
        .mockReturnValueOnce(finalStates);

      setAllRelays(req, res, next);

      expect(getRelayStatesMock).toHaveBeenCalledTimes(2);
      expect(setRelayStateMock).toHaveBeenCalledTimes(2);
      expect(setRelayStateMock).toHaveBeenNthCalledWith(1, 0, false);
      expect(setRelayStateMock).toHaveBeenNthCalledWith(2, 1, false);
      expect(res.json).toHaveBeenCalledWith(finalStates);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if it throws', () => {
      req.body.state = false;
      const error = new Error('Test error');
      getRelayStatesMock.mockImplementation(() => {
        throw error;
      });

      setAllRelays(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
