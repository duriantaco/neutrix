import { useStore } from 'spyn'
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