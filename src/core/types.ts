// src/core/types.ts
export type State = Record<string, any>;

export type Path = string;

export type BatchUpdate = [Path, any][];

export type Subscriber = () => void;


export interface Store {
  get: (path: Path) => any;
  set: (path: Path, value: any) => void;
  batch: (updates: BatchUpdate) => void;
  subscribe: (subscriber: Subscriber) => () => void;
  [key: string]: any;
}

export interface StoreOptions {
  devTools?: boolean;
  name?: string;
}