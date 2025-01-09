// provider.test.tsx
import { describe, it, expect, vi } from 'vitest';
import React, { useContext, useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, StoreContext } from '../../src/react/provider';
import { Store } from '../../src/core/types';
import '@testing-library/jest-dom';

describe('Provider', () => {
    it('should provide store through context', () => {
        const mockStore: Store<{ value: number }> = {
            getState: () => ({ value: 0 }),
            get: (path: string) => ({ value: 0 })[path as keyof { value: number }],
            set: () => {},
            batch: () => {},
            subscribe: () => () => {},
            computed: <R,>(path: string, fn: (state: { value: number }) => R) => (() => fn({ value: 0 })),
            action: <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) => 
                async (...args: Args) => fn(mockStore, ...args),
            suspend: <R,>(promise: Promise<R>) => promise as unknown as R,
            use: () => () => {}
        };

        const TestConsumer = () => {
            const store = useContext(StoreContext);
            expect(store).toBe(mockStore);
            return null;
        };

        render(
            React.createElement(
                Provider,
                { store: mockStore, children: <TestConsumer /> }
            )
        );
    });

    it('should render children', () => {
        const mockStore: Store<any> = {
            getState: () => ({}),
            get: () => ({}),
            set: () => {},
            batch: () => {},
            subscribe: () => () => {},
            computed: <R,>(_: string, fn: (state: any) => R) => (() => fn({})),
            action: <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) => 
                async (...args: Args) => fn(mockStore, ...args),
            suspend: <R,>(promise: Promise<R>) => promise as unknown as R,
            use: () => () => {}
        };

        render(
            React.createElement(
                Provider,
                { store: mockStore, children: <div>Test Child</div> }
            )
        );

        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should allow multiple children', () => {
        const mockStore: Store<any> = {
            getState: () => ({}),
            get: () => ({}),
            set: () => {},
            batch: () => {},
            subscribe: () => () => {},
            computed: <R,>(_: string, fn: (state: any) => R) => (() => fn({})),
            action: <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) => 
                async (...args: Args) => fn(mockStore, ...args),
            suspend: <R,>(promise: Promise<R>) => promise as unknown as R,
            use: () => () => {}
        };

        render(
            React.createElement(Provider, {
                store: mockStore,
                children: [<div key="1">Child One</div>, <div key="2">Child Two</div>]
            })
        );

        expect(screen.getByText('Child One')).toBeInTheDocument();
        expect(screen.getByText('Child Two')).toBeInTheDocument();
    });

    it('should call subscribe on mount and unsubscribe on unmount', () => {
        const unsubscribe = vi.fn();
        const subscribe = vi.fn(() => unsubscribe);
        const mockStore: Store<any> = {
            getState: () => ({}),
            get: () => ({}),
            set: () => {},
            batch: () => {},
            subscribe,
            computed: <R,>(_: string, fn: (state: any) => R) => (() => fn({})),
            action: <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) => 
                async (...args: Args) => fn(mockStore, ...args),
            suspend: <R,>(promise: Promise<R>) => promise as unknown as R,
            use: () => () => {}
        };

        const { unmount } = render(
            React.createElement(Provider, { 
                store: mockStore,
                children: <div>Test</div>
            })
        );

        expect(subscribe).toHaveBeenCalled();
        unmount();
        expect(unsubscribe).toHaveBeenCalled();
    });
});