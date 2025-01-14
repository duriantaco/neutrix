import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createStoreForSSR } from '../../src/core/store';
import type { State } from '../../src/core/types';

interface TestState extends State {
  counter: number;
  user: {
    name: string;
    preferences: {
      theme: string;
    }
  }
}

describe('Server Side Rendering', () => {
  let ssrStore: ReturnType<typeof createStoreForSSR<TestState>>;
  
  beforeEach(() => {
    ssrStore = createStoreForSSR<TestState>({
      counter: 0,
      user: {
        name: 'test',
        preferences: {
          theme: 'light'
        }
      }
    });
  });

  it('should create a store with initial state', () => {
    expect(ssrStore.store.getState()).toEqual({
      counter: 0,
      user: {
        name: 'test',
        preferences: {
          theme: 'light'
        }
      }
    });
  });

  it('should generate correct server snapshot', () => {
    ssrStore.store.set('counter', 1);
    const snapshot = ssrStore.getServerSnapshot();
    const parsed = JSON.parse(snapshot);
    expect(parsed.counter).toBe(1);
  });

  it('should rehydrate state correctly', () => {
    const snapshot = JSON.stringify({
      counter: 5,
      user: {
        name: 'rehydrated',
        preferences: {
          theme: 'dark'
        }
      }
    });

    ssrStore.rehydrate(snapshot);
    expect(ssrStore.store.get('counter')).toBe(5);
    expect(ssrStore.store.get('user.name')).toBe('rehydrated');
    expect(ssrStore.store.get('user.preferences.theme')).toBe('dark');
  });

  it('should handle malformed JSON during rehydration', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const invalidSnapshot = 'invalid-json';
    
    ssrStore.rehydrate(invalidSnapshot);
    expect(consoleError).toHaveBeenCalledWith(
      'Failed to parse SSR snapshot:',
      expect.any(Error)
    );
    
    consoleError.mockRestore();
  });

  it('should handle partial state rehydration', () => {
    const initialState = ssrStore.store.getState();
    const partialSnapshot = JSON.stringify({
      counter: 10
    });

    ssrStore.rehydrate(partialSnapshot);
    expect(ssrStore.store.get('counter')).toBe(10);
    expect(ssrStore.store.get('user')).toEqual(initialState.user);
  });

  it('should maintain state validation during rehydration', () => {
    const validateStore = createStoreForSSR<TestState>(
      {
        counter: 0,
        user: { name: 'test', preferences: { theme: 'light' } }
      },
      {
        validate: state => state.counter >= 0
      }
    );

    const invalidSnapshot = JSON.stringify({ counter: -1 });
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    validateStore.rehydrate(invalidSnapshot);
    
    expect(validateStore.store.get('counter')).toBe(0);
    
    expect(consoleError).toHaveBeenCalled();
    
    consoleError.mockRestore();
  });
});