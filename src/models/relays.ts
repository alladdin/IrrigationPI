import {Relay} from "./relay.ts";

class Relays {
  private relays: Relay[] = [];
  private relayPins = [530, 535, 536, 537, 520, 519, 529, 534];

  constructor() {
    this.relayPins.forEach((pin) => {
      this.relays.push(new Relay(pin));
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