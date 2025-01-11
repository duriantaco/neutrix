// src/index.ts

export { createStore } from './core/store';
export { connectStores, connectStore } from './core/connections';

export type {
  Store,
  State,
  Path,
  BatchUpdate,
  StoreConnection,
  StoreOptions,
  Middleware,
  Action,
  ComputedFn,
  Primitive,
  DeepPartial,
  Subscriber
} from './core/types';

export {
  StoreProvider,
  useStoreContext,
  useStore,
  useComputed,
  useAction
} from './react';