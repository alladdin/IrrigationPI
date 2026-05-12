export interface RelayConfig {
  pin: number;
  relay: number;
  description?: string;
}

export type RelaysConfig = Record<string, RelayConfig>