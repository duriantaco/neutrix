# Getting Started with neutrix

## Installation

Add neutrix to your project:

```bash
npm install neutrix
```

## Core Features Overview

neutrix is a state management library providing the following core capabilities:

### Store Management

* State creation and configuration
* Immutable updates
* Batch operations
* Path-based access

### Advanced Features

* Computed values with LRU caching
* Suspense support
* Store connections
* Middleware system
* Path optimization
* DevTools integration
* State persistence and migration

### React Integration

* Provider system
* Custom hooks
* Action handling

## Basic Concepts

### Creating a Store

The store is the central piece of neutrix. It holds your application state and provides methods to interact with it. Create a store using createStore:

```typescript
const store = createStore(initialState, {
  name: 'my-store',         // For DevTools and persistence
  devTools: true,          // Enable Redux DevTools
  persist: true,           // Save to localStorage
  validate: (state) => {   // Add validation
    return true // or validation message
  }
})
```

### Store Connections

Connect and sync multiple stores together:

Features:

* Synchronize state between stores
* Conditional updates
* Immediate or delayed execution
* Clean disconnection

```typescript
connectStores([{
  source: storeA,
  target: storeB,
  when: (source) => boolean,  // Condition for sync
  then: (target) => void,     // Sync logic
  immediate?: boolean         // Execute immediately
}])

// Or single connection
connectStore({
  source: storeA,
  target: storeB,
  when: (source) => boolean,
  then: (target) => void
})
```

### State Operations

neutrix provides several ways to interact with state:

Basic Operations:

* Reading state using `get`
* Updating state using `set`
* Batch updates for multiple changes
* Full state access with `getState`


```typescript
// Reading state
const value = store.get('user.name')
const fullState = store.getState()

// Updating state
store.set('user.name', 'John')

// Batch updates
store.batch([
  ['user.name', 'John'],
  ['user.age', 30]
])
```

### Computed Values

Computed values are derived state that update automatically when dependencies change:

Features:

* Automatic dependency tracking
* LRU caching for performance
* Circular dependency detection
* Clear error handling

```typescript
const totalItems = store.computed('totalItems', (state) => {
  return state.items.length
})
```

### Suspense Support

Handle async data loading with React Suspense:

Features:

* Integrate with React Suspense
* Cache promise results
* Automatic promise tracking

### Middleware

Middleware lets you intercept and transform state operations:

Capabilities:

* Transform values during get/set
* Add validation logic
* Log state changes
* Handle errors

```typescript
interface Middleware {
  onSet?: (path: Path, value: any, prevValue: any) => any
  onGet?: (path: Path, value: any) => any
  onBatch?: (updates: BatchUpdate) => BatchUpdate
  onError?: (error: Error) => void
}

// Using middleware
const middleware: Middleware = {
  onSet: (path, value, prevValue) => {
    // Transform or validate value
    return value
  },
  onGet: (path, value) => {
    // Transform retrieved value
    return value
  },
  onBatch: (updates) => {
    // Transform batch updates
    return updates
  },
  onError: (error) => {
    // Handle errors
  }
}

store.use(middleware)
```

### React Integration

#### Store provider

neutrix provides React hooks for easy integration:

* Wrap your app with `StoreProvider`
* Provides store context to all components
* Handles subscriptions automatically

```typescript
import { useStore } from 'neutrix/react'

function Counter() {
  const count = useStore(store, 'count')
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => store.set('count', count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

#### Hooks 

* useStore: Subscribe to state values
* useComputed: Use computed values in components
* useAction: Handle async actions with loading states

```typescript
const { execute, loading, error } = useAction(
  async (store, ...args) => {
    // Async logic here
    return result
  }
)
```

### Performance Features

neutrix includes several performance optimizations:

#### LRU Cache System

Built-in caching system for computed values:

Features:

* Fixed size cache (default 50 entries)
* Automatic least-recently-used eviction
* O(1) operations
* Memory leak prevention

```typescript
// The cache is used internally by computed values
const cache = new LRUCache<K, V>(maxSize)

// Operations available
cache.get(key)
cache.set(key, value)
cache.delete(key)
cache.clear()
```

#### Batch Updates

* Combine multiple updates
* Reduce re-renders
* Maintain consistency

#### Dependency Tracking

* Only update when needed
* Automatic dependency detection
* Efficient re-computation

### Technical Details

The library provides these core types:

* Store`<T>`: Main store interface
* State: Base state type
* Middleware: Middleware interface
* StoreOptions: Store configuration
* BatchUpdate: Batch update type

Each feature is built with TypeScript for type safety and better developer experience.

### Type definitions

```typescript
type State = {
  [key: string]: any
}

type Path = string

type BatchUpdate = Array<[string, any]>

interface StoreOptions {
  name?: string
  devTools?: boolean
  persist?: boolean | ((state: any) => any)
  validate?: (state: State) => boolean | string
  migration?: {
    version: number
    migrate: (oldState: any) => any
  }
  concurrent?: boolean
}

interface Store<T extends State> {
  get<K extends keyof T>(path: K | string): T[K]
  set<K extends keyof T>(path: K | string, value: T[K]): void
  batch(updates: BatchUpdate): void
  subscribe(subscriber: () => void): () => void
  getState(): T
  computed<R>(path: string, fn: (state: T) => R): ComputedFn<R>
  action<Args extends any[], Result>(
    fn: Action<Args, Result>
  ): (...args: Args) => Promise<Result>
  suspend<R>(promise: Promise<R>): R
  use(middleware: Middleware): () => void
}
```

### Next Steps

- Check out the [Tutorials](/tutorials/) section for more usage patterns
- Read the [API Reference](/api/)