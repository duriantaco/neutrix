import React from 'react';
import type { Store } from '../core/types';

const StoreContext: React.Context<Store | null> = React.createContext<Store | null>(null);

interface ProviderProps extends React.PropsWithChildren<{ store: Store }> {}

export const Provider: React.FC<ProviderProps> = ({ store, children }) => 
  React.createElement(StoreContext.Provider, { value: store }, children);

// implement hook
function useStoreContext(): Store {
  const context = React.useContext(StoreContext);
  if (context === null) {
    throw new Error('useStore must be used within Provider');
  }
  return context;
}

export function useStore(): Store;
export function useStore<T>(selector: (store: Store) => T): T;
export function useStore<T = Store>(selector?: (store: Store) => T): T {
  const store = useStoreContext();
  
  const [state, setState] = React.useState<T>(() => 
    selector ? selector(store) : store as T
  );

  React.useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setState(selector ? selector(store) : store as T);
    });
    return unsubscribe;
  }, [store, selector]);

  return state;
}