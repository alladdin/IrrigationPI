import type {NextFunction, Request, Response} from "express";
import {relays} from "../models/relays.ts";

export const getRelays = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(relays.getRelayStates());
  } catch (error) {
    next(error);
  }
};

export const getRelay = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(<string>req.params.id);
    res.json({"state": relays.getRelayState(id)});
  } catch (error) {
    next(error);
  }
}

export const setRelay = (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(<string>req.params.id);
    const { state } = req.body;
    relays.setRelayState(id, state);
    res.json({"state": relays.getRelayState(id)});
  } catch (error) {
    next(error);
  }
}

export const setAllRelays = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { state } = req.body;
    relays.getRelayStates().forEach((relay, index) => relays.setRelayState(index, state));
    res.json(relays.getRelayStates());
  } catch (error) {
    next(error);
  }
}
