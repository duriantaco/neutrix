import { createContext } from 'react';
import type { Store, State } from '../core/types';

export interface NeutrixContextValue<S extends State = State> {
  singleStore?: Store<S>;
  multiStores?: Record<string, Store<S>>;
}

// Only define the context ONCE here
export const NeutrixContext = createContext<NeutrixContextValue | null>(null);

export function getStoreFromContext<S extends State>(
  contextValue: NeutrixContextValue<S> | null
): Store<S> {
  if (!contextValue) {
    throw new Error('No NeutrixContext provided');
  }
  if (!contextValue.singleStore) {
    throw new Error('No singleStore found in NeutrixContext');
  }
  return contextValue.singleStore;
}
