'use client'

import { createContext, useState, useContext } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id && i.size === product.size && i.color === product.color)
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.size === product.size && i.color === product.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id, size, color) => {
    setCartItems(prev => prev.filter(i => !(i.id === id && i.size === size && i.color === color)))
  }

  const updateQuantity = (id, size, color, quantity) => {
    if (quantity < 1) return
    setCartItems(prev =>
      prev.map(i =>
        i.id === id && i.size === size && i.color === color ? { ...i, quantity } : i
      )
    )
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0)
  const totalPrice = cartItems.reduce((s, i) => {
    const price = parseInt(i.price.replace(/[₹,]/g, '')) || 0
    return s + price * i.quantity
  }, 0)

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

// convenience hook
export function useCart() {
  return useContext(CartContext)
}