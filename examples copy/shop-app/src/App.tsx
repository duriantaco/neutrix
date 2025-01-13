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