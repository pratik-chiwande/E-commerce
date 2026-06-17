'use client'

import { useNavigate } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/20/solid'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

const handleClick = () => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // ✅ same fix
    navigate('/product-details', { state: { t: Date.now() } })
}
  return (
    <div
      onClick={handleClick}
      className="cursor-pointer group rounded-xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-md transition bg-white"
    >
      {/* Image */}
      <div className="aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>

        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
            <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-sm font-bold text-gray-900">{product.price}</span>
          {product.oldPrice && (
            <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>
          )}
          {product.discount && (
            <span className="text-xs text-green-600 font-semibold">{product.discount}</span>
          )}
        </div>
      </div>
    </div>
  )
}