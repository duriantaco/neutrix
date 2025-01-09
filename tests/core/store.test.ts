import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createStore } from '../../src/core/store';
import { State, StoreOptions } from '../../src/core/types';

interface TestState extends State {
    count: number;
    name: string;
}

describe('createStore', () => {
    let store: ReturnType<typeof createStore<TestState>>;
    let initialState: TestState;
    const mockStorage: Record<string, string> = {};

    beforeEach(() => {
        Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
        initialState = { count: 0, name: 'test' };
        store = createStore(initialState);

        vi.spyOn(Storage.prototype, 'setItem')
            .mockImplementation((key, value) => {
                mockStorage[key] = value;
            });

        vi.spyOn(Storage.prototype, 'getItem')
            .mockImplementation((key) => mockStorage[key] || null);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should initialize with the given state', () => {
        expect(store.getState()).toEqual(initialState);
    });

    it('should get a value from the state', () => {
        expect(store.get('count')).toBe(0);
        expect(store.get('name')).toBe('test');
    });

    it('should set a value in the state', () => {
        store.set('count', 1);
        expect(store.get('count')).toBe(1);
    });

    it('should notify subscribers on state change', () => {
        const subscriber = vi.fn();
        store.subscribe(subscriber);
        store.set('count', 1);
        expect(subscriber).toHaveBeenCalled();
    });

    it('should batch updates', () => {
        store.batch([
            ['count', 1],
            ['name', 'updated']
        ]);
        expect(store.get('count')).toBe(1);
        expect(store.get('name')).toBe('updated');
    });

    it('should use middleware', () => {
        const middleware = {
            onGet: vi.fn((path, value) => value),
            onSet: vi.fn((path, nextValue, prevValue) => nextValue)
        };
        store.use(middleware);
        store.get('count');
        store.set('count', 1);
        expect(middleware.onGet).toHaveBeenCalledWith('count', 0);
        expect(middleware.onSet).toHaveBeenCalledWith('count', 1, 0);
    });

    it('should compute derived state', () => {
        const doubleCount = store.computed('doubleCount', state => state.count * 2);
        expect(doubleCount()).toBe(0);
        store.set('count', 2);
        expect(doubleCount()).toBe(4);
    });

    it('should handle actions', async () => {
        const increment = vi.fn(async (store: ReturnType<typeof createStore<TestState>>, amount: number) => {
            const currentCount = store.get('count');
            store.set('count', currentCount + amount);
        });
        const incrementAction = store.action(increment);
        await incrementAction(2);
        expect(store.get('count')).toBe(2);
        expect(increment).toHaveBeenCalledWith(store, 2);
    });

    it('should persist state if options.persist is true', () => {
        const persistStore = createStore<TestState>(
            initialState,
            { persist: true, name: 'test-store' }
        );
        
        persistStore.set('count', 1);
        const storedValue = mockStorage['test-store'];
        expect(storedValue).toBeTruthy();
        const savedState = JSON.parse(storedValue);
        expect(savedState.count).toBe(1);
    });

    it('should load persisted state if options.persist is true', () => {
        localStorage.setItem('test-store', JSON.stringify({ count: 1, name: 'persisted' }));
        const persistOptions: StoreOptions = { persist: true, name: 'test-store' };
        const persistStore = createStore(initialState, persistOptions);
        expect(persistStore.getState()).toEqual({ count: 1, name: 'persisted' });
    });
});

export function optimizePath(path: string | number | symbol): string[] {
    const pathStr = String(path);
    return pathStr.split('.').reduce<string[]>((acc, part) => {
        if (part) {
            acc.push(part);
        }
        return acc;
    }, []);
}