import { afterEach, vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

const store: Record<string, string> = {};

const mockStorage = {
  getItem: vi.fn((key: string) => store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete store[key];
  }),
  clear: vi.fn(() => {
    Object.keys(store).forEach(key => delete store[key]);
  }),
  length: 0,
  key: vi.fn((index: number) => Object.keys(store)[index] || null),
};

Object.defineProperty(window, 'localStorage', {
  value: mockStorage
});

global.Storage.prototype.getItem = mockStorage.getItem;
global.Storage.prototype.setItem = mockStorage.setItem;
global.Storage.prototype.removeItem = mockStorage.removeItem;
global.Storage.prototype.clear = mockStorage.clear;
global.Storage.prototype.key = mockStorage.key;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mockStorage.clear();
  Object.keys(store).forEach(key => delete store[key]);
});