
import { useContext, useState, useEffect } from 'react'
import { useNavigate ,useLocation} from 'react-router-dom'
import { CartContext } from '../../../Context/CartContext'
import { StarIcon } from '@heroicons/react/20/solid'
import { ShieldCheckIcon, TruckIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import ProductReview from './ProductReview'
import {
  mens_kurta, mens_shoes, mens_shirt,
  womens_saree, electronics, beauty_products,
  kids_wear, home_decor, watches,
} from '../../../Data/data'

// ─────────────────────────────────────────────
// All products merged — defined once at module level
// ─────────────────────────────────────────────
const allProducts = [
  ...mens_kurta.map(p      => ({ ...p, category: "Men's Kurta"   })),
  ...mens_shoes.map(p      => ({ ...p, category: "Men's Shoes"   })),
  ...mens_shirt.map(p      => ({ ...p, category: "Men's Shirt"   })),
  ...womens_saree.map(p    => ({ ...p, category: "Women's Saree" })),
  ...electronics.map(p     => ({ ...p, category: "Electronics"   })),
  ...beauty_products.map(p => ({ ...p, category: "Beauty"        })),
  ...kids_wear.map(p       => ({ ...p, category: "Kids Wear"     })),
  ...home_decor.map(p      => ({ ...p, category: "Home Decor"    })),
  ...watches.map(p         => ({ ...p, category: "Watches"       })),
]

// ─────────────────────────────────────────────
// SimilarProducts — defined ABOVE ProductDetails,
// still in the same file, no separate file needed
// ─────────────────────────────────────────────
function SimilarProducts({ currentProduct, navigate }) {
  const similar = allProducts.filter(p =>
    p.image !== currentProduct?.image && (
      p.gender === currentProduct?.gender ||
      p.category === currentProduct?.category
    )
  ).slice(0, 12)

  const products = similar.length > 0 ? similar : allProducts.slice(0, 12)

 const handleClick = (item) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(item))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // ✅ passing state forces location.key to change even on same path
    navigate('/product-details', { state: { t: Date.now() } })
}

  return (
    <div className="mt-16 border-t border-gray-100 pt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>

      <Swiper
        modules={[Navigation]}
        navigation={true}
        spaceBetween={16}
        loop={products.length > 4}
        grabCursor={true}
        breakpoints={{
          320:  { slidesPerView: 1 },
          480:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        className="similar-swiper"
      >
        {products.map((item, i) => (
          <SwiperSlide key={`${item.id}-${i}`}>
            <div
              onClick={() => handleClick(item)}
              className="cursor-pointer group rounded-xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition bg-white"
            >
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-3">
                {item.category && (
                  <p className="text-xs text-indigo-500 font-medium mb-0.5">{item.category}</p>
                )}
                <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                {item.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarIcon className="h-3.5 w-3.5 text-yellow-400" />
                    <span className="text-xs text-gray-500">{item.rating} ({item.reviews})</span>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">{item.price}</span>
                  {item.oldPrice && (
                    <span className="text-xs text-gray-400 line-through">{item.oldPrice}</span>
                  )}
                  {item.discount && (
                    <span className="text-xs text-green-600 font-semibold">{item.discount}</span>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>{`
        .similar-swiper .swiper-button-next,
        .similar-swiper .swiper-button-prev {
          background: white;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          color: #4f46e5;
        }
        .similar-swiper .swiper-button-next::after,
        .similar-swiper .swiper-button-prev::after {
          font-size: 13px;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─────────────────────────────────────────────
// Main component — uses SimilarProducts above
// ─────────────────────────────────────────────
export default function ProductDetails() {
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const location  = useLocation() 
  const [product, setProduct]             = useState(null)
  const [selectedSize, setSelectedSize]   = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [mainImage, setMainImage]         = useState('')
  const [addedToCart, setAddedToCart]     = useState(false)
  const [showReviews, setShowReviews]     = useState(false)

useEffect(() => {
    try {
      const stored = sessionStorage.getItem('selectedProduct')
      if (stored) {
        const p = JSON.parse(stored)
        setProduct(p)
        setMainImage(p.image || '')
        setSelectedSize('')   // ✅ reset size on new product
        setSelectedColor('')  // ✅ reset color on new product
        const colors = Array.isArray(p.color) ? p.color : p.color ? [p.color] : []
        setSelectedColor(colors[0] || '')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        navigate(-1)
      }
    } catch (e) {
      console.error('Failed to load product:', e)
      navigate(-1)
    }
}, [location.key])   //this is the key fix — re-runs on every navigation

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading product...</p>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [product.image].filter(Boolean)
  const colors = Array.isArray(product.color) ? product.color : product.color ? [product.color] : []
  const sizes  = product.sizes?.length ? product.sizes : product.size?.map(s => s.name) || []

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) { alert('Please select a size'); return }
    addToCart({
      id: product.id, title: product.title, brand: product.brand || '',
      image: mainImage || product.image, price: product.price,
      oldPrice: product.oldPrice || '', size: selectedSize, color: selectedColor,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleBuyNow = () => {
    if (sizes.length > 0 && !selectedSize) { alert('Please select a size'); return }
    addToCart({
      id: product.id, title: product.title, brand: product.brand || '',
      image: mainImage || product.image, price: product.price,
      oldPrice: product.oldPrice || '', size: selectedSize, color: selectedColor,
    })
    navigate('/cart')
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)}
          className="mb-6 text-sm text-indigo-600 hover:underline flex items-center gap-1">
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Images */}
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="flex flex-col gap-3">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setMainImage(img)}
                    className={classNames(
                      'w-16 h-16 rounded-md overflow-hidden border-2 transition',
                      mainImage === img ? 'border-indigo-600' : 'border-gray-200 hover:border-gray-400'
                    )}>
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            <div className="flex-1 rounded-xl overflow-hidden bg-gray-50 max-h-130">
              <img src={mainImage || product.image} alt={product.title}
                className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              {product.brand && (
                <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide">{product.brand}</p>
              )}
              <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.title}</h1>
            </div>

            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map(star => (
                    <StarIcon key={star} className={classNames(
                      'h-5 w-5',
                      star <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                    )} />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.rating} · {product.reviews} reviews</span>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">{product.price}</span>
              {product.oldPrice && <span className="text-lg text-gray-400 line-through">{product.oldPrice}</span>}
              {product.discount && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {product.discount}
                </span>
              )}
            </div>

            {product.desc && <p className="text-gray-600 text-sm leading-relaxed">{product.desc}</p>}

            {colors.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Color: <span className="font-normal capitalize">{selectedColor}</span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)} title={c}
                      className={classNames(
                        'w-8 h-8 rounded-full border-2 transition',
                        selectedColor === c ? 'border-indigo-600 scale-110' : 'border-gray-300 hover:border-gray-500'
                      )}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={classNames(
                        'px-4 py-2 rounded-md border text-sm font-medium transition',
                        selectedSize === size
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                      )}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-2">
              <button onClick={handleAddToCart}
                className={classNames(
                  'flex-1 py-3 rounded-xl text-sm font-semibold transition',
                  addedToCart ? 'bg-green-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                )}>
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <button onClick={handleBuyNow}
                className="flex-1 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 transition">
                Buy Now
              </button>
            </div>

            {product.highlights?.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Highlights</p>
                <ul className="space-y-1">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-3">
              {[
                { icon: TruckIcon,       label: 'Free Delivery',  sub: 'On orders above ₹499' },
                { icon: ArrowPathIcon,   label: '10 Day Returns', sub: 'Easy return policy'   },
                { icon: ShieldCheckIcon, label: '100% Authentic', sub: 'Brand certified'      },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <Icon className="h-6 w-6 text-indigo-500" />
                  <p className="text-xs font-semibold text-gray-700">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-14">
          <button onClick={() => setShowReviews(v => !v)}
            className="text-indigo-600 font-semibold text-sm underline underline-offset-2">
            {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
          </button>
          {showReviews && <ProductReview />}
        </div>

        {/* ✅ Similar products — same file, no import needed */}
        <SimilarProducts currentProduct={product} navigate={navigate} />

      </div>
    </div>
  )
}