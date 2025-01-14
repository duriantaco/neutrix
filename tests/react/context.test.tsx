// tests/react/context.test.tsx
import { describe, it, expect } from 'vitest';
import { NeutrixContext, getStoreFromContext } from '../../src/react/context';
import { createStore } from '../../src/core/store';
import { renderHook } from '@testing-library/react';
import { useContext } from 'react';
import React from 'react';
import type { Store, State } from '../../src/core/types';

interface TestState extends State {
  count: number;
}

describe('Neutrix Context', () => {
  describe('NeutrixContext', () => {
    it('should be defined', () => {
      expect(NeutrixContext).toBeDefined();
      expect(NeutrixContext.Provider).toBeDefined();
      expect(NeutrixContext.Consumer).toBeDefined();
    });

    it('should have null as default value', () => {
      const { result } = renderHook(() => useContext(NeutrixContext));
      expect(result.current).toBeNull();
    });

    it('should provide context value to children', () => {
      const store = createStore<TestState>({ count: 0 });
      const contextValue = { singleStore: store };
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NeutrixContext.Provider value={contextValue}>
          {children}
        </NeutrixContext.Provider>
      );

      const { result } = renderHook(() => useContext(NeutrixContext), { wrapper });
      
      expect(result.current).toBeDefined();
      expect(result.current?.singleStore).toBe(store);
    });
  });

  describe('getStoreFromContext', () => {
    it('should throw error when context is null', () => {
      expect(() => getStoreFromContext(null)).toThrow('No NeutrixContext provided');
    });

    it('should throw error when singleStore is undefined', () => {
      const contextValue = { multiStores: {} };
      expect(() => getStoreFromContext(contextValue)).toThrow('No singleStore found in NeutrixContext');
    });

    it('should return store when context is valid', () => {
      const store = createStore<TestState>({ count: 0 });
      const contextValue = { singleStore: store };
      
      const result = getStoreFromContext(contextValue);
      expect(result).toBe(store);
    });

    it('should work with type parameters', () => {
      const store = createStore<TestState>({ count: 0 });
      const contextValue = { singleStore: store };
      
      const result = getStoreFromContext<TestState>(contextValue);
      expect(result).toBe(store);
      const _count: number = result.get('count');
    });
  });

  describe('Context with multiple stores', () => {
    it('should handle multiple stores in context', () => {
      const store1 = createStore<TestState>({ count: 0 });
      const store2 = createStore<TestState>({ count: 10 });
      
      const contextValue = {
        multiStores: {
          store1,
          store2
        }
      };

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NeutrixContext.Provider value={contextValue}>
          {children}
        </NeutrixContext.Provider>
      );

      const { result } = renderHook(() => useContext(NeutrixContext), { wrapper });
      
      expect(result.current?.multiStores).toBeDefined();
      expect(result.current?.multiStores?.store1).toBe(store1);
      expect(result.current?.multiStores?.store2).toBe(store2);
      expect(result.current?.multiStores?.store1.get('count')).toBe(0);
      expect(result.current?.multiStores?.store2.get('count')).toBe(10);
    });
  });

  describe('Context type safety', () => {
    it('should maintain type information through context', () => {
      interface ComplexState extends State {
        user: {
          name: string;
          settings: {
            theme: 'light' | 'dark';
          };
        };
      }

      const store = createStore<ComplexState>({
        user: {
          name: 'Test',
          settings: {
            theme: 'light'
          }
        }
      });

      const contextValue = { singleStore: store };
      const result = getStoreFromContext<ComplexState>(contextValue);
      
      const userName = result.get('user.name');
      expect(typeof userName).toBe('string');
      
      const theme = result.get('user.settings.theme');
      expect(theme === 'light' || theme === 'dark').toBe(true);
    });
  });
});