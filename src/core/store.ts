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

  let devTools: any;
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

  if (options.persist) {
    const savedState = localStorage.getItem(options.name || 'enhanced-store');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        state = typeof options.persist === 'function' 
          ? options.persist(parsed) 
          : parsed;
      } catch (e) {
        console.warn('Failed to load persisted state:', e);
      }
    }
  }

  const updateDevTools = (action: string) => {
    if (devTools) {
      devTools.send(action, state);
      if (options.persist) {
        const stateToSave = typeof options.persist === 'function'
          ? options.persist(state)
          : state;
        localStorage.setItem(options.name || 'enhanced-store', JSON.stringify(stateToSave));
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
        if (m.onGet) value = m.onGet(path as string, value);
      });
      return value;
    },
    
    set: <K extends keyof T>(path: K | string, value: any): void => {
      const prevValue = get(state, path as string);
      let nextValue = value;
      
      middlewares.forEach(m => {
        if (m.onSet) nextValue = m.onSet(path as string, nextValue, prevValue);
      });

      if (nextValue !== prevValue) {
        state = set(state, path as string, nextValue) as T;
        notify(path as string);
        updateDevTools(`Set ${String(path)}`);
      }
    },

    batch: (updates: BatchUpdate): void => {
      const affectedPaths = new Set<string>();

      updates.forEach(([path, value]) => {
        if (get(state, path) !== value) {
          state = set(state, path, value) as T;
          affectedPaths.add(path);
        }
      });

      if (affectedPaths.size > 0) {
        notify();
        updateDevTools('Batch Update');
      }
    },

    use: (middleware: Middleware) => {
      middlewares.push(middleware);
      return () => {
        const index = middlewares.indexOf(middleware);
        if (index > -1) middlewares.splice(index, 1);
      };
    },

    subscribe: (subscriber: () => void) => {
      subscribers.add(subscriber);
      return () => void subscribers.delete(subscriber);
    },

    getState: () => ({ ...state }),

    computed: <R>(path: string, fn: (state: T) => R): ComputedFn<R> => {
      return () => {
        if (!computedCache.has(path)) {
          const proxy = new Proxy(state, {
            get(target, prop: string) {
              trackDependency(prop, path);
              return target[prop as keyof typeof target];
            }
          });
          
          computedCache.set(path, fn(proxy as T));
        }
        return computedCache.get(path);
      };
    },

    action: <Args extends any[], Result>(
      fn: Action<Args, Result>
    ) => {
      return async (...args: Args): Promise<Result> => {
        const result = await fn(store, ...args);
        updateDevTools(`Action ${fn.name || 'Anonymous'}`);
        return result;
      };
    },

    suspend: <R>(promise: Promise<R>): R => {
      const cache = new Map<Promise<R>, R>();
      
      if (!cache.has(promise)) {
        throw promise.then(value => {
          cache.set(promise, value);
        });
      }
      
      return cache.get(promise)!;
    }
  };

  return new Proxy(store, {
    get(target, prop: string | symbol) {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      return get(state, prop as string);
    }
  });
}