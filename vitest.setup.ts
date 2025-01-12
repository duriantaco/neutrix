/// <reference types="vitest" />
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    length: 0,
    key: vi.fn(),
  };
  
  global.localStorage = localStorageMock;
  
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  
  Object.defineProperty(window, '__REDUX_DEVTOOLS_EXTENSION__', {
    writable: true,
    value: {
      connect: () => ({
        init: vi.fn(),
        send: vi.fn()
      })
    }
  });