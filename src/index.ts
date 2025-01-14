// src/index.ts

export { createStore, createStoreForSSR } from './core/store';
export { connectStores, connectStore } from './core/connections';

export { NeutrixProvider } from './react/NeutrixProvider';
export {
  useNeutrixSelector,
  useNeutrixComputed,
  useNeutrixAction
} from './react/hooks';

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

export type {
  NeutrixProviderProps,
} from './react/NeutrixProvider';