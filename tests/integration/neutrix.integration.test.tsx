import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createNeutrixStore } from '../../src/react/CreateNeutrixStore';
import { connectStores } from '../../src/core/connections';
import { State } from '../../src/core/types';
import React from 'react';

interface TestState extends State {
  count: number;
  data: any;
  isLoading: boolean;
}

describe('Neutrix Integration Tests', () => {
  describe('Store and React Integration', () => {
    it('should handle SSR with connected stores', async () => {
      const store1 = createNeutrixStore<TestState>({ count: 0, data: null, isLoading: false });
      const store2 = createNeutrixStore<TestState>({ count: 0, data: null, isLoading: false });

      connectStores([{
        source: store1.store,
        target: store2.store,
        when: (s) => s.get('count') > 5,
        then: (t) => t.set('count', 10),
        immediate: false
      }]);

      const snapshot = JSON.stringify(store1.store.getState());
      const rehydratedStore = createNeutrixStore<TestState>(
        JSON.parse(snapshot)
      );

      const { result } = renderHook(
        () => rehydratedStore.useStore(s => s.get('count')),
        { wrapper: rehydratedStore.Provider }
      );

      expect(result.current).toBe(0);
    });

    it('should handle nested providers with shared state', () => {
      const parentStore = createNeutrixStore<TestState>({
        count: 0,
        data: null,
        isLoading: false
      });
      const childStore = createNeutrixStore<TestState>({
        count: 0,
        data: null,
        isLoading: false
      });

      const ParentWrapper = ({ children }: { children: React.ReactNode }) => (
        <parentStore.Provider>
          <childStore.Provider>{children}</childStore.Provider>
        </parentStore.Provider>
      );

      const { result: parentResult } = renderHook(
        () => parentStore.useStore(s => s.get('count')),
        { wrapper: ParentWrapper }
      );

      const { result: childResult } = renderHook(
        () => childStore.useStore(s => s.get('count')),
        { wrapper: ParentWrapper }
      );

      expect(parentResult.current).toBe(0);
      expect(childResult.current).toBe(0);
    });

    it('should handle async data loading with suspense', async () => {
      const mockData = { value: 42 };
      const mockFetch = vi.fn().mockResolvedValue(mockData);
      global.fetch = mockFetch;

      const store = createNeutrixStore<TestState>({
        count: 0,
        data: null,
        isLoading: false
      });

      const loadData = store.store.action(async (s) => {
        s.set('isLoading', true);
        try {
          const data = await fetch('/api/data');
          s.set('data', data);
        } finally {
          s.set('isLoading', false);
        }
      });

      const { result } = renderHook(
        () => ({
          data: store.useStore(s => s.get('data')),
          loading: store.useStore(s => s.get('isLoading'))
        }),
        { wrapper: store.Provider }
      );

      await act(async () => {
        await loadData();
      });

      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
    });
  });

  describe('Performance Integration', () => {
    it('should handle large state updates', async () => {
      const store = createNeutrixStore<Record<string, number>>({});
      const largeState: [string, number][] = Array.from(
        { length: 1000 }, 
        (_, i): [string, number] => [`key${i}`, i]
      );

      await act(async () => {
        store.store.batch(largeState);
      });

      expect(Object.keys(store.store.getState()).length).toBe(1000);
      expect(store.store.get('key0')).toBe(0);
      expect(store.store.get('key999')).toBe(999);
    });

    it('should handle batch updates efficiently with subscriber notifications', async () => {
      const store = createNeutrixStore<Record<string, number>>({});
      const updateCount = 100;
      const updates: [string, number][] = Array.from(
        { length: updateCount }, 
        (_, i): [string, number] => [`key${i}`, i]
      );

      let individualSubscriberCalls = 0;
      const individualSubscriber = () => { individualSubscriberCalls++ };
      store.store.subscribe(individualSubscriber);

      await act(async () => {
        for (const [key, value] of updates) {
          store.store.set(key, value);
        }
      });

      const batchStore = createNeutrixStore<Record<string, number>>({});
      let batchSubscriberCalls = 0;
      const batchSubscriber = () => { batchSubscriberCalls++ };
      batchStore.store.subscribe(batchSubscriber);

      await act(async () => {
        batchStore.store.batch(updates);
      });

      expect(store.store.getState()).toEqual(batchStore.store.getState());
      expect(batchSubscriberCalls).toBeLessThan(individualSubscriberCalls);
      
      updates.forEach(([key, value]) => {
        expect(batchStore.store.get(key)).toBe(value);
      });
    });

    it('should maintain reasonable performance with subscriptions', async () => {
      const store = createNeutrixStore<Record<string, number>>({});
      const subscriberCount = 10;
      const subscribers = Array(subscriberCount).fill(0).map(() => vi.fn());
      
      subscribers.forEach(subscriber => {
        store.store.subscribe(subscriber);
      });

      await act(async () => {
        store.store.set('test', 1);
      });

      subscribers.forEach(subscriber => {
        expect(subscriber).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle rapid sequential updates', async () => {
      const store = createNeutrixStore<{ count: number }>({ count: 0 });
      const updateCount = 100;

      await act(async () => {
        for (let i = 0; i < updateCount; i++) {
          store.store.set('count', i);
        }
      });

      expect(store.store.get('count')).toBe(updateCount - 1);
    });
  });
});