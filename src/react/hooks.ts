// src/react/hooks.ts
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Store, State } from '../core/types';
import { StoreContext } from './provider';

export function useStore<S extends State, T>(selector: (store: Store<S>) => T): T {
  const store = useContext(StoreContext) as Store<S>;
  const selectorRef = useRef(selector);
  selectorRef.current = selector;

  const [value, setValue] = useState(() => selector(store));

  useEffect(() => {
    setValue(selectorRef.current(store));

    const unsubscribe = store.subscribe(() => {
      setValue(selectorRef.current(store));
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  return value;
}

export function useComputed<S extends State, T>(compute: (store: Store<S>) => T): T {
  const store = useContext(StoreContext) as Store<S>;
  const computeRef = useRef(compute);
  computeRef.current = compute;

  const [value, setValue] = useState(() => compute(store));

  useEffect(() => {
    setValue(computeRef.current(store));

    const unsubscribe = store.subscribe(() => {
      setValue(computeRef.current(store));
    });

    return () => {
      unsubscribe();
    };
  }, [store]);

  return value;
}

interface ActionState<E = Error> {
  loading: boolean;
  error: E | null;
}

export function useAction<S extends State, Args extends any[], R>(
  action: (store: Store<S>, ...args: Args) => Promise<R>
) {
  const store = useContext(StoreContext) as Store<S>;
  const actionRef = useRef(action);
  actionRef.current = action;

  const [state, setState] = useState<ActionState>({
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: Args) => {
      setState({ loading: true, error: null });
      try {
        const result = await actionRef.current(store, ...args);
        setState({ loading: false, error: null });
        return result;
      } catch (error) {
        const typedError = error as Error;
        setState({ loading: false, error: typedError });
        throw typedError;
      }
    },
    [store]
  );

  return {
    loading: state.loading,
    error: state.error,
    execute,
  };
}