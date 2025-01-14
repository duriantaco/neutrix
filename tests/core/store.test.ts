import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from '../../src/core/store';
import { State, StoreOptions } from '../../src/core/types';

interface TestState extends State {
  count: number;
  user?: {
    name: string;
    settings?: {
      theme: string;
    }
  };
}

describe('Store Error Handling and Edge Cases', () => {
  let store: ReturnType<typeof createStore<TestState>>;
  
  beforeEach(() => {
    store = createStore<TestState>({ count: 0 });
  });

  it('should handle undefined paths gracefully', () => {
    expect(() => store.get('nonexistent.path')).not.toThrow();
    expect(store.get('nonexistent.path')).toBeUndefined();
  });

  it('should prevent circular references in state', () => {
    const circularObj: any = { foo: {} };
    circularObj.foo.bar = circularObj;

    expect(() => store.set('circular', circularObj)).toThrow();
  });

  it('should handle concurrent set operations safely', async () => {
    const operations = Array(100).fill(0).map((_, i) => 
      store.set('count', i)
    );
    
    await Promise.all(operations);
    const finalCount = store.get('count');
    expect(typeof finalCount).toBe('number');
    expect(finalCount).toBeLessThanOrEqual(99);
    expect(finalCount).toBeGreaterThanOrEqual(0);
  });

  it('should validate nested state updates', () => {
    const validateStore = createStore<TestState>(
      { count: 0 },
      {
        validate: (state) => {
          if (state.count < 0) return 'Count cannot be negative';
          if (state.user?.name === '') return 'Username cannot be empty';
          return true;
        }
      }
    );

    expect(() => validateStore.set('count', -1))
      .toThrow('Count cannot be negative');
    
    expect(() => validateStore.set('user', { name: '' }))
      .toThrow('Username cannot be empty');
  });

  it('should handle middleware errors gracefully', () => {
    const errorMiddleware = {
      onSet: () => { throw new Error('Middleware error'); },
      onGet: () => { throw new Error('Middleware error'); }
    };

    store.use(errorMiddleware);
    expect(() => store.set('count', 1)).toThrow('Middleware error');
    expect(() => store.get('count')).toThrow('Middleware error');
  });

  it('should handle batch operation failures atomically', () => {
    const store = createStore(
      { count: 0 },
      { 
        validate: (state: any) => {
          if (state.count > 10) return 'Count cannot exceed 10';
          return true;
        }
      }
    );
    
    const initialState = store.getState();
    
    expect(() => {
      store.batch([
        ['count', 5],
        ['count', 15], 
        ['count', 2]
      ]);
    }).toThrow('State validation failed: Count cannot exceed 10');

    // state should be rolled back
    expect(store.getState()).toEqual(initialState);
});

  it('should handle computed value errors', () => {
    const computed = store.computed('errorComputed', () => {
      throw new Error('Computation error');
    });

    expect(() => computed()).toThrow('Computation error');
  });

  it('should prevent prototype pollution attacks', () => {
    const maliciousPayload = JSON.parse('{"__proto__": {"malicious": true}}');
    expect(() => store.set('user', maliciousPayload)).toThrow();
    expect((({} as any).malicious)).toBeUndefined();
  });
});

