export abstract class Destructible {
  protected constructor() {
    destroyRegistry.register(this);
  }

  abstract destroy(): void;
}

class DestroyRegistry {
  private registry: Destructible[] = [];

  public register(destructible: Destructible) {
    this.registry.push(destructible);
  }

  public finish() {
    for (const destructible of this.registry) {
      destructible.destroy();
    }
    this.registry = [];
  }
}

export const destroyRegistry = new DestroyRegistry();