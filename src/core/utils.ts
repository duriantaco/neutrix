// src/core/utils.ts
import { optimizePath } from './optimizePath';

export function get(obj: any, path: string): any {
    const parts = optimizePath(path);
    return parts.reduce((acc, part) => {
      if (acc === undefined) return undefined;
      return acc[part];
    }, obj);
}
  
export function set(obj: any, path: string, value: any): any {
    const parts = optimizePath(path);
    if (parts.length === 0) return value;
    
    return parts.reduceRight((val, part) => {  
      const newObj = Array.isArray(obj) ? [...obj] : {...obj};
      newObj[part] = val;
      return newObj;
    }, value);
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  equals = (a: any, b: any) => a === b
): T {
  let lastArgs: any[] | undefined;
  let lastResult: any;

  return ((...args: any[]) => {
    if (!lastArgs || !args.every((arg, i) => equals(arg, lastArgs![i]))) {
      lastResult = fn(...args);
      lastArgs = args;
    }
    return lastResult;
  }) as T;
}