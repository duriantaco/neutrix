// src/core/optimizePath.ts

export function optimizePath(path: string | number | symbol | (string | number | symbol)[]): string[] {
    if (Array.isArray(path)) {
      return path
        .flatMap(part => String(part).split('.')) 
        .filter(Boolean);    
    }
  
    return String(path)
      .split('.')
      .filter(Boolean);
  }
  