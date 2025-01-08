import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createStore } from '../../src/core/store';
import { Provider } from '../../src/react/provider';
import { useStore, useComputed, useAction } from '../../src/react/hooks';
import { Store, State } from '../../src/core/types';
import React from 'react';

interface TestState extends State {
  counter: number;
  user: {
    name: string;
    preferences: {
      theme: string;
    };
  };
}

describe('React Hooks', () => {
  let store: Store<TestState>;

  beforeEach(() => {
    store = createStore<TestState>({
      counter: 0,
      user: {
        name: 'John',
        preferences: {
          theme: 'light'
        }
      }
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => {
    return React.createElement(Provider, { store, children });
  };

describe('useStore', () => {
    it('should return store value', async () => {
      const { result } = renderHook(
        () => useStore<TestState, number>(store => store.get('counter')),
        { wrapper }
      );
  
      expect(result.current).toBe(0);
    });
  
    it('should update when store changes', async () => {
      const { result } = renderHook(
        () => useStore<TestState, number>(store => store.get('counter')),
        { wrapper }
      );
  
      await act(async () => {
        store.set('counter', 1);
      });
  
      expect(result.current).toBe(1);
    });
  
    it('should handle nested values', async () => {
      const { result } = renderHook(
        () => useStore<TestState, string>(store => store.get('user.preferences.theme')),
        { wrapper }
      );
  
      await act(async () => {
        store.set('user.preferences.theme', 'dark');
      });
  
      expect(result.current).toBe('dark');
    });
  });

  describe('useComputed', () => {
    it('should compute derived values', async () => {
      const { result } = renderHook(
        () => useComputed<TestState, number>(store => {
          const count = store.get('counter');
          return count * 2;
        }),
        { wrapper }
      );

      expect(result.current).toBe(0);

      await act(async () => {
        store.set('counter', 2);
      });

      expect(result.current).toBe(4);
    });
  });

  describe('useAction', () => {
    it('should handle async actions', async () => {
      const action = vi.fn(async (store: Store<TestState>, value: number) => {
        await new Promise(resolve => setTimeout(resolve, 0)); // Simulate async
        const current = store.get('counter');
        store.set('counter', current + value);
        return current + value;
      });

      const { result } = renderHook(
        () => useAction(action),
        { wrapper }
      );

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);

      await act(async () => {
        await result.current.execute(5);
      });

      expect(result.current.loading).toBe(false);
      expect(store.get('counter')).toBe(5);
    });

    it('should handle errors in actions', async () => {
      const error = new Error('Test error');
      const action = async () => {
        throw error;
      };

      const { result } = renderHook(
        () => useAction(action),
        { wrapper }
      );

      await act(async () => {
        try {
          await result.current.execute();
        } catch (e) {
          expect(e).toBe(error);
        }
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(error);
    });
  });
});