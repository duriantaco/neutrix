// src/react/createNeutrixStore.tsx
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createStore } from '../core/store';
import { NeutrixProvider } from './NeutrixProvider';
import { NeutrixContext, NeutrixContextValue } from './context';
import type { State, StoreOptions, Store } from '../core/types';

export function createNeutrixStore<S extends State>(
  initialState: S,
  options?: StoreOptions
) {
  const store = createStore<S>(initialState, options);

  function useStore<T>(selector: (store: Store<S>) => T): T {
    const contextValue = useContext(NeutrixContext) as NeutrixContextValue<S> | undefined;
    const currentStore = contextValue?.singleStore ?? store;

    const selectorRef = useRef(selector);
    selectorRef.current = selector;

    const [selected, setSelected] = useState(() => selectorRef.current(currentStore));

    useEffect(() => {
      let mounted = true;
      const unsubscribe = currentStore.subscribe(() => {
        if (!mounted) return;
        const nextValue = selectorRef.current(currentStore);
        setSelected(nextValue);
      });

      return () => {
        mounted = false;
        unsubscribe();
      };
    }, [currentStore]);

    return selected;
  }

  function Provider({ children }: { children: React.ReactNode }) {
    return <NeutrixProvider store={store}>{children}</NeutrixProvider>;
  }

  return {
    store,
    useStore,
    Provider,
  };
}

