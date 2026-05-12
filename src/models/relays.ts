import {Relay} from "./relay.ts";
import config from "config";
import type {RelaysConfig} from "../config/relayConfig.ts";

class Relays {
  private relays: Relay[] = [];

  constructor() {
    const configRelays: RelaysConfig = config.get('relays');

    Object.keys(configRelays).forEach((key) => {
      const configRelay = configRelays[key];
      if (configRelay === undefined) return;
      this.relays[configRelay.relay] = new Relay(configRelay.pin, key, configRelay.relay);
    });
  }

  public getRelayStates() {
    return this.relays.map((relay) => relay.getState());
  }

  public setRelayState(index: number, state: boolean) {
    if (this.relays[index] === undefined) return;

    this.relays[index].setState(state);
  }

  public getRelayState(index: number) {
    if (this.relays[index] === undefined) return false;
    return this.relays[index].getState();
  }
}

export const relays = new Relays();