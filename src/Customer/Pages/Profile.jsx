import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBagIcon, HeartIcon, MapPinIcon, StarIcon,
  ChevronRightIcon, PencilSquareIcon, ArrowRightOnRectangleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../Context/AuthContext'

const BASE = 'http://localhost:8080'

const recentOrders = [
  { id: '#ORD482931', name: 'Premium Cotton Kurta',  status: 'Delivered',  date: 'Jun 8, 2026',  price: '₹1,499', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=120&q=80', statusColor: 'text-green-500' },
  { id: '#ORD481204', name: 'Slim Fit Formal Shirt', status: 'Shipped',    date: 'Jun 5, 2026',  price: '₹1,299', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=120&q=80', statusColor: 'text-blue-500'  },
  { id: '#ORD479833', name: 'Chronograph Watch',     status: 'Processing', date: 'Jun 1, 2026',  price: '₹4,499', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=120&q=80', statusColor: 'text-amber-500' },
]

const menuItems = [
  { label: 'My Addresses', icon: MapPinIcon,       href: '#'       },
  { label: 'My Wishlist',  icon: HeartIcon,         href: '#'       },
  { label: 'My Orders',    icon: ShoppingBagIcon,   href: '/orders' },
  { label: 'My Reviews',   icon: StarIcon,          href: '#'       },
  { label: 'Edit Profile', icon: PencilSquareIcon,  href: '#'       },
]

export default function Profile() {
  const { user, logout, updateProfileImage } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef()

  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState(null)
  const [uploadError, setUploadError] = useState('')

  // ✅ Redirect to login if not logged in
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-400">
        <p className="text-lg font-medium">Please sign in to view your profile</p>
        <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition">
          Sign In
        </Link>
      </div>
    )
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploadError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res  = await fetch(`${BASE}/api/users/${user.id}/upload-image`, {
        method: 'POST',
        body:   formData,
      })
      const data = await res.json()

      if (!res.ok) { setUploadError('Upload failed'); return }

      // ✅ Update context + localStorage with new image URL
      updateProfileImage(BASE + data.imageUrl)
    } catch {
      setUploadError('Upload failed — check your connection')
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const profileImageSrc = preview || user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=4f46e5&color=fff&size=200`

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ── */}
      <div className="relative overflow-hidden bg-indigo-600">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-20 bg-white" />
        <div className="absolute bottom-0 left-10 w-32 h-32 rounded-full blur-2xl opacity-10 bg-white" />

        <div className="relative max-w-3xl mx-auto px-4 pt-10 pb-20 flex flex-col sm:flex-row items-center gap-6">

          {/* ✅ Avatar with upload button */}
          <div className="relative shrink-0">
            <img
              src={profileImageSrc}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-white/30 shadow-xl"
            />

            {/* Camera button — triggers file input */}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-indigo-50 transition"
            >
              {uploading
                ? <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                : <CameraIcon className="h-4 w-4 text-indigo-600" />
              }
            </button>

            {/* Hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* User info */}
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-bold text-white">{user.username}</h1>
            <p className="text-white/70 text-sm mt-0.5">{user.email}</p>
            <p className="text-white/50 text-xs mt-1">Member of TrendKart</p>
            {uploadError && (
              <p className="text-red-300 text-xs mt-1">{uploadError}</p>
            )}
            {uploading && (
              <p className="text-white/60 text-xs mt-1">Uploading photo...</p>
            )}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="-mt-8 rounded-2xl shadow-lg grid grid-cols-3 divide-x bg-white divide-gray-100">
          {[
            { label: 'Orders',   value: '12', icon: ShoppingBagIcon },
            { label: 'Wishlist', value: '34', icon: HeartIcon       },
            { label: 'Reviews',  value: '8',  icon: StarIcon        },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center py-5 gap-1">
              <s.icon className="h-5 w-5 text-indigo-500" />
              <span className="text-xl font-bold text-gray-900">{s.value}</span>
              <span className="text-xs text-gray-400">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* ── RECENT ORDERS ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-base text-gray-800">Recent Orders</h2>
            <Link to="/orders" className="text-xs text-indigo-500 hover:underline">View all →</Link>
          </div>
          <div className="rounded-2xl overflow-hidden divide-y shadow-sm bg-white divide-gray-100">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center gap-4 px-4 py-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={order.image} alt={order.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate text-gray-800">{order.name}</p>
                  <p className="text-xs text-gray-400">{order.id} · {order.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-gray-900">{order.price}</p>
                  <p className={`text-xs font-medium ${order.statusColor}`}>{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── MENU ── */}
        <section>
          <h2 className="font-bold text-base mb-3 text-gray-800">Account</h2>
          <div className="rounded-2xl overflow-hidden divide-y shadow-sm bg-white divide-gray-100">
            {menuItems.map(item => (
              <Link key={item.label} to={item.href}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition group">
                <item.icon className="h-5 w-5 shrink-0 text-indigo-500" />
                <span className="flex-1 text-sm font-medium text-gray-700">{item.label}</span>
                <ChevronRightIcon className="h-4 w-4 text-gray-300 group-hover:translate-x-0.5 transition" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── SIGN OUT ── */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 text-red-500 hover:bg-red-50 text-sm font-semibold transition"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Sign Out
        </button>

        <p className="text-center text-xs pb-6 text-gray-300">TrendKart v2.0 · Luxury Fashion</p>
      </div>
    </div>
  )
}