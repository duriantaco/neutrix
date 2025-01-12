# Best Practices 

## Store Organization

### Structure Your State Thoughtfully

Your store's state structure is crucial for maintainability and performance. Looking at how neutrix implements paths and updates, here's how to organize your state effectively:

```typescript
// ❌ Avoid deeply nested state
const store = createStore({
  users: {
    data: {
      byId: {
        settings: {
          preferences: {}
        }
      }
    }
  }
})

// ✅ Use flatter state structures
const store = createStore({
  users: {},
  userSettings: {},
  userPreferences: {}
})
```

## Computed Values

### Use Computed Properties for Derived State

Instead of manually recalculating values or storing derived data, use neutrix's built-in computed values system:

```typescript
// ❌ Avoid storing derived data
store.set('todoCount', store.get('todos').length)
store.set('activeTodoCount', store.get('todos').filter(t => !t.completed).length)

// ✅ Use computed values
const todoCount = store.computed('stats.todoCount', 
  state => state.todos.length
)

const activeTodoCount = store.computed('stats.activeTodoCount', 
  state => state.todos.filter(t => !t.completed).length
)
```

## Batch Operations

### Use Batch Updates for Multiple Changes

When you need to update multiple parts of your state at once, use the batch operation instead of multiple set calls:

```typescript
// ❌ Avoid multiple individual updates
store.set('user.lastLogin', new Date())
store.set('user.loginCount', count + 1)
store.set('ui.lastAction', 'login')

// ✅ Use batch updates
store.batch([
  ['user.lastLogin', new Date()],
  ['user.loginCount', count + 1],
  ['ui.lastAction', 'login']
])
```

Batch operations ensure:

* Atomic updates
* Single notification to subscribers
* Better performance

## State Persistence

### Be Selective About What You Persist

When using persistence, carefully choose what needs to be saved:

```typescript
// ❌ Avoid persisting everything
const store = createStore(initialState, {
  persist: true
})

// ✅ Be selective about persistence
const store = createStore(initialState, {
  persist: (state) => ({
    user: state.user,
    settings: state.settings
    // Temporary UI state is not persisted
  }),
  name: 'app-store'
})
```

Always validate persisted state to ensure data integrity:

```typescript
const store = createStore(initialState, {
  persist: true,
  validate: (state) => {
    if (!state.user || !state.settings) {
      return 'Invalid state structure'
    }
    return true
  }
})
```

## Error Handling

### Use Actions for Complex Operations

When dealing with async operations or complex state updates, use actions to handle errors properly:

```typescript
// ❌ Avoid raw async operations
const updateUser = async (userId, data) => {
  store.set(`users.${userId}.loading`, true)
  try {
    const result = await api.updateUser(userId, data)
    store.set(`users.${userId}`, result)
  } catch (e) {
    store.set(`users.${userId}.error`, e.message)
  }
}

// ✅ Use actions for better error handling
const updateUser = store.action(
  async (store, userId: string, data: UserData) => {
    store.set(`users.${userId}.loading`, true)
    try {
      const result = await api.updateUser(userId, data)
      store.set(`users.${userId}`, result)
      return result
    } catch (error) {
      store.set(`users.${userId}.error`, error.message)
      throw error
    } finally {
      store.set(`users.${userId}.loading`, false)
    }
  }
)
```

## Middleware Usage

### Use Middleware for Cross-Cutting Concerns

neutrix's middleware system is powerful but should be used carefully:

```typescript
// ❌ Avoid putting business logic in middleware
const businessMiddleware: Middleware = {
  onSet: (path, value) => {
    if (path === 'user.age') {
      return calculateAgeThings(value) // Business logic doesn't belong here
    }
    return value
  }
}

// ✅ Use middleware for cross-cutting concerns
const loggingMiddleware: Middleware = {
  onSet: (path, value, prevValue) => {
    console.log(`${path} changed:`, prevValue, '→', value)
    return value
  }
}

const validationMiddleware: Middleware = {
  onSet: (path, value) => {
    if (value === undefined) {
      throw new Error(`Cannot set ${path} to undefined`)
    }
    return value
  }
}
```

## Store Connections

### Use Store Connections for Complex State Synchronization

When dealing with multiple stores that need to stay in sync:

```typescript
// ❌ Avoid manual store synchronization
storeA.subscribe(() => {
  if (someCondition) {
    storeB.set('something', storeA.get('something'))
  }
})

// ✅ Use the connectStore utility
connectStore({
  source: storeA,
  target: storeB,
  when: (source) => someCondition,
  then: (target) => {
    target.set('something', source.get('something'))
  }
})
```