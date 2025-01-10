// types.ts
export type Primitive = string | number | boolean | null | undefined;
export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export type Path = string;
export type Subscriber = () => void;

export interface StoreConnection<S extends State = State, T extends State = State> {
  source: Store<S>;
  target: Store<T>;
  when: (source: Store<S>) => boolean;
  then: (target: Store<T>) => void;
  immediate?: boolean; 
}

export interface Middleware {
  onSet?: (path: Path, value: any, prevValue: any) => any;
  onGet?: (path: Path, value: any) => any;
  onBatch?: (updates: BatchUpdate) => BatchUpdate;
  onError?: (error: Error) => void;
}
  
export interface StoreOptions {
    name?: string;
    devTools?: boolean;
    persist?: boolean | ((state: any) => any);
    validate?: (state: State) => boolean | string; 
    migration?: {                                  
    version: number;
    migrate: (oldState: any) => any;
  };
}
  
  
export type BatchUpdate = Array<[string, any]>;
  
export interface Store<T extends State = State> {
    get<K extends keyof T>(path: K | string): T[K];
    set<K extends keyof T>(path: K | string, value: T[K]): void;
    batch(updates: BatchUpdate): void;
    subscribe(subscriber: () => void): () => void;
    getState(): T;
    computed<R>(path: string, fn: (state: T) => R): ComputedFn<R>;
    action<Args extends any[], Result>(fn: Action<Args, Result>): (...args: Args) => Promise<Result>;
    suspend<R>(promise: Promise<R>): R;
    use(middleware: Middleware): () => void;
  }
  
  export interface State {
    [key: string]: any;
  }
  
export type Action<Args extends any[], Result> = (store: any, ...args: Args) => Promise<Result>;
  

export interface StoreOptions {
  devTools?: boolean;
  name?: string;
  persist?: boolean | ((state: any) => any);
  concurrent?: boolean;
}

export type ComputedFn<T> = () => T;