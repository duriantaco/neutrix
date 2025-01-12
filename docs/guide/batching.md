# Batch Updates

## Overview

Batch updates in neutrix allow you to perform multiple state changes in a single operation. This is crucial for performance and state consistency when you need to update several pieces of state at once. Instead of triggering multiple separate updates (and potentially multiple re-renders), batching combines them into a single atomic operation.

# Basic Usage

Batch updates are performed using the store's batch method, which accepts an array of updates where each update is a tuple of `[path, value]`.

```typescript
const store = createStore({
  user: {
    name: 'John',
    preferences: {
      theme: 'light',
      notifications: true
    }
  },
  stats: {
    lastLogin: null,
    visitCount: 0
  }
})

// Update multiple values atomically
store.batch([
  ['user.preferences.theme', 'dark'],
  ['stats.lastLogin', new Date().toISOString()],
  ['stats.visitCount', 1]
])
```

When you use batch updates like this, all changes are applied together. Your components will only re-render once after all updates are complete, rather than updating for each individual change. This is particularly valuable when you need to maintain consistency between related pieces of state.

## State Validation

neutrix ensures that your batch updates maintain state validity just like individual updates. If any update in the batch would result in an invalid state, the entire batch is rejected.

## Handling Dependencies
When using batch updates with computed values or subscriptions, neutrix manages the dependency tracking efficiently. Affected computed values are only recalculated once after the entire batch completes.

```typescript
store.batch([
  ['user.profile.name', 'Jane'],
  ['user.profile.email', 'jane@example.com'],
  ['user.lastUpdated', new Date().toISOString()]
])
```
This batch operation will:

1. Apply all updates to the state tree
2. Notify subscribers once all updates are complete
3. Update any affected computed values a single time
4. Trigger a single re-render for affected components