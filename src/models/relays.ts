import {Relay} from "./relay.ts";
import config from "config";

class Relays {
  private relays: Relay[] = [];

  constructor() {
    const configRelays = config.get('relays');

    //@ts-ignore
    Object.keys(configRelays).forEach((key) => {
      //@ts-ignore
      const {pin, relay} = configRelays[key];
      this.relays[relay] = new Relay(pin, key, relay);
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