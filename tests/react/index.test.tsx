import { describe, it, expect } from 'vitest';
import * as ReactIndex from '../../src/react/index';

describe('React Index Module', () => {
    it('should export NeutrixProvider', () => {
        expect(ReactIndex.NeutrixProvider).toBeDefined();
    });

    it('should export NeutrixProviderProps type', () => {
        expect(true).toBe(true);
    });

    it('should export NeutrixContextValue type', () => {
        expect(true).toBe(true);
    });

    it('should export useNeutrixSelector', () => {
        expect(ReactIndex.useNeutrixSelector).toBeDefined();
    });

    it('should export useNeutrixComputed', () => {
        expect(ReactIndex.useNeutrixComputed).toBeDefined();
    });

    it('should export useNeutrixAction', () => {
        expect(ReactIndex.useNeutrixAction).toBeDefined();
    });
});