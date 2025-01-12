# API Reference

## Store Creation
The `createStore` function is the entry point for creating a new neutrix store. It sets up the state container with all the necessary features like state tracking, computed values, and persistence.

## createStore

Creates a new store instance.

```
function createStore<T extends State>(
  initialState?: T,
  options?: StoreOptions
): Store<T>
```

### Parameters

#### initialState
Type: `T` (optional)
The initial state of the store. If not provided, will default to an empty object.

#### options
Type: `StoreOptions` (optional)

* `devTools?: boolean` - Enable Redux DevTools integration for debugging
* `persist?: boolean | ((state: any) => any)` - Enable state persistence to localStorage. Can be a boolean or a function to customize what gets persisted
* `name?: string` - Store name for DevTools/persistence identification
* `validate?: (state: State) => boolean | string` - Validation function for state updates
* `migration?: { version: number; migrate: (oldState: any) => any }` - State migration configuration
* `concurrent?: boolean` - Enable concurrent mode support


## Store Interface

### get

`get<K extends keyof T>(path: K | string): T[K]`

Gets a value from the store using a path string.

Example:

`const userName = store.get('user.profile.name')`

### set

`set<K extends keyof T>(path: K | string, value: any): void`

Sets a value in the store at the given path.

Example:

`store.set('user.profile.name', 'John')`

### batch

`batch(updates: [string, any][]): void`

Performs multiple updates atomically.

### subscribe

`subscribe(subscriber: () => void): () => void`

Subscribes to store changes. Returns an unsubscribe function.

### computed

`computed<R>(path: string, fn: (state: T) => R): ComputedFn<R>`

Creates a computed value that updates when dependencies change.

### action
```
action<Args extends any[], Result>(
  fn: Action<Args, Result>
): (...args: Args) => Promise<Result>
```
Creates an action function for complex state updates.

Example:

```
const fetchUser = store.action(
  async (store, userId: string) => {
    store.set('loading', true)
    try {
      const user = await api.getUser(userId)
      store.set('user', user)
      return user
    } finally {
      store.set('loading', false)
    }
  }
)
```

## React Hooks

### useStore
```
function useStore<S extends State, R>(
  selector: (store: Store<S>) => R
): R
```
React hook to subscribe to store updates.

Example:
```
function UserProfile() {
  const userName = useStore(store => store.get('user.name'))
  const userAge = useStore(store => store.get('user.age'))
  
  return (
    <div>
      <h2>{userName}</h2>
      <p>Age: {userAge}</p>
    </div>
  )
}
```

## Store Connections

### connectStores
```
function connectStores<S extends State, T extends State>(
  connections: StoreConnection<S, T>[]
): () => void
```

Connects multiple stores together, allowing them to react to each other's changes.

### StoreConnection Interface
```
interface StoreConnection<S extends State = State, T extends State = State> {
  source: Store<S>;
  target: Store<T>;
  when: (source: Store<S>) => boolean;
  then: (target: Store<T>) => void;
  immediate?: boolean;
}
```

## Types

### State
```
interface State {
  [key: string]: any
}
```

### StoreOptions
```
interface StoreOptions {
  name?: string;
  devTools?: boolean;
  persist?: boolean | ((state: any) => any);
  validate?: (state: State) => boolean | string;
  migration?: {
    version: number;
    migrate: (oldState: any) => any;
  };
  concurrent?: boolean;
}
```

### Middleware
```
interface Middleware {
  onSet?: (path: Path, value: any, prevValue: any) => any;
  onGet?: (path: Path, value: any) => any;
  onBatch?: (updates: BatchUpdate) => BatchUpdate;
  onError?: (error: Error) => void;
}
```