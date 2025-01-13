# Building an E-commerce App with neutrix

## Introduction

In this tutorial, we'll build a complete e-commerce application using neutrix for state management. You'll learn how to:

* Set up a neutrix store with TypeScript
* Manage shopping cart state
* Create computed values for calculations
* Persist user's cart data
* Build reusable React components

## CodeSandBox

You can see the result in this [CodeSandbox demo](https://codesandbox.io/p/sandbox/cartapp-mvgx9g). Note that your environment may differ slightly from the tutorial below.

## Prerequisites

* Basic knowledge of React and TypeScript
* Node.js installed on your machine
* An IDE

## Project Setup

We do have a full working example inside /examples so you can clone it into your repo and try it for yourself. Alternatively if you want to follow along, you can proceed on below. 

```
npm create vite@latest shop-app -- --template react-ts
cd shop-app
npm install neutrix react-router-dom
```

## Core components

Core Components:

* App.tsx: Main application component
* Header.tsx: Navigation header with cart total
* CartDrawer.tsx: Sliding cart panel
* ShopContent.tsx: Main product listing
* WishList.tsx: Wishlist feature
* storeExample.ts: State management

## Tutorial

### Setting up the store

1. First, we define the structure of our data. Every product in our store has three basic properties: an ID, a name, and price. The store holds three main pieces of information. It keeps track of all our products, manages our shopping cart, and handles some UI states like whether the cart drawer is visible. neutrix needs these TypeScript interfaces to properly type our store data.

```
export interface Product {
  id: number
  name: string
  price: number
}

export interface ShopState extends State {
  products: Product[]
  cart: { [id: number]: number } 
  ui: {
    isCartOpen: boolean
  }
}
```

2. When we create the store with persist: true, neutrix automatically handles saving our cart data to localStorage - so if someone refreshes their browser, they won't lose their cart items.

```
// Sample products data
const sampleProducts: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 149.99 },
  { id: 2, name: "Gaming Mouse", price: 59.99 },
  { id: 3, name: "Monitor", price: 299.99 }
]

// Initial state
const initialState: ShopState = {
  products: sampleProducts,
  cart: {},  // Empty cart to start
  ui: {
    isCartOpen: false
  }
}

export const store = createStore<ShopState>(initialState, {
  persist: true,   < --- save to localstorage
  name: 'shop-store'
})
```

3. For the cart portion, instead of keeping an array of items, we use an object where each key is a product ID and each value is the quantity. This makes it super easy to update quantities without having to search through arrays. When we want to modify the cart, we use neutrix's `store.get()` to grab the current cart state and `store.set()` to update it. neutrix will automatically notify any components using this cart data that they need to update.

```
export const addToCart = (productId: number) => {
  const cart = store.get('cart')
  const currentQuantity = cart[productId] || 0
  store.set('cart', {
    ...cart,
    [productId]: currentQuantity + 1
  })
}

export const removeFromCart = (productId: number) => {
  const cart = store.get('cart')
  const currentQuantity = cart[productId] || 0
  if (currentQuantity > 0) {
    store.set('cart', {
      ...cart,
      [productId]: currentQuantity - 1
    })
  }
}
```

4. Finally, we use neutrix's `computed` feature to create a value that automatically recalculates when the cart changes. Any component using this cartTotal will automatically re-render when needed. It tracks dependencies and updates only when necessary.

```
export const cartTotal = store.computed('cartTotal', (state: ShopState) => {
  return Object.entries(state.cart).reduce((total, [productId, quantity]) => {
    const product = state.products.find(p => p.id === Number(productId))
    if (product) {
      return total + (product.price * quantity)
    }
    return total
  }, 0)
})
```

Full example below: 

```
// storeExample.ts
import { createStore } from 'neutrix'
import type { State } from 'neutrix'

// Define our Product type
export interface Product {
  id: number
  name: string
  price: number
}

// Define our entire store state structure
export interface ShopState extends State {
  products: Product[]
  cart: { [id: number]: number }  // productId: quantity
  ui: {
    isCartOpen: boolean
  }
}

// Sample products data
const sampleProducts: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 149.99 },
  { id: 2, name: "Gaming Mouse", price: 59.99 },
  { id: 3, name: "Monitor", price: 299.99 }
]

// Initial state
const initialState: ShopState = {
  products: sampleProducts,
  cart: {},  // Empty cart to start
  ui: {
    isCartOpen: false
  }
}

// Create and export our store
export const store = createStore<ShopState>(initialState, {
  persist: true,  // Save to localStorage
  name: 'shop-store'
})

// Cart Operations
export const addToCart = (productId: number) => {
  const cart = store.get('cart')
  const currentQuantity = cart[productId] || 0
  store.set('cart', {
    ...cart,
    [productId]: currentQuantity + 1
  })
}

export const removeFromCart = (productId: number) => {
  const cart = store.get('cart')
  const currentQuantity = cart[productId] || 0
  if (currentQuantity > 0) {
    store.set('cart', {
      ...cart,
      [productId]: currentQuantity - 1
    })
  }
}

// UI Operations
export const toggleCart = () => {
  const isOpen = store.get('ui.isCartOpen')
  store.set('ui.isCartOpen', !isOpen)
}

// Computed Values
export const cartTotal = store.computed('cartTotal', (state: ShopState) => {
  return Object.entries(state.cart).reduce((total, [productId, quantity]) => {
    const product = state.products.find(p => p.id === Number(productId))
    if (product) {
      return total + (product.price * quantity)
    }
    return total
  }, 0)
})
```

### Setting up the Header

This part is the most straightforward. We'll use neutrix's `useStore` hook to subscribe to our cartTotal computed value. When the cart changes, neutrix will automatically update our total value. 

```
import { useStore } from 'neutrix'
import { cartTotal, toggleCart } from './storeExample'
import type { ShopState } from './storeExample'

export function Header() {
  const total = useStore<ShopState, number>(() => cartTotal())
  
  return (
    <div style={{
      padding: '1rem',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <h1>Shop</h1>
      <div>
        <span>Total: ${total.toFixed(2)} </span>
        <button onClick={toggleCart}>🛒</button>
      </div>
    </div>
  )
}
```

### Cart drawer

1. Component Setup and Store Connection

First, we hook up our component to all the store data it needs. neutrix will automatically re-render the component when values change.

```
export function CartDrawer() {
  const isOpen = useStore<ShopState, boolean>(store => store.get('ui.isCartOpen'))
  const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))
  const products = useStore<ShopState, Product[]>(store => store.get('products'))
  const total = useStore<ShopState, number>(() => cartTotal())

  if (!isOpen) return null;
```

Full code below:

```
// CartDrawer.tsx
import { useStore } from 'neutrix'
import { cartTotal, toggleCart, removeFromCart } from './storeExample'
import type { ShopState, Product } from './storeExample'

export function CartDrawer() {
  const isOpen = useStore<ShopState, boolean>(store => store.get('ui.isCartOpen'))
  const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))
  const products = useStore<ShopState, Product[]>(store => store.get('products'))
  const total = useStore<ShopState, number>(() => cartTotal())

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: 0,
      bottom: 0,
      width: '300px',
      backgroundColor: 'white',
      boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
      padding: '1rem',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Cart</h2>
        <button onClick={toggleCart}>✕</button>
      </div>
      
      {Object.entries(cart).map(([productId, quantity]) => {
        const product = products.find(p => p.id === Number(productId))
        if (!product || quantity === 0) return null
        
        return (
          <div key={productId} style={{ marginTop: '1rem' }}>
            <div>{product.name}</div>
            <div>Quantity: {quantity}</div>
            <div>${(product.price * quantity).toFixed(2)}</div>
            <button onClick={() => removeFromCart(Number(productId))}>Remove</button>
          </div>
        )
      })}
      
      <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <strong>Total: ${total.toFixed(2)}</strong>
      </div>
    </div>
  )
}
```

### Shop Content

1. The ShopContent component needs access to products and cart data. Again, we use neutrix's useStore to connect to our store:

```
const products = useStore<ShopState, Product[]>(store => store.get('products'))

<div className="products">
  <h2>Products</h2>
  {products.map(product => (
    <div key={product.id} className="product">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addToCart(product.id)}>Add to Cart</button>
    </div>
  ))}
</div>
```

The `useStore` hook gets the products list. When addToCart is called, it updates the neutrix store and components using cart data will automatically update

2. Multiple `useStore` hooks track cart items and total. The Cart display updates instantly when items are added or removed. Computed total recalculates automatically and will only shows products with quantities that are greater than 0.

```
const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))
const total = useStore<ShopState, number>(() => cartTotal())

<div className="cart">
  <h2>Cart</h2>
  {products.map(product => {
    const quantity = cart[product.id] || 0
    if (quantity === 0) return null
    
    return (
      <div key={product.id} className="cart-item">
        <h3>{product.name}</h3>
        <p>Quantity: {quantity}</p>
        <button onClick={() => removeFromCart(product.id)}>Remove</button>
      </div>
    )
  })}
  <div className="total">
    <h3>Total: ${total.toFixed(2)}</h3>
  </div>
</div>
```

Full code below:

```
import { useStore } from 'neutrix'
import { addToCart, removeFromCart, cartTotal } from './storeExample'
import type { ShopState, Product } from './storeExample'

export function ShopContent() {
  const products = useStore<ShopState, Product[]>(store => store.get('products'))
  const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))
  const total = useStore<ShopState, number>(() => cartTotal())

  return (
    <>
      <div className="products">
        <h2>Products</h2>
        {products.map(product => (
          <div key={product.id} className="product">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product.id)}>Add to Cart</button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>Cart</h2>
        {products.map(product => {
          const quantity = cart[product.id] || 0
          if (quantity === 0) return null
          
          return (
            <div key={product.id} className="cart-item">
              <h3>{product.name}</h3>
              <p>Quantity: {quantity}</p>
              <button onClick={() => removeFromCart(product.id)}>Remove</button>
            </div>
          )
        })}
        <div className="total">
          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
      </div>
    </>
  )
}
```

## Wish list

1. The WishList component shows what items are currently in the cart. We use neutrix's `useStore` to track cart and product data:

```
const products = useStore<ShopState, Product[]>(store => store.get('products'))
const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))

<div>
  <h2>Wishlist</h2>
  <div>
    <p>Items in your cart while browsing wishlist:</p>
  </div>
</div>
```

Full code below:

```
import { useStore } from 'neutrix'
import type { ShopState, Product } from './storeExample'

export function Wishlist() {
  const products = useStore<ShopState, Product[]>(store => store.get('products'))
  const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))

  return (
    <div>
      <h2>Wishlist</h2>
      <div>
        <p>Items in your cart while browsing wishlist:</p>
        {products.map(product => {
          const quantity = cart[product.id] || 0
          if (quantity === 0) return null;
          return (
            <div key={product.id}>
              {product.name} - Quantity: {quantity}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

### App

1. Tying it up, we have to set up the main application structure with routing. The App component serves as the container for our entire application, using React Router for navigation:

This is full code below:

```
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Header } from './Header'
import { CartDrawer } from './CartDrawer'
import { ShopContent } from './ShopContent'
import { Wishlist } from './WishList'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <CartDrawer />
        
        <nav style={{ 
          padding: '1rem', 
          borderBottom: '1px solid #eee' 
        }}>
          <Link to="/" style={{ 
            marginRight: '1rem',
            textDecoration: 'none',
            color: '#333'
          }}>
            Shop
          </Link>
          <Link to="/wishlist" style={{
            textDecoration: 'none',
            color: '#333'
          }}>
            Wishlist
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<ShopContent />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
```

## Summary

In summary, we have demonstrated the key features and advantages of using neutrix as a state management solution:

### Simple API

neutrix offers a straightforward API with just `get` and `set` methods, as seen in cart operations:

```
 const addToCart = (productId: number) => {
  const cart = store.get('cart')    // get current state
  store.set('cart', {...})          // update state
}
```

### Automatic Component Updates

Using `useStore` hook subscribes components to state changes:

```
const cart = useStore<ShopState, Record<number, number>>(store => store.get('cart'))

Any component using this hook auto-updates when cart changes
```

No need for manual re-renders or complex subscription management


### Computed Values

Automatically calculate derived values:

```
const cartTotal = store.computed('cartTotal', (state: ShopState) => {
  return Object.entries(state.cart).reduce(...)
})
```

### Built-in Persistence

Just add `persist: true` and neutrix handles saving to localStorage:

```
const store = createStore<ShopState>(initialState, {
  persist: true, // < --- here
  name: 'shop-store'
})
```

### State Access Anywhere

Any component can access store data without prop drilling. The cart total is accessible in Header, CartDrawer, and ShopContent without passing props

This e-commerce app effectively shows how neutrix makes state management simpler compared to solutions like Redux, which would require more boilerplate code for the same functionality.


