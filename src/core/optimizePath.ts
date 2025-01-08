//src/core/optimizePath.ts
export function optimizePath(path: string): string[] {
    return path.split('.').reduce<string[]>((acc, part) => {
      if (part) {
        acc.push(part);
      }
      return acc;
    }, []);
  }