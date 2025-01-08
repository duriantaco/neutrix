import { describe, it, expect } from 'vitest';
import { LRUCache } from '../../src/core/cache';

describe('LRUCache', () => {
    it('should set and get a value', () => {
        const cache = new LRUCache<string, number>();
        cache.set('a', 1);
        expect(cache.get('a')).toBe(1);
    });

    it('should return undefined for non-existent key', () => {
        const cache = new LRUCache<string, number>();
        expect(cache.get('b')).toBeUndefined();
    });

    it('should delete a key', () => {
        const cache = new LRUCache<string, number>();
        cache.set('a', 1);
        cache.delete('a');
        expect(cache.get('a')).toBeUndefined();
    });

    it('should check if a key exists', () => {
        const cache = new LRUCache<string, number>();
        cache.set('a', 1);
        expect(cache.has('a')).toBe(true);
        cache.delete('a');
        expect(cache.has('a')).toBe(false);
    });

    it('should clear the cache', () => {
        const cache = new LRUCache<string, number>();
        cache.set('a', 1);
        cache.set('b', 2);
        cache.clear();
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBeUndefined();
    });

    it('should evict the least recently used item', () => {
        const cache = new LRUCache<string, number>(2);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBe(2);
        expect(cache.get('c')).toBe(3);
    });

    it('should update the recently used order on get', () => {
        const cache = new LRUCache<string, number>(2);
        cache.set('a', 1);
        cache.set('b', 2);
        cache.get('a');
        cache.set('c', 3);
        expect(cache.get('b')).toBeUndefined();
        expect(cache.get('a')).toBe(1);
        expect(cache.get('c')).toBe(3);
    });
});