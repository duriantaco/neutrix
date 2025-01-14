import { useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { NeutrixContext, getStoreFromContext } from './context';
import type { Store, State } from '../core/types';

export function useNeutrixSelector<S extends State, R>(
  selector: (store: Store<S>) => R
): R {
  const contextValue = useContext(NeutrixContext);
  const store = getStoreFromContext(contextValue) as unknown as Store<S>;
  
  const selectorRef = useRef(selector);
  
  const [value, setValue] = useState(() => selector(store));
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = selectorRef.current(store);
      setValue(newValue);
    });
    
    return () => {
      unsubscribe();
    };
  }, [store]);

  return value;
}

export function useNeutrixComputed<S extends State, R>(
  computeFn: (store: Store<S>) => R
): R {
  const contextValue = useContext(NeutrixContext);
  const store = getStoreFromContext(contextValue) as unknown as Store<S>;

  const memoizedComputeFn = useCallback(computeFn, [computeFn]);
  
  const [value, setValue] = useState(() => memoizedComputeFn(store));
  
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const newValue = memoizedComputeFn(store);
      setValue(newValue);
    });
    return unsubscribe;
  }, [store, memoizedComputeFn]);

  return value;
}

interface ActionState {
  loading: boolean;
  error: Error | null;
}

export function useNeutrixAction<S extends State, Args extends any[], R>(
  action: (store: Store<S>, ...args: Args) => Promise<R>
) {
  const contextValue = useContext(NeutrixContext);
  const store = getStoreFromContext(contextValue) as unknown as Store<S>;
  
  const [state, setState] = useState<ActionState>({
    loading: false,
    error: null
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ loading: true, error: null });
      
      try {
        const result = await action(store, ...args);
        setState({ loading: false, error: null });
        return result;
      } catch (err) {
        setState({ loading: false, error: err as Error });
        throw err;
      }
    },
    [store, action]
  );

  return {
    loading: state.loading,
    error: state.error,
    execute,
  };
}