import { describe, it, expect } from 'vitest';
import * as ReactIndex from '../../src/react/index';

describe('React Index Module', () => {
    it('should export StoreProvider', () => {
        expect(ReactIndex.StoreProvider).toBeDefined();
    });

    it('should export useStoreContext', () => {
        expect(ReactIndex.useStoreContext).toBeDefined();
    });

    it('should export useStore', () => {
        expect(ReactIndex.useStore).toBeDefined();
    });

    it('should export useComputed', () => {
        expect(ReactIndex.useComputed).toBeDefined();
    });

    it('should export useAction', () => {
        expect(ReactIndex.useAction).toBeDefined();
    });
});