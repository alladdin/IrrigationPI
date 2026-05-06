import {Gpio} from "onoff";

class Relays {
  private relays = [false, false, false, false, false, false, false, false];
//  private relayPins = [18, 23, 24, 25, 8, 7, 17, 22];
  private relayPins = [530, 535, 536, 537, 520, 519, 529, 534];
  private relayErrors = [false, false, false, false, false, false, false, false];
  private gpios: Gpio[] = [];

  constructor() {
    this.relayPins.forEach((pin, index) => {
      this.gpios[index] = new Gpio(pin, 'out');
      this.gpios[index].writeSync(1);
    });
  }

  public getRelayStates() {
    return this.relays.map((relay) => relay);
  }

  public setRelayState(index: number, state: boolean) {
    if (this.relays[index] === undefined) return;

    this.relays[index] = state;

    if (!this.relayErrors[index] && this.gpios[index]){
      const val = this.relays[index] ? 0 : 1;
      this.gpios[index].writeSync(val);
    }
  }

  public getRelayState(index: number) {
    return this.relays[index];
  }

  public destroy() {
    this.gpios.forEach((gpio) => {
      gpio.unexport();
    });
  }
}

export const relays = new Relays();

process.on('SIGINT', _ => {
    relays.destroy();
});