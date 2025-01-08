import React from 'react';
import type { Store } from '../core/types';

export const StoreContext = React.createContext<Store<any>>(null!);

interface ProviderProps {
  store: Store<any>;
  children: React.ReactNode;
}

export function Provider(props: ProviderProps) {
  return (
    React.createElement(StoreContext.Provider, { value: props.store }, props.children)
  );
}