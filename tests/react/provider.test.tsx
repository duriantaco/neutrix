// provider.test.tsx
import { describe, it, expect, vi } from 'vitest';
import React, { useContext } from 'react';
import { render, screen } from '@testing-library/react';
import { Store } from '../../src/core/types';
import { NeutrixContext } from '../../src/react/context';
import { NeutrixProvider } from '../../src/react/NeutrixProvider';

import '@testing-library/jest-dom';

describe('NeutrixProvider', () => {
    const createMockStore = (): Store<{ value: number }> => ({
        getState: () => ({ value: 0 }),
        get: (path: string) => ({ value: 0 })[path as keyof { value: number }],
        set: () => {},
        batch: () => {},
        subscribe: () => () => {},
        computed: <R,>(_path: string, fn: (state: { value: number }) => R) => (() => fn({ value: 0 })),
        action: <Args extends any[], Result>(fn: (store: any, ...args: Args) => Promise<Result>) => 
            async (...args: Args) => fn({} as any, ...args),
        suspend: <R,>(promise: Promise<R>) => promise as unknown as R,
        use: () => () => {}
    });

    describe('Single Store Mode', () => {
        it('should provide single store through context', () => {
            const mockStore = createMockStore();
            
            const TestConsumer = () => {
                const context = useContext(NeutrixContext);
                expect(context?.singleStore).toBe(mockStore);
                return null;
            };

            render(
                <NeutrixProvider store={mockStore}>
                    <TestConsumer />
                </NeutrixProvider>
            );
        });

        it('should render children with single store', () => {
            const mockStore = createMockStore();

            render(
                <NeutrixProvider store={mockStore}>
                    <div>Test Child</div>
                </NeutrixProvider>
            );

            expect(screen.getByText('Test Child')).toBeInTheDocument();
        });
    });

    describe('Multi Store Mode', () => {
        it('should provide multiple stores through context', () => {
            const mockStore1 = createMockStore();
            const mockStore2 = createMockStore();
            const stores = {
                store1: mockStore1,
                store2: mockStore2
            };
            
            const TestConsumer = () => {
                const context = useContext(NeutrixContext);
                expect(context?.multiStores).toBe(stores);
                expect(context?.multiStores?.store1).toBe(mockStore1);
                expect(context?.multiStores?.store2).toBe(mockStore2);
                return null;
            };

            render(
                <NeutrixProvider stores={stores}>
                    <TestConsumer />
                </NeutrixProvider>
            );
        });

        it('should render children with multiple stores', () => {
            const stores = {
                store1: createMockStore(),
                store2: createMockStore()
            };

            render(
                <NeutrixProvider stores={stores}>
                    <div>Test Child</div>
                </NeutrixProvider>
            );

            expect(screen.getByText('Test Child')).toBeInTheDocument();
        });
    });

    it('should throw error if neither store nor stores is provided', () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => {
            render(
                <NeutrixProvider>
                    <div>Test</div>
                </NeutrixProvider>
            );
        }).toThrow('NeutrixProvider requires either a single "store" OR "stores" prop.');

        consoleError.mockRestore();
    });

    it('should allow multiple children', () => {
        const mockStore = createMockStore();

        render(
            <NeutrixProvider store={mockStore}>
                <div>Child One</div>
                <div>Child Two</div>
            </NeutrixProvider>
        );

        expect(screen.getByText('Child One')).toBeInTheDocument();
        expect(screen.getByText('Child Two')).toBeInTheDocument();
    });

    describe('Store Subscription', () => {
        it('should handle store subscription and cleanup', () => {
            const unsubscribe = vi.fn();
            const subscribe = vi.fn(() => unsubscribe);
            const mockStore: Store<any> = {
                ...createMockStore(),
                subscribe
            };

            const { unmount } = render(
                <NeutrixProvider store={mockStore}>
                    <div>Test</div>
                </NeutrixProvider>
            );

            expect(subscribe).toHaveBeenCalled();
            unmount();
            expect(unsubscribe).toHaveBeenCalled();
        });

        it('should handle multiple store subscriptions in multi-store mode', () => {
            const unsubscribe1 = vi.fn();
            const unsubscribe2 = vi.fn();
            const subscribe1 = vi.fn(() => unsubscribe1);
            const subscribe2 = vi.fn(() => unsubscribe2);

            const stores = {
                store1: { ...createMockStore(), subscribe: subscribe1 },
                store2: { ...createMockStore(), subscribe: subscribe2 }
            };

            const { unmount } = render(
                <NeutrixProvider stores={stores}>
                    <div>Test</div>
                </NeutrixProvider>
            );

            expect(subscribe1).toHaveBeenCalled();
            expect(subscribe2).toHaveBeenCalled();
            unmount();
            expect(unsubscribe1).toHaveBeenCalled();
            expect(unsubscribe2).toHaveBeenCalled();
        });
    });
});