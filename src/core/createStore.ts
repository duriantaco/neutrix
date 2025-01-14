// src/core/createStore.ts (new main entry point)
import { createBaseStore } from './store';
import type { State, Store, StoreOptions, StoreAction } from './types';
import { useSyncExternalStore } from 'react';

export function createStore<T extends State>(
  initialState: T & { [K: string]: StoreAction<T> | any },
  options: StoreOptions = {}
) {
  const store = createBaseStore(initialState, options);
  
  Object.keys(initialState).forEach(key => {
    if (typeof initialState[key] === 'function') {
      const fn = initialState[key] as StoreAction<T>;
      store.set(key, ((...args: any[]) => {
        const result = fn(store.getState(), ...args);
        if (result) {
          if (result instanceof Promise) {
            return store.action(async () => {
              const asyncResult = await result;
              Object.entries(asyncResult).forEach(([key, value]) => {
                store.set(key, value);
              });
              return asyncResult;
            })();
          } else {
            Object.entries(result).forEach(([key, value]) => {
              store.set(key, value);
            });
            return result;
          }
        }
      }) as T[typeof key]);
    }
  });

  function useStore<U>(selector: (state: T) => U): U {
    return useSyncExternalStore(
      store.subscribe,
      () => selector(store.getState())
    );
  }

  Object.defineProperties(useStore, {
    store: { value: store },
    computed: { value: store.computed },
    action: { value: store.action },
    batch: { value: store.batch },
    suspend: { value: store.suspend },
    use: { value: store.use }
  });

  return useStore;
}
