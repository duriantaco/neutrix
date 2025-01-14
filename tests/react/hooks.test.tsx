// tests/react/hooks.test.tsx
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { createStore } from '../../src/core/store';
import { NeutrixProvider } from '../../src/react/NeutrixProvider';
import {
  useNeutrixSelector,
  useNeutrixComputed,
  useNeutrixAction
} from '../../src/react/hooks';
import type { Store, State } from '../../src/core/types';

interface TestState extends State {
  counter: number;
  loading: boolean;
  user: {
    name: string;
    preferences: {
      theme: string;
    };
  };
  items?: string[];
}

describe('Neutrix React Hooks', () => {
  let store: Store<TestState>;

  beforeEach(() => {
    store = createStore<TestState>({
      counter: 0,
      loading: false,
      user: {
        name: 'John',
        preferences: {
          theme: 'light'
        }
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <NeutrixProvider store={store}>{children}</NeutrixProvider>
  );

  describe('useNeutrixSelector', () => {
    it('should return store value', async () => {
      const { result } = renderHook(
        () => useNeutrixSelector<TestState, number>(s => s.get('counter')),
        { wrapper }
      );
      
      await waitFor(() => {
        expect(result.current).toBe(0);
      });
    });

    it('should update when store changes', async () => {
      const { result } = renderHook(
        () => useNeutrixSelector<TestState, number>(s => s.get('counter')),
        { wrapper }
      );

      await act(async () => {
        store.set('counter', 1);
      });

      await waitFor(() => {
        expect(result.current).toBe(1);
      });
    });

    it('should handle nested values', async () => {
      const { result } = renderHook(
        () => useNeutrixSelector<TestState, string>(
          s => s.get('user.preferences.theme')
        ),
        { wrapper }
      );

      await act(async () => {
        store.set('user.preferences.theme', 'dark');
      });

      await waitFor(() => {
        expect(result.current).toBe('dark');
      });
    });

    it('should handle batch updates', async () => {
      const { result } = renderHook(
        () => ({
          counter: useNeutrixSelector<TestState, number>(s => s.get('counter')),
          theme: useNeutrixSelector<TestState, string>(
            s => s.get('user.preferences.theme')
          )
        }),
        { wrapper }
      );

      await act(async () => {
        store.batch([
          ['counter', 5],
          ['user.preferences.theme', 'dark']
        ]);
      });

      await waitFor(() => {
        expect(result.current.counter).toBe(5);
        expect(result.current.theme).toBe('dark');
      });
    });

    it('should handle array updates', async () => {
      const { result } = renderHook(
        () => useNeutrixSelector<TestState, string[]>(s => s.get('items') ?? []),
        { wrapper }
      );

      await act(async () => {
        store.set('items', ['item1', 'item2']);
      });

      await waitFor(() => {
        expect(result.current).toEqual(['item1', 'item2']);
      });
    });
  });

  describe('useNeutrixComputed', () => {
    it('should compute derived values', async () => {
      const { result } = renderHook(
        () => useNeutrixComputed<TestState, number>(s => {
          const count = s.get('counter');
          return count * 2;
        }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(0);
      });

      await act(async () => {
        store.set('counter', 2);
      });

      await waitFor(() => {
        expect(result.current).toBe(4);
      });
    });

    it('should handle multiple dependencies', async () => {
      const { result } = renderHook(
        () => useNeutrixComputed<TestState, string>(s => {
          const name = s.get('user.name');
          const theme = s.get('user.preferences.theme');
          return `${name}-${theme}`;
        }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe('John-light');
      });

      await act(async () => {
        store.batch([
          ['user.name', 'Jane'],
          ['user.preferences.theme', 'dark']
        ]);
      });

      await waitFor(() => {
        expect(result.current).toBe('Jane-dark');
      });
    });

    it('should not recompute if dependencies have not changed', async () => {
      const computeFn = vi.fn((s: Store<TestState>) => {
        const counter = s.get('counter');
        return counter * 2;
      });

      const { result } = renderHook(
        () => useNeutrixComputed<TestState, number>(computeFn),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current).toBe(0);
      });

      await act(async () => {
        store.set('user.name', 'Bob');
      });

      await waitFor(() => {
        expect(result.current).toBe(0);
        expect(computeFn).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Advanced Hook Scenarios', () => {
    it('should handle rapid state updates without memory leaks', async () => {
      const { result } = renderHook(
        () => useNeutrixSelector<TestState, number>(s => s.get('counter')),
        { wrapper }
      );

      const updates = Array(100).fill(0);
      
      await act(async () => {
        for (const _ of updates) {
          store.set('counter', Math.random());
        }
      });

      expect(result.current).toBe(store.get('counter'));
    });

    it('should handle hook cleanup on rapid unmounts', async () => {
      const subscribeSpy = vi.spyOn(store, 'subscribe');
      const unsubscribeCount = vi.fn();
      
      subscribeSpy.mockImplementation(() => {
        const unsubscribe = () => {
          unsubscribeCount();
        };
        return unsubscribe;
      });
  
      subscribeSpy.mockClear();
      unsubscribeCount.mockClear();
  
      for (let i = 0; i < 5; i++) {
        const { unmount } = renderHook(
          () => useNeutrixSelector<TestState, number>(s => s.get('counter')),
          { wrapper }
        );
        unmount();
      }
  
      // Each render creates 2 subscriptions: 1 from Provider + 1 from Hook = 2 per render.... 
      // so for 5 renders, we should have like 10 total subscriptions
      expect(subscribeSpy).toHaveBeenCalledTimes(10);
      expect(unsubscribeCount).toHaveBeenCalledTimes(10); 
      
      subscribeSpy.mockRestore();
    });

    it('should handle errors in computed values', async () => {
      const errorFn = vi.fn().mockImplementation(() => {
        throw new Error('Computation error');
      });

      let error: Error | undefined;
      try {
        renderHook(
          () => useNeutrixComputed<TestState, number>(errorFn),
          { wrapper }
        );
      } catch (e) {
        error = e as Error;
      }

      expect(error).toBeDefined();
      expect(errorFn).toHaveBeenCalled();
    });

    it('should properly handle concurrent computed updates', async () => {
      let computeCount = 0;
      const { result } = renderHook(
        () => useNeutrixComputed<TestState, number>(s => {
          computeCount++;
          return s.get('counter') * 2;
        }),
        { wrapper }
      );

      await act(async () => {
        Promise.all([
          store.set('counter', 1),
          store.set('counter', 2),
          store.set('counter', 3)
        ]);
      });

      expect(result.current).toBe(6); 
      expect(computeCount).toBeLessThanOrEqual(4); 
    });

    it('should maintain selector stability across renders', async () => {
    const selectorCallCount = vi.fn();
    
    const stableSelector = vi.fn((s: Store<TestState>) => {
      selectorCallCount();
      return s.get('user.name');
    });

    const { result, rerender } = renderHook(
      () => useNeutrixSelector(stableSelector),
      { wrapper }
    );

    for (let i = 0; i < 5; i++) {
      rerender();
    }

    expect(selectorCallCount).toHaveBeenCalledTimes(1);
    
    expect(result.current).toBe('John');
    
    await act(async () => {
      store.set('user.name', 'Jane');
    });

    expect(selectorCallCount).toHaveBeenCalledTimes(2);
    });
  });

  describe('useNeutrixAction', () => {
    it('should handle async actions', async () => {
      const action = vi.fn(async (s: Store<TestState>, value: number) => {
        await new Promise(res => setTimeout(res, 0));
        const current = s.get('counter');
        s.set('counter', current + value);
        return current + value;
      });

      const { result } = renderHook(() => useNeutrixAction(action), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });

      let finalVal: number;
      await act(async () => {
        finalVal = await result.current.execute(5);
      });

      await waitFor(() => {
        expect(finalVal).toBe(5);
        expect(store.get('counter')).toBe(5);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it('should handle errors in actions', async () => {
      const error = new Error('Test error');
      const action = async () => {
        throw error;
      };

      const { result } = renderHook(() => useNeutrixAction(action), { wrapper });

      let caught: Error | undefined;
      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          caught = e as Error;
        }
      });

      await waitFor(() => {
        expect(caught).toBe(error);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(error);
      });
    });

    it('should handle concurrent actions', async () => {
      let resolveFirst: () => void = () => {};
      let resolveSecond: () => void = () => {};

      const firstDelay = new Promise<void>(r => {
        resolveFirst = r;
      });
      const secondDelay = new Promise<void>(r => {
        resolveSecond = r;
      });

      const action = async (s: Store<TestState>, id: number, isFirst: boolean) => {
        if (isFirst) {
          await firstDelay;
        } else {
          await secondDelay;
        }
        s.set('counter', id);
        return id;
      };

      const { result } = renderHook(() => useNeutrixAction(action), { wrapper });

      let promise1: Promise<number>;
      let promise2: Promise<number>;

      await act(async () => {
        promise1 = result.current.execute(1, true);
        promise2 = result.current.execute(2, false);
        
        resolveFirst();
        await new Promise(res => setTimeout(res, 0));
        
        resolveSecond();
        await Promise.all([promise1, promise2]);
      });

      await waitFor(() => {
        expect(store.get('counter')).toBe(2);
      });
    });

    it('should maintain loading state', async () => {
      let resolve: () => void = () => {};
      const actionPromise = new Promise<void>(r => {
        resolve = r;
      });
    
      const action = async (_: Store<TestState>) => {
        await actionPromise;
      };
    
      const { result } = renderHook(() => useNeutrixAction(action), { wrapper });
      expect(result.current.loading).toBe(false);
    
      let actionResult: Promise<void>;
    
      actionResult = result.current.execute();
      await new Promise(res => setTimeout(res, 0));
      expect(result.current.loading).toBe(true);
    
      expect(result.current.loading).toBe(true);
    
      await act(async () => {
        resolve();
        await actionResult;
      });
    
      expect(result.current.loading).toBe(false);
    })
  });
});
  

