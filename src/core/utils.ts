// src/core/utils.ts
import { Path, State } from './types';

export function get(obj: State, path: Path): any {
  return path.split('.').reduce((acc, part) => {
    return acc?.[part];
  }, obj);
}

export function set(obj: State, path: Path, value: any): State {
  const parts = path.split('.');
  const lastPart = parts.pop()!;
  
  // shallow copy for immutability
  const newObj = { ...obj };
  let current = newObj;

  for (const part of parts) {
    current[part] = current[part] ? { ...current[part] } : {};
    current = current[part];
  }

  current[lastPart] = value;
  return newObj;
}

// object should be a plain object (not array, null, etc)
export function isPlainObject(obj: any): boolean {
  return obj?.constructor === Object;
}

export function clone(obj: any): any {
  if (!isPlainObject(obj)) return obj;
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = isPlainObject(value) ? clone(value) : value;
    return acc;
  }, {} as Record<string, any>);
}