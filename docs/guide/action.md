# Actions

## Overview

Actions provide a way to handle complex state changes and async operations. While simple set operations may work for basic state updates, real world apps often need to coordinate multiple changes, handle API calls, or process data before updating state. Actions solve this by providing a structured way to handle these complex operations.

## Why Use Actions?
Actions are a fundamental part of neutrix that help you manage complex state changes in a clean and maintainable way. They provide several key benefits:

1. Cleaner - Actions make your code more organized and easier to maintain

2. Error Handling - Built-in error handling helps you manage failures gracefully

3. Async Support - Support for async operations like API calls

4. Type Safety - Full TypeScript support ensures your state updates are type-safe

## Basic Usage
Actions combine state updates with business logic, making them perfect for handling real-world scenarios like API calls or multi-step processes.

Here's a straightforward example:

```
const store = createStore({
  users: [],
  loading: false,
  error: null
})

const fetchUsers = store.action(
  async (store) => {
    store.set('loading', true)
    try {
      const response = await fetch('/api/users')
      const users = await response.json()
      store.set('users', users)
      store.set('error', null)
    } catch (err) {
      store.set('error', err.message)
    } finally {
      store.set('loading', false)
    }
  }
)
```

In this example, the action manages several aspects of data fetching:

* Sets a loading state before the request starts
* Makes the API call and updates the users list
* Handles any errors that might occur
* Always ensures the loading state is cleaned up

Using it in a component is straightforward with the useAction hook:

```
function UserList() {
  const { execute: loadUsers, loading, error } = useAction(fetchUsers)
  
  useEffect(() => {
    loadUsers()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <UserTable />
}
```

## Parameterized Actions

Actions become more powerful when they accept parameters. This lets you create reusable actions that can work with different data or conditions.

Here's an action for updating user data:

```
const updateUser = store.action(
  async (store, userId: string, userData: Partial<User>) => {
    store.set(`users.${userId}.updating`, true)
    
    try {
      const response = await api.updateUser(userId, userData)
      store.batch([
        [`users.${userId}`, response.data],
        [`users.${userId}.updating`, false]
      ])
      return response.data
    } catch (err) {
      store.set(`users.${userId}.error`, err.message)
      throw err
    }
  }
)
```

This action shows several advanced patterns:

* Takes multiple parameters (`userId` and `userData`)
* Uses path templates for dynamic state updates
* Returns the API response for further processing
* Uses batch updates for atomic state changes

## Complex State Management

Actions truly shine when managing complex state changes that involve multiple steps and different parts of your application state.

```
const checkoutCart = store.action(
  async (store) => {
    const cart = store.get('cart')
    const user = store.get('user')

    store.batch([
      ['checkout.processing', true],
      ['checkout.error', null]
    ])

    try {
      // Process payment
      const paymentResult = await processPayment(cart.total)
      
      // Create order
      const order = await createOrder({
        items: cart.items,
        userId: user.id,
        paymentId: paymentResult.id
      })

      // Update inventory
      await updateInventory(cart.items)

      // Clear cart and update order history
      store.batch([
        ['cart.items', []],
        ['cart.total', 0],
        ['orders', [...store.get('orders'), order]],
        ['checkout.processing', false],
        ['checkout.lastOrder', order.id]
      ])

      return order
    } catch (err) {
      store.batch([
        ['checkout.processing', false],
        ['checkout.error', err.message]
      ])
      throw err
    }
  }
)
```
