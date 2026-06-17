'use client'
import { useNavigate } from "react-router-dom";
import { useState } from 'react'
import { ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../../Context/CartContext'
import CartItem from './CartItem'

function parsePrice(str) {
  return parseInt(str.replace(/[₹,\s]/g, ''), 10) || 0
}

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart()

  const [coupon, setCoupon]             = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  // Adapt removeFromCart signature: Cart page only knows id (no size/color from CartItem)
  // CartItem calls onRemove(item.id) — we remove by id only (first match) or pass full item
  const handleRemove = (id) => {
    // Find the item to get size + color so CartContext can match correctly
    const item = cartItems.find(i => i.id === id)
    if (item) removeFromCart(item.id, item.size, item.color)
  }

  const handleQtyChange = (id, qty) => {
    if (qty < 1) return
    const item = cartItems.find(i => i.id === id)
    if (item) updateQuantity(item.id, item.size, item.color, qty)
  }

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SAVE10') setCouponApplied(true)
    else alert('Invalid coupon code')
  }

  const subtotal  = cartItems.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0)
  const mrpTotal  = cartItems.reduce((s, i) => s + parsePrice(i.oldPrice || i.price) * i.quantity, 0)
  const discount  = mrpTotal - subtotal
  const couponOff = couponApplied ? Math.round(subtotal * 0.1) : 0
  const delivery  = subtotal > 499 ? 0 : 49
  const total     = subtotal - couponOff + delivery

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-400">
        <ShoppingBagIcon className="h-16 w-16" />
        <p className="text-xl font-semibold">Your cart is empty</p>
        <a href="/" className="text-indigo-600 text-sm underline underline-offset-2">Continue Shopping</a>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          Shopping Cart <span className="text-gray-400 font-normal text-base">({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <CartItem
                key={`${item.id}-${item.size}-${item.color}-${i}`}
                item={item}
                onRemove={handleRemove}
                onQtyChange={handleQtyChange}
              />
            ))}
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Price Details</h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Price ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})</span>
                <span>₹{mrpTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>− ₹{discount.toLocaleString()}</span>
                </div>
              )}
              {couponApplied && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon (SAVE10)</span>
                  <span>− ₹{couponOff.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
                  {delivery === 0 ? 'FREE' : `₹${delivery}`}
                </span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            {(discount + couponOff) > 0 && (
              <p className="mt-3 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2 font-medium">
                🎉 You save ₹{(discount + couponOff).toLocaleString()} on this order!
              </p>
            )}

            {/* Coupon */}
            {!couponApplied ? (
              <div className="mt-5 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  Apply
                </button>
              </div>
            ) : (
              <p className="mt-4 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                ✓ Coupon SAVE10 applied
              </p>
            )}

            <button
              onClick={() => navigate("/checkout")}
              className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition text-sm"
            >
              Proceed to Checkout →
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Try: <span className="font-mono text-indigo-500">SAVE10</span> for 10% off
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
