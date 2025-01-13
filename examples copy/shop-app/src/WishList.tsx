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