# Store Connections

## Overview

Store connections in Spyn provide a way to sync multiple stores together. This is useful when you need to coordinate state changes between different parts of your application, or when you want to keep multiple stores in sync with specific rules.

## Basic Usage

Store connections are defined by specifying a source store, a target store, a condition when changes should occur, and what changes to make.

```typescript
const userStore = createStore({
  isLoggedIn: false,
  user: null
})

const uiStore = createStore({
  theme: 'light',
  sidebarOpen: true
})

// Connect both the ui and user stores
connectStore({
  source: userStore,
  target: uiStore,
  when: (source) => !source.get('isLoggedIn'),
  then: (target) => {
    target.set('sidebarOpen', false)
  }
})
```

In this example:

* When a user logs out (`isLoggedIn` becomes false)
* The sidebar is automatically closed
* This creates a predictable UI behavior tied to authentication state

## Multiple Connections

For more complex scenarios, you can connect multiple stores with different rules using connectStores:

```typescript
const cartStore = createStore({
  items: [],
  total: 0
})

const notificationStore = createStore({
  messages: []
})

connectStores([
  {
    source: cartStore,
    target: notificationStore,
    when: (source) => source.get('items').length > 0,
    then: (target) => {
      target.set('messages', [
        ...target.get('messages'),
        { type: 'info', text: 'Items in cart' }
      ])
    }
  },
  {
    source: cartStore,
    target: uiStore,
    when: (source) => source.get('total') > 100,
    then: (target) => {
      target.set('showDiscountBanner', true)
    }
  }
])
```

## Immediate Execution

Sometimes you want connection rules to execute immediately upon setup. Use the immediate flag for this:

```typescript
connectStore({
  source: settingsStore,
  target: uiStore,
  when: (source) => source.get('darkMode'),
  then: (target) => {
    target.set('theme', 'dark')
  },
  immediate: true 
})
```