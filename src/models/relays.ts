import {Gpio} from "onoff";
import {Destructible} from "../utils/destroyRegistry.ts";

class Relays extends Destructible {
  private relays = [false, false, false, false, false, false, false, false];
  private relayPins = [530, 535, 536, 537, 520, 519, 529, 534];
  private relayErrors = [false, false, false, false, false, false, false, false];
  private gpios: Gpio[] = [];

  constructor() {
    super();
    this.relayPins.forEach((pin, index) => {
      console.log(`Set relay ${index} to 'off'`);
      try {
        this.gpios[index] = new Gpio(pin, 'out');
        this.gpios[index].writeSync(1);
      } catch (e) {
        console.error(`Failed to initialize relay ${index}:`, e);
        this.relayErrors[index] = true;
      }
    });
  }

  public getRelayStates() {
    return this.relays.map((relay) => relay);
  }

  public setRelayState(index: number, state: boolean) {
    if (this.relays[index] === undefined) return;

    this.relays[index] = state;

    console.log(`Set relay ${index} to '${state ? 'on' : 'off'}'`);
    if (!this.relayErrors[index] && this.gpios[index]){
      const val = this.relays[index] ? 0 : 1;
      try {
        this.gpios[index].writeSync(val);
      } catch (e) {
        console.error(`Failed to write relay ${index}:`, e);
        this.relayErrors[index] = true;
      }
    }
  }

  public getRelayState(index: number) {
    return this.relays[index];
  }

  public destroy() {
    console.log('Relays module is being destroyed');
    this.gpios.forEach((gpio, index) => {
      console.log(`Unexporting relay ${index}`);
      gpio.unexport();
    });
  }
}

export const relays = new Relays();