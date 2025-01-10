import { describe, it, expect } from 'vitest';
import { LRUCache } from '../../src/core/cache';

describe('LRUCache', () => {

    it('should throw error for invalid size', () => {
        expect(() => new LRUCache(0)).toThrow('Cache size must be greater than 0');
        expect(() => new LRUCache(-1)).toThrow('Cache size must be greater than 0');
    });

    it('should report correct size', () => {
        const cache = new LRUCache<string, number>(5);
        expect(cache.size()).toBe(0);
        
        cache.set('a', 1);
        cache.set('b', 2);
        expect(cache.size()).toBe(2);
        
        cache.delete('a');
        expect(cache.size()).toBe(1);
        
        cache.clear();
        expect(cache.size()).toBe(0);
    });

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

describe('Advanced Cache Behavior', () => {
    it('should properly handle eviction with rapid operations', () => {
        const cache = new LRUCache<string, object>(2);
        const obj1 = { data: 'test1' };
        const obj2 = { data: 'test2' };
        const obj3 = { data: 'test3' };
        
        cache.set('a', obj1);
        cache.set('b', obj2);
        cache.set('c', obj3);
        
        // Check if obj1 was properly evicted
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toEqual({ data: 'test2' });
        expect(cache.get('c')).toEqual({ data: 'test3' });
    });

    it('should handle rapid set/delete operations correctly', () => {
        const cache = new LRUCache<number, object>(3);
        
        for (let i = 0; i < 10; i++) {
            cache.set(i, { data: `test${i}` });
            if (i % 2 === 0) {
                cache.delete(i - 1);
            }
        }
        
        // Should only have the last 3 valid items
        let size = 0;
        for (let i = 0; i < 10; i++) {
            if (cache.has(i)) size++;
        }
        expect(size).toBeLessThanOrEqual(3);
    });
});

describe('Concurrent Operations', () => {
    it('should handle concurrent get/set operations safely', async () => {
        const cache = new LRUCache<string, number>(5);
        const operations: Promise<void>[] = [];
        
        for (let i = 0; i < 100; i++) {
            operations.push(
                Promise.resolve().then(() => {
                    if (i % 2 === 0) {
                        cache.set(`key${i}`, i);
                    } else {
                        cache.get(`key${i-1}`);
                    }
                })
            );
        }
        
        await Promise.all(operations);
        
        let size = 0;
        for (let i = 0; i < 100; i++) {
            if (cache.has(`key${i}`)) size++;
        }
        expect(size).toBeLessThanOrEqual(5);
    });
});

describe('LRUCache Dependency Chain', () => {
    it('should handle deep dependency chains without stack overflow', () => {
        const cache = new LRUCache<string, number>(1000);
        
        for (let i = 0; i < 1000; i++) {
            cache.set(`dep${i}`, i);
            const prevValue = cache.get(`dep${i-1}`);
            if (prevValue !== undefined) {
                cache.set(`dep${i}`, prevValue + 1);
            }
        }
        
        expect(cache.get('dep999')).toBeDefined();
    });

    it('should maintain correct LRU order in dependency chains', () => {
        const cache = new LRUCache<string, number>(3);
        
        cache.set('a', 1);
        cache.set('b', 2);
        cache.set('c', 3);
        
        cache.get('b');
        
        cache.set('d', 4);
        
        expect(cache.get('a')).toBeUndefined();
        expect(cache.get('b')).toBe(2);
        expect(cache.get('c')).toBe(3);
        expect(cache.get('d')).toBe(4);
    });
});