describe('createStore', () => {
    let store: ReturnType<typeof createStore<TestState>>;
    let initialState: TestState;
    const mockStorage: Record<string, string> = {};

    beforeEach(() => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
        initialState = { count: 0, name: 'test' };
        store = createStore(initialState);

        vi.spyOn(Storage.prototype, 'setItem')
            .mockImplementation((key, value) => {
                mockStorage[key] = value;
            });

        vi.spyOn(Storage.prototype, 'getItem')
            .mockImplementation((key) => mockStorage[key] || null);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with the given state', () => {
        expect(store.getState()).toEqual(initialState);
    });

    it('should get a value from the state', () => {
        expect(store.get('count')).toBe(0);
        expect(store.get('name')).toBe('test');
    });

    it('should set a value in the state', () => {
        store.set('count', 1);
        expect(store.get('count')).toBe(1);
    });

    it('should notify subscribers on state change', () => {
        const subscriber = vi.fn();
        store.subscribe(subscriber);
        store.set('count', 1);
        expect(subscriber).toHaveBeenCalled();
    });

    it('should batch updates', () => {
        store.batch([
            ['count', 1],
            ['name', 'updated']
        ]);
        expect(store.get('count')).toBe(1);
        expect(store.get('name')).toBe('updated');
    });

    it('should use middleware', () => {
        const middleware = {
            onGet: vi.fn((path, value) => value),
            onSet: vi.fn((path, nextValue, prevValue) => nextValue)
        };
        store.use(middleware);
        store.get('count');
        store.set('count', 1);
        expect(middleware.onGet).toHaveBeenCalledWith('count', 0);
        expect(middleware.onSet).toHaveBeenCalledWith('count', 1, 0);
    });

    it('should compute derived state', () => {
        const doubleCount = store.computed('doubleCount', state => state.count * 2);
        expect(doubleCount()).toBe(0);
        store.set('count', 2);
        expect(doubleCount()).toBe(4);
    });

    it('should handle actions', async () => {
        const increment = vi.fn(async (store: ReturnType<typeof createStore<TestState>>, amount: number) => {
            const currentCount = store.get('count');
            store.set('count', currentCount + amount);
        });
        const incrementAction = store.action(increment);
        await incrementAction(2);
        expect(store.get('count')).toBe(2);
        expect(increment).toHaveBeenCalledWith(store, 2);
    });

    it('should persist state if options.persist is true', () => {
      const persistStore = createStore<TestState>(
        initialState,
        { persist: true, name: 'test-store' }
      );
      
      persistStore.set('count', 1);
      
      expect(window.localStorage.setItem).toHaveBeenCalled();
      const [key, value] = (window.localStorage.setItem as any).mock.lastCall;
      
      expect(key).toBe('test-store');
      expect(JSON.parse(value)).toEqual(expect.objectContaining({
        count: 1
      }));
    });

    it('should load persisted state if options.persist is true', () => {
        localStorage.setItem('test-store', JSON.stringify({ count: 1, name: 'persisted' }));
        const persistOptions: StoreOptions = { persist: true, name: 'test-store' };
        const persistStore = createStore(initialState, persistOptions);
        expect(persistStore.getState()).toEqual({ count: 1, name: 'persisted' });
    });
});

describe('Store validation and migration', () => {
    it('should validate initial state', () => {
      const validator = (state: any) => state.count >= 0;
      
      expect(() => createStore({ count: -1 }, { validate: validator }))
        .toThrow('Initial state validation failed');
      
      const store = createStore({ count: 0 }, { validate: validator });
      expect(store.get('count')).toBe(0);
    });
  
    it('should handle state migration', () => {
      localStorage.setItem('test-store', JSON.stringify({ 
        oldField: 'value',
        __version: 0 
      }));
  
      const store = createStore(
        { newField: '' },
        {
          name: 'test-store',
          persist: true,
          migration: {
            version: 1,
            migrate: (oldState: any) => ({
              newField: oldState.oldField
            })
          }
        }
      );
  
      expect(store.get('newField')).toBe('value');
    });

    it('should cleanup computed dependencies when state changes', () => {
        const store = createStore({ a: 1, b: 2 });
        const sum = store.computed('sum', state => state.a + state.b);
        
        expect(sum()).toBe(3);
        store.set('a', 2);
        expect(sum()).toBe(4);
      });

      it('should detect circular dependencies in computed values', () => {
        const store = createStore({ a: 1 });
        const computed1 = store.computed('computed1', state => computed2());
        const computed2 = store.computed('computed2', state => computed1());
        
        expect(() => computed1()).toThrow('Circular dependency detected');
      });

      it('should handle DevTools errors gracefully', () => {
        const mockDevTools = {
          connect: () => ({ 
            init: () => { throw new Error('DevTools error') }
          })
        };
        
        window.__REDUX_DEVTOOLS_EXTENSION__ = mockDevTools;
        
        expect(() => createStore({ count: 0 }, { devTools: true }))
          .not.toThrow();
      });

      it('should fallback to initial state if persisted state fails validation', () => {
        localStorage.setItem('test-store', JSON.stringify({ count: -1 }));
        
        const store = createStore(
          { count: 0 },
          {
            name: 'test-store',
            persist: true,
            validate: state => state.count >= 0
          }
        );
        
        expect(store.getState()).toEqual({ count: 0 });
      });

  
    it('should handle batch update failures', () => {
      const store = createStore(
        { count: 0 },
        { 
          validate: (state: any) => state.count < 10 
        }
      );
  
      expect(() => store.batch([
        ['count', 5],
        ['count', 15]
      ])).toThrow();
  
      expect(store.get('count')).toBe(0);
    });
  });

export function optimizePath(path: string | number | symbol): string[] {
    const pathStr = String(path);
    return pathStr.split('.').reduce<string[]>((acc, part) => {
        if (part) {
            acc.push(part);
        }
        return acc;
    }, []);
}