import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './Context/ThemeContext'   // ← add
import { AuthProvider }  from './Context/AuthContext'    // ← add
import { CartProvider }  from './Context/CartContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>        {/* ← wrap here */}
        <AuthProvider>       {/* ← wrap here */}
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)