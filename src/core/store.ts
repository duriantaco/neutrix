// src/core/store.ts
import { State, Path, Store, BatchUpdate, StoreOptions, Subscriber } from './types';
import { get, set, clone } from './utils';

declare global {
    interface Window {
      __REDUX_DEVTOOLS_EXTENSION__?: any;
    }
}

export function createStore(initialState: State = {}, options: StoreOptions = {}): Store {
  let state = clone(initialState);
  const subscribers = new Set<Subscriber>();
  
  let devTools: any;
  if (options.devTools && window.__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: options.name || 'Spyn Store'
    });
    devTools.init(state);
  }

  const notify = () => {
    subscribers.forEach(subscriber => subscriber());
  };

  const updateDevTools = (action: string) => {
    if (devTools) {
      devTools.send(action, state);
    }
  };

  const store = {
    get: (path: Path): any => {
      return get(state, path);
    },

    set: (path: Path, value: any): void => {
      state = set(state, path, value);
      notify();
      updateDevTools(`Set ${path}`);
    },

    batch: (updates: BatchUpdate): void => {
      state = updates.reduce(
        (newState, [path, value]) => set(newState, path, value),
        clone(state)
      );
      notify();
      updateDevTools('Batch Update');
    },

    subscribe: (subscriber: Subscriber): (() => void) => {
      subscribers.add(subscriber);
      return () => {
        subscribers.delete(subscriber);
      };
    }
  };

  return new Proxy(store, {
    get: (target, prop) => {
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      return get(state, prop as string);
    }
  });
}