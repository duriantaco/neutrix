export { createStore } from './core/store';
export { connectStores, connectStore } from './core/connections';
export type { Store, State, Path, BatchUpdate, StoreConnection } from './core/types';
export { StoreProvider as Provider, useStore} from './react';