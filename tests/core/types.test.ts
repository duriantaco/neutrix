import { describe, test, expect } from 'vitest';
import type { DeepPartial, Store, State, StoreConnection, Middleware, BatchUpdate } from '../../src/core/types';

describe('Type definitions', () => {
    test('DeepPartial type handles primitive values', () => {
        type TestType = {
            str: string;
            num: number;
            bool: boolean;
            nil: null;
            undef: undefined;
        };
        
        const partial: DeepPartial<TestType> = {
            str: 'test',
            num: 42
        };
        
        expect(partial.str).toBe('test');
        expect(partial.num).toBe(42);
        expect(partial.bool).toBeUndefined();
    });

    test('DeepPartial type handles nested objects', () => {
        type NestedType = {
            nested: {
                value: string;
                arr: number[];
            }
        };
        
        const partial: DeepPartial<NestedType> = {
            nested: {
                value: 'test'
            }
        };
        
        expect(partial.nested?.value).toBe('test');
        expect(partial.nested?.arr).toBeUndefined();
    });

    test('Store interface type check', () => {
        const store: Store<State> = {
            get: (path) => ({}),
            set: (path, value) => {},
            batch: (updates: BatchUpdate) => {},
            subscribe: () => () => {},
            getState: () => ({}),
            computed: (_path, fn) => ((...args: any[]) => fn({} as State)),
            action: <Args extends any[]>(fn: (store: Store<State>, ...args: Args) => any) => ((...args: Args) => fn({} as Store<State>, ...args)),
            suspend: <R>(promise: Promise<R>): R => ({} as R),
            use: (middleware) => () => {}
        };
        
        expect(typeof store.get).toBe('function');
        expect(typeof store.set).toBe('function');
        expect(typeof store.subscribe).toBe('function');
    });
});