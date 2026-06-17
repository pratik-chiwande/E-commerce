'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const initialReviews = [
  { id: 1, name: 'Rahul S.',    rating: 5, date: 'March 12, 2025', title: 'Excellent quality!',      body: 'The fabric is super soft and the fitting is perfect. Highly recommend this kurta for festive occasions.',  avatar: 'RS' },
  { id: 2, name: 'Priya M.',    rating: 4, date: 'Feb 28, 2025',   title: 'Good value for money',    body: 'Nice stitching and color. Slightly runs large, so size down. The embroidery is very elegant.',               avatar: 'PM' },
  { id: 3, name: 'Aditya K.',   rating: 5, date: 'Jan 15, 2025',   title: 'Worth every rupee',       body: 'Bought this for a wedding and got so many compliments. Delivery was fast too!',                             avatar: 'AK' },
  { id: 4, name: 'Sneha R.',    rating: 3, date: 'Dec 20, 2024',   title: 'Average experience',      body: 'Quality is okay but the color looked slightly different from the photos. Returns process was smooth.',      avatar: 'SR' },
]

const ratingBreakdown = [
  { stars: 5, count: 72 },
  { stars: 4, count: 28 },
  { stars: 3, count: 12 },
  { stars: 2, count: 5  },
  { stars: 1, count: 3  },
]
const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0)
const avgRating    = (ratingBreakdown.reduce((s, r) => s + r.stars * r.count, 0) / totalReviews).toFixed(1)

export default function ProductReview() {
  const [reviews, setReviews]       = useState(initialReviews)
  const [showForm, setShowForm]     = useState(false)
  const [hovered, setHovered]       = useState(0)
  const [newReview, setNewReview]   = useState({ name: '', rating: 0, title: '', body: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newReview.name || !newReview.rating || !newReview.body) return
    setReviews(prev => [{
      id: Date.now(),
      ...newReview,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
      avatar: newReview.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    }, ...prev])
    setNewReview({ name: '', rating: 0, title: '', body: '' })
    setShowForm(false)
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">

        {/* Average rating */}
        <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-2xl p-6">
          <span className="text-6xl font-bold text-indigo-600">{avgRating}</span>
          <div className="flex mt-2">
            {[1,2,3,4,5].map(s => (
              <StarIcon key={s} className={classNames('h-5 w-5', s <= Math.round(Number(avgRating)) ? 'text-yellow-400' : 'text-gray-200')} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">Based on {totalReviews} reviews</p>
        </div>

        {/* Breakdown bars */}
        <div className="lg:col-span-2 flex flex-col justify-center gap-2">
          {ratingBreakdown.map(({ stars, count }) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-6">{stars}</span>
              <StarIcon className="h-4 w-4 text-yellow-400 shrink-0" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${(count / totalReviews) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-6">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write a review button */}
      <button
        onClick={() => setShowForm(v => !v)}
        className="mb-6 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
      >
        {showForm ? 'Cancel' : '+ Write a Review'}
      </button>

      {/* Review form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4 border border-gray-200">
          <h3 className="font-semibold text-gray-800">Your Review</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Your Name</label>
              <input
                type="text"
                value={newReview.name}
                onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Rahul S."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => (
                  <button
                    type="button"
                    key={s}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setNewReview(p => ({ ...p, rating: s }))}
                  >
                    <StarIcon className={classNames(
                      'h-7 w-7 transition',
                      s <= (hovered || newReview.rating) ? 'text-yellow-400' : 'text-gray-300'
                    )} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Review Title</label>
            <input
              type="text"
              value={newReview.title}
              onChange={e => setNewReview(p => ({ ...p, title: e.target.value }))}
              placeholder="Summarise your experience"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Review</label>
            <textarea
              rows={3}
              value={newReview.body}
              onChange={e => setNewReview(p => ({ ...p, body: e.target.value }))}
              placeholder="What did you like or dislike?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            Submit Review
          </button>
        </form>
      )}

      {/* Review list */}
      <div className="space-y-5">
        {reviews.map(review => (
          <div key={review.id} className="border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => (
                      <StarIcon key={s} className={classNames('h-4 w-4', s <= review.rating ? 'text-yellow-400' : 'text-gray-200')} />
                    ))}
                  </div>
                </div>
                {review.title && <p className="mt-2 text-sm font-semibold text-gray-700">{review.title}</p>}
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{review.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
