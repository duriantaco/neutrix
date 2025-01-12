# State Persistence

## Overview

Persistence in Spyn allows your store's state to survive page reloads and browser restarts. By enabling persistence, your application's state will automatically be saved to localStorage and restored when the application restarts. This is useful for maintaining user preferences, session data, or some work-in-progress content.

## Basic Usage

The simplest way to enable persistence is by passing the persist option when creating your store:

```typescript
const store = createStore({
  user: null,
  settings: {
    theme: 'light',
    notifications: true
  }
}, {
  persist: true,
  name: 'my-store'
})
```

In this example:

* The entire store state is automatically saved to `localStorage`
* State is restored when the store is recreated
* The name option determines the `localStorage` key
* Persistence is handled automatically on every state change

## Selective Persistence

Sometimes you only want to persist specific parts of your state. You can use a custom persistence function to control exactly what gets saved:

```typescript
const store = createStore({
  user: null,
  settings: {
    theme: 'light',
    notifications: true
  },
  temporaryData: {
    searchResults: [],
    currentPage: 1
  }
}, {
  persist: (state) => ({
    // persist both user and settings ONLY
    user: state.user,
    settings: state.settings
  }),
  name: 'my-store'
})
```

This approach allows you to:

* Choose which state to persist
* Transform data before storage
* Exclude temporary or sensitive data

This selective persistence approach is valuable when dealing with larger applications. Not all state needs to be (or should be) persisted. Search results, pagination states, or temporary UI states often don't need to survive a page reload. By selecting exactly what to persist, you can:

* Reduce storage space usage by only saving essential data
* Improve performance by minimizing serialization overhead
* Keep your persisted state clean and focus on what matters

## Migration Support 

One of the biggest challenges with persisted state is handling changes to your state structure over time. Spyn includes built-in migration support to help manage these transitions smoothly.

```typescript
const store = createStore({
  user: null,
  settings: {
    theme: 'light',
  }
}, {
  persist: true,
  name: 'my-app-store',
  migration: {
    version: 2,
    migrate: (oldState) => {
      return oldState; // Transform old state to new format
    }
  }
})
```

When you update your application and need to change how your state is structured, migrations prevent your users from losing their data. Spyn keeps track of the state version in storage and automatically runs your migration function when it detects an outdated state version.

For example, if you need to update your settings structure, the migration system ensures existing users don't lose their preferences while allowing you to update the data format.

## Validation

Persistence adds an extra layer of complexity because you're dealing with potentially invalid or outdated data from storage. The validation system helps ensure your restored state is valid and safe to use.

```typescript
const store = createStore(initialState, {
  persist: true,
  validate: (state) => {
    return true;
  }
})
```

The validation system works in two important scenarios:

1. When restoring persisted state from storage, validation runs before the state is used. If validation fails, your store falls back to the initial state, preventing crashes from corrupt or invalid stored data.

2. During migrations, validation ensures the migrated state is valid before it's used. This adds an extra layer of safety when updating your state structure.
