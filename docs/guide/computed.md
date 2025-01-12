# Computed Values

## Overview

Computed values are one of Spyn's core features. Think of computed values like Excel formulas - values are automatically recalculate when any of their input cells change. In Spyn, it works kind of the same way. When any piece of state that they depend on changes, they automatically update their results.

This is good for maintaining derived states that needs to stay in sync with your core data. Instead of manually updating calculated values every time related data changes, computed values handle this automatically. They let you create derived state that automatically updates when its dependencies change. 

## Basic Usage

A computed value is created by specifying two things: a unique path where the result will be stored, and a function that calculates the result based on your state. 

Here's a simple example:

```typescript
const store = createStore({
  todos: [
    { id: 1, text: 'Learn Spyn', completed: false },
    { id: 2, text: 'Write docs', completed: true }
  ]
})

const activeTodos = store.computed(
  'todos.active',
  state => state.todos.filter(todo => !todo.completed)
)
```

In this example, activeTodos will automatically maintain a list of uncompleted todos. Whenever the todos list changes, such as deleting or updating a todo, the active list will update automatically.

Using computed values in components is straightforward:

```typescript
// in components
function TodoList() {
  const active = useStore(store => activeTodos())
  return <div>Active todos: {active.length}</div>
}
```

## Dependency Tracking

One of the features of computed values is automatic dependency tracking. Unlike other state management solutions where you need to explicitly specify dependencies, Spyn tracks them automatically by monitoring which parts of the state your computation actually uses.

For example: 

```typescript
const userStatus = store.computed(
  'user.status',
  state => {
    // these paths are automatically tracked
    if (!state.user.isLoggedIn) return 'Offline'
    if (state.user.lastActive < Date.now() - 5000) return 'Away'
    return 'Online'
  }
)
```

In the above example, Spyn automatically detects that this computation depends on `user.isLoggedIn` and `user.lastActive`. When either of these values changes, the status will be recalculated. You don't need to maintain this list of dependencies manually. 

## Chaining Computed Values

Computed values become even more powerful when you combine them. You can use the results of one computed value in another, creating a chain of reactive computations. Each computed value in the chain will update automatically when its dependencies change.

Computed values can use other computed values:

```typescript
const activeUsers = store.computed(
  'users.active',
  state => state.users.filter(u => u.isActive)
)

const activeAdmins = store.computed(
  'users.activeAdmins',
  state => activeUsers().filter(u => u.role === 'admin')
)

const totalActiveAdmins = store.computed(
  'users.activeAdminCount',
  state => activeAdmins().length
)
```

This creates a reactive chain where:

1. `activeUsers` tracks all active users
2. `activeAdmins` filters the active users to just admins
3. `totalActiveAdmins` counts the active admins

If any user's active status or role changes, all relevant computations update automatically.

## React Integration

Use computed values in React components with hooks:

```typescript
function UserDashboard() {
    // single
  const activeCount = useStore(store => totalActiveAdmins())
  
  // multiple
  const [active, admins] = useStore(store => [
    activeUsers(),
    activeAdmins()
  ])

  return (
    <div>
      <h2>Active Users: {active.length}</h2>
      <h2>Active Admins: {admins.length}</h2>
    </div>
  )
}
```

## Performance

Computed values are:

* Cached until their dependencies change
* Only recalculated when accessed
* Managed by an LRU cache to prevent memory leaks