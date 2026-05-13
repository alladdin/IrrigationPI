import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Destructible, destroyRegistry } from './destroyRegistry.ts';

class TestDestructible extends Destructible {
  public destroyed = false;

  constructor() {
    super();
  }

  destroy() {
    this.destroyed = true;
  }
}

describe('destroyRegistry', () => {
  beforeEach(() => {
    // Clear the registry before each test to ensure isolation
    destroyRegistry.finish();
  });

  it('should register a destructible when it is constructed', () => {
    const item = new TestDestructible();
    
    // verify it's registered by finishing the registry
    destroyRegistry.finish();
    
    expect(item.destroyed).toBe(true);
  });

  it('should call destroy on all registered items when finish is called', () => {
    const item1 = new TestDestructible();
    const item2 = new TestDestructible();
    
    destroyRegistry.finish();
    
    expect(item1.destroyed).toBe(true);
    expect(item2.destroyed).toBe(true);
  });

  it('should clear the registry after finish is called', () => {
    const item1 = new TestDestructible();
    
    destroyRegistry.finish();
    expect(item1.destroyed).toBe(true);
    
    // Reset destroyed flag
    item1.destroyed = false;
    
    // Call finish again - should not call destroy again because registry was cleared
    destroyRegistry.finish();
    expect(item1.destroyed).toBe(false);
  });

  it('should handle multiple calls to finish gracefully', () => {
    const item1 = new TestDestructible();
    
    destroyRegistry.finish();
    expect(item1.destroyed).toBe(true);
    
    expect(() => destroyRegistry.finish()).not.toThrow();
  });

  it('should allow manually registering an object that satisfies Destructible interface', () => {
    // Manually register an object. Note that register() expects Destructible.
    // Since Destructible is an abstract class, we can create a mock that satisfies its structure
    const item = {
      destroy: jest.fn(),
    } as unknown as Destructible;
    
    destroyRegistry.register(item);
    destroyRegistry.finish();
    
    expect(item.destroy).toHaveBeenCalled();
  });
});
