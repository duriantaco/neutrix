// Header.tsx
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