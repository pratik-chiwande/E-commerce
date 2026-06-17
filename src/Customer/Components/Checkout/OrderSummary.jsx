'use client'

import { useCart } from '../../../Context/CartContext'

function parsePrice(str) {
  return parseInt((str || '').replace(/[₹,\s]/g, ''), 10) || 0
}

export default function OrderSummary({ couponDiscount = 0 }) {
  const { cartItems } = useCart()

  const subtotal  = cartItems.reduce((s, i) => s + parsePrice(i.price) * i.quantity, 0)
  const mrpTotal  = cartItems.reduce((s, i) => s + parsePrice(i.oldPrice || i.price) * i.quantity, 0)
  const discount  = mrpTotal - subtotal
  const delivery  = subtotal > 499 ? 0 : 49
  const total     = subtotal - couponDiscount + delivery

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>

      {/* Item list */}
      <div className="space-y-4 mb-5">
        {cartItems.map((item, i) => (
          <div key={`${item.id}-${item.size}-${item.color}-${i}`} className="flex gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">
                Size: {item.size} · Qty: {item.quantity}
                {item.color ? ` · ${item.color}` : ''}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900">{item.price}</p>
              {item.oldPrice && (
                <p className="text-xs text-gray-400 line-through">{item.oldPrice}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-gray-200 pt-4 space-y-2.5 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>MRP Total</span>
          <span>₹{mrpTotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Product Discount</span>
            <span>− ₹{discount.toLocaleString()}</span>
          </div>
        )}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>− ₹{couponDiscount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery Charges</span>
          <span className={delivery === 0 ? 'text-green-600 font-medium' : ''}>
            {delivery === 0 ? 'FREE' : `₹${delivery}`}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-gray-900 text-base">
          <span>Total Payable</span>
          <span>₹{total.toLocaleString()}</span>
        </div>
      </div>

      {(discount + couponDiscount) > 0 && (
        <p className="mt-4 text-xs font-medium text-green-700 bg-green-50 rounded-xl px-3 py-2">
          🎉 You save ₹{(discount + couponDiscount).toLocaleString()} on this order!
        </p>
      )}
    </div>
  )
}
