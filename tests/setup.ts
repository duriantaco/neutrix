/// <reference types="vitest" />
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface Assertion extends TestingLibraryMatchers<any, any> {}
  }
}

afterEach(() => {
  cleanup();
});