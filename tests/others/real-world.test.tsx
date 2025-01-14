// src/__tests__/real-world/complex-scenarios.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createNeutrixStore } from '../../src/react/CreateNeutrixStore';
import { connectStores } from '../../src/core/connections';
import type { State } from '../../src/core/types';

interface User {
  id: string;
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface AppState extends State {
  user: User | null;
  cart: {
    items: CartItem[];
    total: number;
    status: 'idle' | 'loading' | 'checking-out';
  };
  ui: {
    isMenuOpen: boolean;
    activeModal: string | null;
    errors: Record<string, string>;
  };
}

describe('Real World Scenarios', () => {
  it('should handle complex e-commerce workflow', async () => {
    const appStore = createNeutrixStore<AppState>({
      user: null,
      cart: {
        items: [],
        total: 0,
        status: 'idle'
      },
      ui: {
        isMenuOpen: false,
        activeModal: null,
        errors: {}
      }
    });

    // Simulate login
    await act(async () => {
      appStore.store.set('user', {
        id: '123',
        name: 'Test User',
        preferences: { theme: 'light', notifications: true }
      });
    });

    // Add items to cart
    await act(async () => {
      appStore.store.batch([
        ['cart.items', [
          { id: '1', quantity: 2, price: 10 },
          { id: '2', quantity: 1, price: 20 }
        ]],
        ['cart.total', 40]
      ]);
    });

    // Simulate checkout process
    const checkout = appStore.store.action(async (store) => {
      try {
        store.set('cart.status', 'checking-out');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Clear cart after successful checkout
        store.batch([
          ['cart.items', []],
          ['cart.total', 0],
          ['cart.status', 'idle']
        ]);
        
        return true;
      } catch (error) {
        store.set('cart.status', 'idle');
        store.set('ui.errors.checkout', 'Checkout failed');
        return false;
      }
    });

    const { result } = renderHook(
      () => ({
        cart: appStore.useStore(s => s.get('cart')),
        user: appStore.useStore(s => s.get('user'))
      }),
      { wrapper: appStore.Provider }
    );

    // Verify initial state after adding items
    expect(result.current.cart.items.length).toBe(2);
    expect(result.current.cart.total).toBe(40);

    // Execute checkout
    await act(async () => {
      await checkout();
    });

    // Verify final state
    expect(result.current.cart.items.length).toBe(0);
    expect(result.current.cart.total).toBe(0);
    expect(result.current.cart.status).toBe('idle');
  });

  it('should handle concurrent user interactions', async () => {
    const appStore = createNeutrixStore<AppState>({
      user: null,
      cart: { items: [], total: 0, status: 'idle' },
      ui: { isMenuOpen: false, activeModal: null, errors: {} }
    });

    // Simulate multiple concurrent UI updates
    await act(async () => {
      Promise.all([
        appStore.store.set('ui.isMenuOpen', true),
        appStore.store.set('ui.activeModal', 'settings'),
        appStore.store.set('user.preferences.theme', 'dark')
      ]);
    });

    const { result } = renderHook(
      () => ({
        ui: appStore.useStore(s => s.get('ui')),
        theme: appStore.useStore(s => s.get('user.preferences.theme'))
      }),
      { wrapper: appStore.Provider }
    );

    expect(result.current.ui.isMenuOpen).toBe(true);
    expect(result.current.ui.activeModal).toBe('settings');
    expect(result.current.theme).toBe('dark');
  });
});