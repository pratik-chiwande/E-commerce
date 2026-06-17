'use client'

import { TrashIcon } from '@heroicons/react/24/outline'

export default function CartItem({ item, onRemove, onQtyChange }) {
  return (
    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">

      {/* Image */}
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <p className="font-semibold text-gray-800 text-sm leading-snug">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-400 hover:text-red-500 transition p-1 shrink-0"
            title="Remove"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-0.5 rounded">Size: {item.size}</span>
          <span className="flex items-center gap-1">
            <span
              className="w-3 h-3 rounded-full border border-gray-300 inline-block"
              style={{ backgroundColor: item.color }}
            />
            <span className="capitalize">{item.color}</span>
          </span>
        </div>

        {/* Price + Qty */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">{item.price}</span>
            {item.oldPrice && (
              <span className="text-xs text-gray-400 line-through">{item.oldPrice}</span>
            )}
            {item.discount && (
              <span className="text-xs text-green-600 font-semibold">{item.discount}</span>
            )}
          </div>

          {/* Quantity stepper */}
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onQtyChange(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-40 text-lg leading-none transition"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium text-gray-800 border-x border-gray-200">
              {item.quantity}
            </span>
            <button
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-lg leading-none transition"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
