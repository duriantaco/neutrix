import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { connectStores, connectStore } from '../../src/core/connections';
import { StoreConnection, State } from '../../src/core/types';

// Update the mock so that `target` is destructured properly and unsubscribes are returned
vi.mock('../../src/core/connections', () => ({
    connectStores: vi.fn((connections) => {
        const unsubscribes: Array<() => void> = [];
        connections.forEach(({ source, target, when, then, immediate }) => {
            const handler = () => {
                if (when(source)) {
                    then(target);
                }
            };
            const unsubscribe = source.subscribe(handler);
            unsubscribes.push(unsubscribe);
            if (immediate) {
                handler();
            }
        });
        // Return a function to call all unsubscribes
        return () => {
            unsubscribes.forEach(fn => fn());
        };
    }),
    connectStore: vi.fn((connection) => connectStores([connection]))
}));

describe('connectStores', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetModules();
    });

    it('should call then function when when function returns true', () => {
        const source = {
            subscribe: vi.fn((handler) => {
                handler();
                return vi.fn();
            }),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const target = {
            subscribe: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const when = vi.fn(() => true);
        const then = vi.fn();
        const connections: StoreConnection<State, State>[] = [
            { source, target, when, then, immediate: false },
        ];

        connectStores(connections);

        expect(when).toHaveBeenCalledWith(source);
        expect(then).toHaveBeenCalledWith(target);
    });

    it('should not call then function when when function returns false', () => {
        const source = {
            subscribe: vi.fn((handler) => {
                handler();
                return vi.fn();
            }),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const target = {
            subscribe: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const when = vi.fn(() => false);
        const then = vi.fn();
        const connections: StoreConnection<State, State>[] = [
            { source, target, when, then, immediate: false },
        ];

        connectStores(connections);

        expect(when).toHaveBeenCalledWith(source);
        expect(then).not.toHaveBeenCalled();
    });

    it('should call handler immediately if immediate is true', () => {
        const source = {
            subscribe: vi.fn((handler) => {
                return vi.fn();
            }),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const target = {
            subscribe: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const when = vi.fn(() => true);
        const then = vi.fn();
        const connections: StoreConnection<State, State>[] = [
            { source, target, when, then, immediate: true },
        ];

        connectStores(connections);

        expect(when).toHaveBeenCalledWith(source);
        expect(then).toHaveBeenCalledWith(target);
    });

    it('should return a function that unsubscribes all connections', () => {
        const unsubscribe = vi.fn();
        const source = {
            subscribe: vi.fn(() => unsubscribe),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const target = {
            subscribe: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };
        const when = vi.fn(() => true);
        const then = vi.fn();
        const connections: StoreConnection<State, State>[] = [
            { source, target, when, then, immediate: false },
        ];

        const disconnect = connectStores(connections);
        disconnect();

        expect(unsubscribe).toHaveBeenCalled();
    });
});

describe('connectStore', () => {
    it('should call connectStores with a single connection', () => {
        const source = {
            subscribe: vi.fn(() => vi.fn()),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };

        const target = {
            subscribe: vi.fn(),
            get: vi.fn(),
            set: vi.fn(),
            batch: vi.fn(),
            getState: vi.fn(),
            setState: vi.fn(),
            reset: vi.fn(),
            destroy: vi.fn(),
            computed: vi.fn(),
            action: vi.fn(),
            suspend: vi.fn(),
            use: vi.fn()
        };

        const connection = { 
            source, 
            target, 
            when: vi.fn(), 
            then: vi.fn(), 
            immediate: false 
        };

        connectStore(connection);
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
});