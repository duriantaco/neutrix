import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { StoreContext, useStoreContext } from '../../src/react/context';
import { ReactNode } from 'react';
import React from 'react';
import { Store, State, Middleware } from '../../src/core/types';

interface MockState extends State {
    value: number;
}

const mockStore: Store<MockState> = {
    get: () => 42,
    set: () => {},
    batch: () => {},
    subscribe: () => () => {},
    getState: () => ({ value: 42 }),
    computed: function <R>(_path: string, fn: (state: MockState) => R) { return () => fn({ value: 42 }); },
    action: function <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) { return (...args: Args) => fn(mockStore, ...args); },
    suspend: function <R>(_promise: Promise<R>) { return {} as R; },
    use: function (_middleware: Middleware) { return () => {}; }
};

const Wrapper = ({ children }: { children: ReactNode }): JSX.Element => {
    return React.createElement(StoreContext.Provider, { value: mockStore }, children);
};

describe('useStoreContext', () => {
    it('should throw an error if used outside of a Provider', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => {
            renderHook(() => {
                const store = useStoreContext<MockState>();
                return store;
            });
        }).toThrow('useStore must be used within a Provider');

        consoleSpy.mockRestore();
    });

    it('should return the store if used within a Provider', () => {
        const { result } = renderHook(() => useStoreContext<MockState>(), { 
            wrapper: Wrapper 
        });
        expect(result.current).toBe(mockStore);
    });
});