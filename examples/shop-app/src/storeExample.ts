// storeExample.ts
import { createStore } from 'spyn'
import type { State } from 'spyn'

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

const sampleProducts: Product[] = [
  { id: 1, name: "Mechanical Keyboard", price: 149.99 },
  { id: 2, name: "Gaming Mouse", price: 59.99 },
  { id: 3, name: "Monitor", price: 299.99 }
]

const initialState: ShopState = {
  products: sampleProducts,
  cart: {},
  ui: {
    isCartOpen: false
  }
}

export const store = createStore<ShopState>(initialState, {
  persist: true,
  name: 'shop-store'
})

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

export const toggleCart = () => {
  const isOpen = store.get('ui.isCartOpen')
  store.set('ui.isCartOpen', !isOpen)
}

export const cartTotal = store.computed('cartTotal', (state: ShopState) => {
  return Object.entries(state.cart).reduce((total, [productId, quantity]) => {
    const product = state.products.find(p => p.id === Number(productId))
    if (product) {
      return total + (product.price * quantity)
    }
    return total
  }, 0)
})