// src/core/store.ts
import { State, Store, StoreOptions, BatchUpdate, ComputedFn, Action } from './types';
import { get, set } from './utils';
import { Middleware } from './types';
import { LRUCache } from './cache';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

export function createStore<T extends State>(
  initialState: T = {} as T,
  options: StoreOptions = {}
): Store<T> {
  let state = { ...initialState };
  const computedCache = new LRUCache<string, any>(50);
  const subscribers = new Set<() => void>();
  const middlewares: Middleware[] = [];
  const dependencyGraph = new Map<string, Set<string>>();
  const suspenseCache = new Map<Promise<any>, any>();

  if (options.validate) {
    const validationResult = options.validate(state);
    if (typeof validationResult === 'string') {
      throw new Error(`Initial state validation failed: ${validationResult}`);
    } else if (!validationResult) {
      throw new Error('Initial state validation failed');
    }
  }

  const cleanupDependencies = (path: string) => {
    const deps = dependencyGraph.get(path);
    if (deps) {
      deps.forEach(dep => {
        computedCache.delete(dep);
      });
      dependencyGraph.delete(path);
    }
  };

  let devTools: any;
  try{
  if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: options.name || 'Enhanced Store',
      features: {
        jump: true,
        skip: true,
        reorder: true,
        dispatch: true,
        persist: true
      }
    });
    devTools.init(state);
  }
    } catch (e) {
    console.warn('DevTools initialization failed:', e);
  }

  if (options.persist) {
    const savedState = localStorage.getItem(options.name || 'enhanced-store');
    if (savedState) {
      try {
        let parsed = JSON.parse(savedState);
        if (options.migration) {
            const savedVersion = parsed.__version || 0;
            if (savedVersion < options.migration.version) {
              parsed = options.migration.migrate(parsed);
              parsed.__version = options.migration.version;
            }
          }
          state = typeof options.persist === 'function'
          ? options.persist(parsed)
          : parsed;

        if (options.validate) {
          const validationResult = options.validate(state);
          if (typeof validationResult === 'string') {
            throw new Error(`Migrated state validation failed: ${validationResult}`);
          } else if (!validationResult) {
            throw new Error('Migrated state validation failed');
          }
        }
      } catch (e) {
        console.warn('Failed to load/migrate persisted state:', e);
        state = { ...initialState }; 
      }
    }
  }

  const validateState = (newState: T) => {
    if (options.validate) {
      const validationResult = options.validate(newState);
      if (typeof validationResult === 'string') {
        throw new Error(`State validation failed: ${validationResult}`);
      } else if (!validationResult) {
        throw new Error('State validation failed');
      }
    }
  };

  const updateDevTools = (action: string) => {
    if (devTools) {
      try {
        devTools.send(action, state);
      } catch (e) {
        console.warn('DevTools update failed:', e);
      }
    }
    if (options.persist) {
      try {
        const stateToSave = typeof options.persist === 'function'
          ? options.persist(state)
          : state;
        localStorage.setItem(options.name || 'enhanced-store', JSON.stringify(stateToSave));
      } catch (e) {
        console.warn('Failed to persist state:', e);
      }
    }
};

  const notify = (path?: string) => {
    if (path) {
      const affected = dependencyGraph.get(path) || new Set();
      affected.forEach(computedPath => {
        computedCache.delete(computedPath);
      });
    }
    subscribers.forEach(sub => sub());
  };

  const trackDependency = (path: string, computedPath: string) => {
    if (!dependencyGraph.has(path)) {
      dependencyGraph.set(path, new Set());
    }
    dependencyGraph.get(path)!.add(computedPath);
  };

  const store: Store<T> = {
    get: <K extends keyof T>(path: K | string): T[K] => {
      let value = get(state, path as string);
      middlewares.forEach(m => {
        if (m.onGet) {
          value = m.onGet(path as string, value);
        }
      });
      return value;
    },
    
    set: <K extends keyof T>(path: K | string, value: any): void => {
      const prevValue = get(state, path as string);
      let nextValue = value;
      
      middlewares.forEach(m => {
        if (m.onSet) {
          nextValue = m.onSet(path as string, nextValue, prevValue);
        }
      });

      if (nextValue !== prevValue) {
        const newState = set(state, path as string, nextValue) as T;
        validateState(newState);
        
        cleanupDependencies(path as string);
        state = newState;
        notify(path as string);
        updateDevTools(`Set ${String(path)}`);
      }
    },

    batch: (updates: BatchUpdate): void => {
      const affectedPaths = new Set<string>();
      const newState = { ...state };

      try {
        updates.forEach(([path, value]) => {
          const prevValue = get(newState, path);
          if (value !== prevValue) {
            const updatedState = set(newState, path, value) as T;
            validateState(updatedState);
            
            Object.assign(newState, updatedState);
            cleanupDependencies(path);
            affectedPaths.add(path);
          }
        });

        if (affectedPaths.size > 0) {
          state = newState;
          updateDevTools('Batch Update');
          notify();
        }
      } catch (error) {
        console.error('Batch update failed:', error);
        throw error;
      }
    },

    use: (middleware: Middleware) => {
      middlewares.push(middleware);
      return () => {
        const index = middlewares.indexOf(middleware);
        if (index > -1) {
          middlewares.splice(index, 1);
        }
      };
    },

    subscribe: (subscriber: () => void) => {
      subscribers.add(subscriber);
      return () => void subscribers.delete(subscriber);
    },

    getState: () => ({ ...state }),

    computed: <R>(path: string, fn: (state: T) => R): ComputedFn<R> => {
        const computationStack = new Set<string>();
            
        return () => {
          if (computationStack.has(path)) {
            throw new Error(`Circular dependency detected in computed value "${path}"`);
          }
      
          if (!computedCache.has(path)) {
            computationStack.add(path);
            
            try {
              const proxy = new Proxy(state, {
                get(target, prop: string) {
                  trackDependency(prop, path);
                  return target[prop as keyof typeof target];
                }
              });
              
              computedCache.set(path, fn(proxy as T));
            } finally {
              computationStack.delete(path);
            }
          }
          return computedCache.get(path);
        };
        },

    action: <Args extends any[], Result>(
      fn: Action<Args, Result>
    ) => {
      return async (...args: Args): Promise<Result> => {
        try {
          const result = await fn(store, ...args);
          updateDevTools(`Action ${fn.name || 'Anonymous'}`);
          return result;
        } catch (error) {
          console.error(`Action failed:`, error);
          throw error;
        }
      };
    },


    suspend: <R>(promise: Promise<R>): R => {
      if (!suspenseCache.has(promise)) {
        throw promise.then(value => {
          suspenseCache.set(promise, value);
        });
      }
      return suspenseCache.get(promise)!;
    }
  };

  return new Proxy(store, {
    get(target, prop: string | symbol) {
      if (prop in target) {
        return Reflect.get(target, prop);
      }
      return get(state, String(prop));
    }
  });
}