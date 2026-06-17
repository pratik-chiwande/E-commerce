'use client'

import { useState } from 'react'
import { PlusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const savedAddresses = [
  {
    id: 1,
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: '12, Andheri West',
    line2: 'Near Infinity Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    type: 'Home',
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    phone: '9876543210',
    line1: '4th Floor, Tech Park',
    line2: 'Whitefield',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    type: 'Work',
  },
]

const emptyForm = { name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', type: 'Home' }

// ✅ Defined OUTSIDE the component — never recreated on re-render
function Field({ label, name, placeholder, type = 'text', value, error, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
          error ? 'border-red-400' : 'border-gray-300'
        }`}
      />
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

export default function DeliveryAddress({ onSelect }) {
  const [addresses, setAddresses]   = useState(savedAddresses)
  const [selectedId, setSelectedId] = useState(savedAddresses[0].id)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(emptyForm)
  const [errors, setErrors]         = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim())             e.name    = 'Name is required'
    if (!/^\d{10}$/.test(form.phone))  e.phone   = 'Enter valid 10-digit number'
    if (!form.line1.trim())            e.line1   = 'Address is required'
    if (!form.city.trim())             e.city    = 'City is required'
    if (!form.state.trim())            e.state   = 'State is required'
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = 'Enter valid 6-digit pincode'
    return e
  }

  const handleAdd = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const newAddr = { ...form, id: Date.now() }
    setAddresses(prev => [...prev, newAddr])
    setSelectedId(newAddr.id)
    setShowForm(false)
    setForm(emptyForm)
    setErrors({})
  }

  // ✅ Generic field change handler
  const handleFieldChange = (name, value) => {
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Address</h2>

      {/* Saved addresses */}
      <div className="space-y-3">
        {addresses.map(addr => (
          <div
            key={addr.id}
            onClick={() => { setSelectedId(addr.id); onSelect?.(addr) }}
            className={`cursor-pointer rounded-2xl border-2 p-4 transition ${
              selectedId === addr.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex gap-3">
                <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedId === addr.id ? 'border-indigo-600' : 'border-gray-400'
                }`}>
                  {selectedId === addr.id && <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-800">{addr.name}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-medium">{addr.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                  </p>
                  <p className="text-sm text-gray-600">{addr.city}, {addr.state} – {addr.pincode}</p>
                  <p className="text-xs text-gray-400 mt-0.5">📞 {addr.phone}</p>
                </div>
              </div>
              {selectedId === addr.id && <CheckCircleIcon className="h-5 w-5 text-indigo-600 shrink-0" />}
            </div>
          </div>
        ))}
      </div>

      {/* Add new address toggle */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 flex items-center gap-2 text-indigo-600 text-sm font-semibold hover:underline"
        >
          <PlusIcon className="h-4 w-4" /> Add New Address
        </button>
      ) : (
        <div className="mt-5 bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
          <h3 className="font-semibold text-gray-800">New Address</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Full Name" name="name" placeholder="Rahul Sharma"
              value={form.name} error={errors.name}
              onChange={e => handleFieldChange('name', e.target.value)}
            />
            <Field
              label="Phone" name="phone" placeholder="10-digit number" type="tel"
              value={form.phone} error={errors.phone}
              onChange={e => handleFieldChange('phone', e.target.value)}
            />
            <Field
              label="Address Line 1" name="line1" placeholder="House / Flat / Street"
              value={form.line1} error={errors.line1}
              onChange={e => handleFieldChange('line1', e.target.value)}
            />
            <Field
              label="Address Line 2" name="line2" placeholder="Area / Landmark (optional)"
              value={form.line2} error={errors.line2}
              onChange={e => handleFieldChange('line2', e.target.value)}
            />
            <Field
              label="City" name="city" placeholder="Mumbai"
              value={form.city} error={errors.city}
              onChange={e => handleFieldChange('city', e.target.value)}
            />
            <Field
              label="State" name="state" placeholder="Maharashtra"
              value={form.state} error={errors.state}
              onChange={e => handleFieldChange('state', e.target.value)}
            />
            <Field
              label="Pincode" name="pincode" placeholder="6-digit pincode"
              value={form.pincode} error={errors.pincode}
              onChange={e => handleFieldChange('pincode', e.target.value)}
            />

            {/* Address type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Address Type</label>
              <div className="flex gap-3">
                {['Home', 'Work', 'Other'].map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleFieldChange('type', t)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                      form.type === t
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAdd}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
            >
              Save Address
            </button>
            <button
              onClick={() => { setShowForm(false); setErrors({}) }}
              className="px-5 py-2.5 border border-gray-300 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}