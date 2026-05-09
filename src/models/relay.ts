import {Gpio} from "onoff";
import {Destructible} from "../utils/destroyRegistry.ts";

type stateCallbackType = Record<string, (state: boolean) => void>;

export class Relay extends Destructible {
  private readonly pin: number;
  private readonly name: string;
  private readonly index: number;
  private gpio: Gpio | null = null;
  private state: boolean = false;
  private stateChangeCallbacks: stateCallbackType = {};

  constructor(pin: number, name: string, index: number) {
    super();
    this.pin = pin;
    this.name = name;
    this.index = index;

    try {
      this.gpio = new Gpio(pin, 'out');
      this.gpio.writeSync(1);
    } catch (e) {
      console.error(`Failed to initialize relay ${this.name}:`, e);
      this.gpio = null;
    }
    this.state = false;
    console.log(`Set relay ${this.name} to 'off'`);
  }

  getState(): boolean {
    return this.state;
  }

  setState(state: boolean) {
    console.log(`Set relay ${this.name} to '${state ? 'on' : 'off'}'`);
    this.state = state;
    if (this.gpio) {
      const val = state ? 0 : 1;
      try {
        this.gpio.writeSync(val);
      } catch (e) {
        console.error(`Failed to write relay ${this.name}:`, e);
        this.gpio = null;
      }
    }
  }

  onStateChange(id: string, callback: (state: boolean) => void) {
    if (this.stateChangeCallbacks[id]) {
      console.warn(`State change callback with id '${id}' already exists. Overwriting...`);
    }
    this.stateChangeCallbacks[id] = callback;
    callback(this.state);
  }

  removeStateChangeCallback(id: string) {
    delete this.stateChangeCallbacks[id];
  }

  destroy() {
    console.log(`Unexporting relay ${this.pin}`);
    this.gpio?.unexport();
    this.gpio = null;
    this.state = false;
  }
}