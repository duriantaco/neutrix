// src/core/utils.ts
export function get(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return acc[key];
    }
    return undefined;
  }, obj);
}

export function set(obj: any, path: string, value: any): any {
  const newObj = Array.isArray(obj) ? [...obj] : { ...obj };

  const keys = path.split('.');
  const lastKey = keys.pop()!;
  let current = newObj as any;

  for (const key of keys) {
    if (current[key] == null || typeof current[key] !== 'object') {
      current[key] = /^\d+$/.test(key) ? [] : {};
    }
    current[key] = Array.isArray(current[key])
      ? [...current[key]]
      : { ...current[key] };
    current = current[key];
  }

  current[lastKey] = value;
  return newObj;
}
