// src/react/provider.tsx
import React, { createContext, useEffect } from 'react';
import type { Store, State } from '../../src/core/types';

export const StoreContext = createContext<Store<any> | null>(null);

export interface ProviderProps<T extends State = State> {
  store: Store<T>;
  children: React.ReactNode;
}

export const Provider = <T extends State = State>({ 
  store, 
  children 
}: ProviderProps<T>): React.ReactElement => {
  useEffect(() => {
    return store.subscribe(() => {
    });
  }, [store]);

  return React.createElement(StoreContext.Provider, { value: store }, children);
};