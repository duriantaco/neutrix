import { describe, it, expect } from 'vitest';
import { optimizePath } from '../../src/core/optimizePath';

describe('optimizePath', () => {
    it('should split a dot-separated string into an array of strings', () => {
        const path = 'a.b.c';
        const result = optimizePath(path);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty string', () => {
        const path = '';
        const result = optimizePath(path);
        expect(result).toEqual([]);
    });

    it('should ignore consecutive dots', () => {
        const path = 'a..b.c';
        const result = optimizePath(path);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle leading and trailing dots', () => {
        const path = '.a.b.c.';
        const result = optimizePath(path);
        expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle only dots', () => {
        const path = '...';
        const result = optimizePath(path);
        expect(result).toEqual([]);
    });
});