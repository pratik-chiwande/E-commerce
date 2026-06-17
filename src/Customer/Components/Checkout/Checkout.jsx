'use client'

import { useState } from 'react'
import { CheckIcon } from '@heroicons/react/24/solid'
import DeliveryAddress from './DeliveryAddress'
import OrderSummary from './OrderSummary'

const STEPS = ['Delivery Address', 'Order Summary', 'Payment']

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const paymentMethods = [
  { id: 'upi',  label: 'UPI',          sub: 'Pay via GPay, PhonePe, Paytm' },
  { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Rupay' },
  { id: 'cod',  label: 'Cash on Delivery',    sub: 'Pay when your order arrives' },
  { id: 'nb',   label: 'Net Banking',         sub: 'All major banks supported' },
]

export default function Checkout() {
  const [step, setStep]               = useState(0)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod]     = useState('')
  const [upiId, setUpiId]             = useState('')
  const [placed, setPlaced]           = useState(false)

  const goNext = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const goBack = () => setStep(s => Math.max(s - 1, 0))

  const placeOrder = () => {
    if (!paymentMethod) return alert('Please select a payment method')
    setPlaced(true)
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckIcon className="h-9 w-9 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Placed! 🎉</h1>
          <p className="text-gray-500 text-sm">
            Your order has been confirmed. You'll receive a confirmation SMS and email shortly.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 text-left space-y-1 text-sm text-gray-600">
            <p><span className="font-semibold">Order ID:</span> #ORD{Date.now().toString().slice(-6)}</p>
            <p><span className="font-semibold">Payment:</span> {paymentMethods.find(p => p.id === paymentMethod)?.label}</p>
            <p><span className="font-semibold">Estimated Delivery:</span> 3–5 business days</p>
          </div>
          <a href="/" className="inline-block mt-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition">
            Continue Shopping
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Stepper */}
        <nav className="mb-10">
          <ol className="flex items-center">
            {STEPS.map((label, idx) => (
              <li key={label} className={classNames('flex items-center', idx < STEPS.length - 1 ? 'flex-1' : '')}>
                <div className="flex items-center gap-2">
                  <div className={classNames(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition',
                    idx < step  ? 'bg-indigo-600 text-white'
                    : idx === step ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                    : 'bg-gray-200 text-gray-500'
                  )}>
                    {idx < step ? <CheckIcon className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span className={classNames(
                    'text-sm font-medium hidden sm:block',
                    idx <= step ? 'text-indigo-600' : 'text-gray-400'
                  )}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={classNames(
                    'flex-1 h-0.5 mx-3 transition',
                    idx < step ? 'bg-indigo-600' : 'bg-gray-200'
                  )} />
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Step content */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

            {/* Step 0 — Delivery Address */}
            {step === 0 && (
              <DeliveryAddress onSelect={setSelectedAddress} />
            )}

            {/* Step 1 — Order Summary */}
            {step === 1 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Review Your Order</h2>
                {selectedAddress && (
                  <div className="mb-5 bg-indigo-50 rounded-xl px-4 py-3 text-sm text-gray-700 border border-indigo-100">
                    <p className="font-semibold text-indigo-700 mb-1">Delivering to:</p>
                    <p>{selectedAddress.name} · {selectedAddress.phone}</p>
                    <p>{selectedAddress.line1}{selectedAddress.line2 ? `, ${selectedAddress.line2}` : ''}, {selectedAddress.city}, {selectedAddress.state} – {selectedAddress.pincode}</p>
                  </div>
                )}
                <OrderSummary />
              </div>
            )}

            {/* Step 2 — Payment */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map(pm => (
                    <div
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={classNames(
                        'cursor-pointer rounded-xl border-2 px-4 py-3 flex items-center gap-3 transition',
                        paymentMethod === pm.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className={classNames(
                        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                        paymentMethod === pm.id ? 'border-indigo-600' : 'border-gray-400'
                      )}>
                        {paymentMethod === pm.id && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{pm.label}</p>
                        <p className="text-xs text-gray-400">{pm.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">Expiry</label>
                        <input type="text" placeholder="MM / YY"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-600 block mb-1">CVV</label>
                        <input type="password" placeholder="•••" maxLength={4}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 block mb-1">Name on Card</label>
                      <input type="text" placeholder="Rahul Sharma"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-8 pt-5 border-t border-gray-100">
              {step > 0 ? (
                <button onClick={goBack} className="px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
              ) : <div />}

              {step < STEPS.length - 1 ? (
                <button onClick={goNext} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
                  Continue →
                </button>
              ) : (
                <button onClick={placeOrder} className="px-6 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition">
                  Place Order ✓
                </button>
              )}
            </div>
          </div>

          {/* Sticky summary */}
          <div className="hidden lg:block">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
