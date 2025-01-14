// src/__tests__/createNeutrixStore.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createNeutrixStore } from '../../src/react/CreateNeutrixStore';
import type { State, StoreOptions } from '../../src/core/types';

interface TestState extends State {
  count: number;
}

describe('createNeutrixStore', () => {
  const initialState: TestState = { count: 0 };
  const options: StoreOptions = {};

  it('should initialize store with initial state', () => {
    const { store } = createNeutrixStore(initialState, options);
    expect(store.getState()).toEqual({ count: 0 });
  });

  it('should update state and notify subscribers', () => {
    const { store, useStore } = createNeutrixStore(initialState, options);

    const { result } = renderHook(() => useStore(s => s.get('count')));
    expect(result.current).toBe(0);

    act(() => {
        store.set('count', 1);
    });
    expect(result.current).toBe(1);
  });

  it('should use selector to derive state', () => {
    const { store, useStore } = createNeutrixStore(initialState, options);

    const { result } = renderHook(() => useStore(s => s.get('count') * 2));
    expect(result.current).toBe(0);

    act(() => {
        store.set('count', 2);
    });
    expect(result.current).toBe(4);
  });

  it('should unsubscribe on unmount', () => {
    const { store, useStore } = createNeutrixStore(initialState, options);

    const { unmount } = renderHook(() => useStore(s => s.get('count')));
    act(() => {
        store.set('count', 1);
    });

    unmount();

    store.set('count', 2);
    // No crash => test passes
  });
});
