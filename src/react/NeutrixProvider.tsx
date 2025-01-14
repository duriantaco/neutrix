import { ReactNode, useEffect } from 'react';
import type { Store, State } from '../core/types';
import { NeutrixContext, NeutrixContextValue } from './context';

export interface NeutrixProviderProps {
  store?: Store<State>;
  stores?: Record<string, Store<State>>;
  children: ReactNode;
}

export function NeutrixProvider({
  store,
  stores,
  children,
}: NeutrixProviderProps) {
  if (!store && !stores) {
    throw new Error(
      'NeutrixProvider requires either a single "store" OR "stores" prop.'
    );
  }

  useEffect(() => {
    if (store) {
      const unsubscribe = store.subscribe(() => {});
      return () => unsubscribe();
    }
    if (stores) {
      const unsubscribes = Object.values(stores).map((st) =>
        st.subscribe(() => {})
      );
      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    }
  }, [store, stores]);

  const value: NeutrixContextValue = {
    singleStore: store,
    multiStores: stores,
  };

  return (
    <NeutrixContext.Provider value={value}>
      {children}
    </NeutrixContext.Provider>
  );
}
