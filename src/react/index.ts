import React from 'react';
import type { Store, State } from '../core/types';

export const StoreContext = React.createContext<Store<State> | null>(null);

interface StoreProviderProps<T extends State> {
  store: Store<T>;
  children: React.ReactNode;
}

export const StoreProvider = <T extends State>({ 
  store, 
  children 
}: StoreProviderProps<T>): JSX.Element => 
  React.createElement(StoreContext.Provider, { value: store }, children);

export function useStoreContext<T extends State>(): Store<T> {
  const context = React.useContext(StoreContext);
  if (context === null) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context as Store<T>;
}

// may have a duplicate here. havent checked but will check later
export function useStore<T extends State>(): Store<T>;
export function useStore<T extends State, R>(selector: (store: Store<T>) => R): R;
export function useStore<T extends State, R = Store<T>>(
  selector?: (store: Store<T>) => R
): R {
  const store = useStoreContext<T>();
  
  const [state, setState] = React.useState<R>(() => 
    selector ? selector(store) : store as R
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector ? selector(store) : store as R);
    });
    return unsubscribe;
  }, [store, selector]);

  return state;
}

export * from './hooks';