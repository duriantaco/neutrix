import { describe, it, expect, vi } from 'vitest';
import { get } from '../../src/core/utils';

function set(obj: any, path: string, value: any) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return obj;
}

describe('utils', () => {
    describe('get', () => {
        it('should get nested value from object', () => {
            const obj = { a: { b: { c: 1 } } };
            expect(get(obj, 'a.b.c')).toBe(1);
        });

        it('should return undefined for non-existent path', () => {
            const obj = { a: { b: 1 } };
            expect(get(obj, 'a.c')).toBeUndefined();
        });
    });

    describe('set', () => {
        it('should set nested value in object', () => {
            const obj = { a: { b: 1 } };
            const result = set(obj, 'a.b', 2);
            expect(result).toEqual({ a: { b: 2 } });
        });

        it('should handle array paths', () => {
            const arr = [1, 2, 3];
            const result = set(arr, '1', 4);
            expect(result).toEqual([1, 4, 3]);
        });
    });
});