// CartDrawer.tsx
import { useStore } from 'spyn'
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