# Middleware

## Overview

Middleware provides a way to intercept and modify store operations. It sits between the store's core functionality and your application code. This allows you to add custom behavior to state changes and reads. Middlewares can be thought of as plugins that can customize how your store behaves without changing its core functionality.

## Basic Usage

Middleware can intercept both reading and writing operations in your store, making it great for logging, validation, or data transformation.

```typescript
const store = createStore({
  count: 0,
  user: {
    name: '',
    isLoggedIn: false
  }
})

const loggerMiddleware: Middleware = {
  onSet: (path: string, value: any, prevValue: any) => {
    console.log(`Setting ${path}:`, prevValue, '→', value)
    return value
  },
  onGet: (path: string, value: any) => {
    console.log(`Getting ${path}:`, value)
    return value
  }
}
// add middleware to store
store.use(loggerMiddleware)
```

In this example, the middleware:

* Shows the path being accessed
* For sets, shows both old and new values
* Returns the value to allow the operation to proceed

## Value Transformation

Middleware can transform values as they're being set or retrieved from the store. This is useful for data formatting, validation, or applying business rules.

```typescript
const validationMiddleware: Middleware = {
  onSet: (path: string, value: any, prevValue: any) => {
    if (path.startsWith('user.age') && (value < 0 || value > 120)) {
      throw new Error('Invalid age value')
    }
    
    if (path.startsWith('user.name')) {
      return value.trim()
    }

    return value
  }
}

store.use(validationMiddleware)
```

## Middleware Cleanup

Middleware can be removed when no longer needed using the cleanup function returned by use

```typescript
const devMiddleware: Middleware = {
  onGet: (path: string, value: any) => {
    return value
  }
}

// Add middleware and store cleanup function
const cleanup = store.use(devMiddleware)

cleanup()
```