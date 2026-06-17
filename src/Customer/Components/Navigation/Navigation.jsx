'use client'
import { useCart } from '../../../Context/CartContext'
import { Fragment, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Dialog, DialogBackdrop, DialogPanel,
  Popover, PopoverButton, PopoverGroup, PopoverPanel,
  Tab, TabGroup, TabList, TabPanel, TabPanels,
  Menu, MenuButton, MenuItem, MenuItems,
} from '@headlessui/react'
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import {
  mens_kurta, mens_shirt, mens_shoes,
  womens_saree, kids_wear, electronics,
  beauty_products, watches
} from '../../../Data/data'

const navigation = {
  categories: [
    {
      id: 'women', name: 'Women',
      featured: [
        { name: 'New Arrivals', href: '#', imageSrc: "/saree_sale.jpg", imageAlt: 'New arrivals women' },
        { name: 'Basic Tees', href: '#', imageSrc: "/sonam_dress.jpg", imageAlt: 'Basic tees women' },
      ],
      sections: [
        { id: 'clothing', name: 'Clothing', items: [{ name: 'Tops' }, { name: 'Dresses' }, { name: 'Pants' }, { name: 'Denim' }, { name: 'Sweaters' }, { name: 'T-Shirts' }, { name: 'Jackets' }, { name: 'Browse All' }] },
        { id: 'accessories', name: 'Accessories', items: [{ name: 'Watches' }, { name: 'Wallets' }, { name: 'Bags' }, { name: 'Sunglasses' }, { name: 'Hats' }, { name: 'Belts' }] },
        { id: 'brands', name: 'Brands', items: [{ name: 'Full Nelson' }, { name: 'My Way' }, { name: 'Re-Arranged' }, { name: 'Counterfeit' }] },
      ],
    },
    {
      id: 'men', name: 'Men',
      featured: [
        { name: 'New Arrivals', href: '#', imageSrc: "/shirt3.jpg", imageAlt: 'New arrivals men' },
        { name: 'Artwork Tees', href: '#', imageSrc: "/Shirt.jpg", imageAlt: 'Artwork tees men' },
      ],
      sections: [
        { id: 'clothing', name: 'Clothing', items: [{ name: 'Tops' }, { name: 'Pants' }, { name: 'Sweaters' }, { name: 'T-Shirts' }, { name: 'Jackets' }, { name: 'Browse All' }] },
        { id: 'accessories', name: 'Accessories', items: [{ name: 'Watches' }, { name: 'Wallets' }, { name: 'Bags' }, { name: 'Sunglasses' }, { name: 'Hats' }] },
        { id: 'brands', name: 'Brands', items: [{ name: 'Re-Arranged' }, { name: 'Counterfeit' }, { name: 'Full Nelson' }, { name: 'My Way' }] },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '/' },
    { name: 'Stores', href: '/product' },
  ],
}

const allProducts = [
  ...mens_kurta.map(p => ({ ...p, category: 'Mens Kurta' })),
  ...mens_shirt.map(p => ({ ...p, category: 'Mens Shirt' })),
  ...mens_shoes.map(p => ({ ...p, category: 'Mens Shoes' })),
  ...womens_saree.map(p => ({ ...p, category: 'Womens Saree' })),
  ...kids_wear.map(p => ({ ...p, category: 'Kids Wear' })),
  ...electronics.map(p => ({ ...p, category: 'Electronics' })),
  ...beauty_products.map(p => ({ ...p, category: 'Beauty' })),
  ...watches.map(p => ({ ...p, category: 'Watches' })),
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navigation() {
  const navigate = useNavigate()

  // ✅ All cart data from context — no local state
  const { cartItems, removeFromCart, totalItems, totalPrice } = useCart()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [cartOpen, setCartOpen] = useState(false)

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return []
    return allProducts.filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.desc?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    ).slice(0, 12)
  }, [searchQuery])

  const suggestions = ['Kurta', 'Saree', 'Formal Shirt', 'Lehenga', 'Shoes', 'Watch', 'Kids']

  const handleSearchProductClick = (product) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product))
    setSearchOpen(false)
    navigate('/product-details', { state: { t: Date.now() } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-white">

      {/* ══ SEARCH OVERLAY ══ */}
      {searchOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-white shadow-2xl">
            <div className="mx-auto max-w-3xl px-4 py-4 flex items-center gap-3 border-b border-gray-100">
              <MagnifyingGlassIcon className="h-5 w-5 text-indigo-500 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 text-base text-gray-900 placeholder-gray-400 focus:outline-none py-1"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              <button onClick={() => setSearchOpen(false)} className="ml-1 text-gray-400 hover:text-gray-600">
                <span className="text-sm font-medium">Close</span>
              </button>
            </div>

            <div className="mx-auto max-w-3xl px-4 pb-5 max-h-[70vh] overflow-y-auto">
              {!searchQuery && (
                <div className="pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Popular searches</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(s => (
                      <button key={s} onClick={() => setSearchQuery(s)}
                        className="px-4 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <MagnifyingGlassIcon className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-medium">No results for "{searchQuery}"</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="pt-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {searchResults.map((product, i) => (
                      <div
                        key={`${product.id}-${i}`}
                        onClick={() => handleSearchProductClick(product)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 hover:border-indigo-200 hover:shadow-md transition"
                      >
                        <div className="aspect-square bg-gray-50 overflow-hidden">
                          <img src={product.image} alt={product.title}
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300" />
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs text-indigo-500 font-medium mb-0.5">{product.category}</p>
                          <p className="text-sm font-medium text-gray-800 truncate">{product.title}</p>
                          {product.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <StarIcon className="h-3 w-3 text-yellow-400" />
                              <span className="text-xs text-gray-500">{product.rating}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className="text-sm font-bold text-gray-900">{product.price}</span>
                            {product.oldPrice && <span className="text-xs text-gray-400 line-through">{product.oldPrice}</span>}
                            {product.discount && <span className="text-xs text-green-600 font-semibold">{product.discount}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══ CART SIDEBAR ══ */}
      <Dialog open={cartOpen} onClose={setCartOpen} className="relative z-50">
        <DialogBackdrop transition
          className="fixed inset-0 bg-black/30 transition-opacity duration-300 data-closed:opacity-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel transition
                className="pointer-events-auto w-screen max-w-sm transform transition duration-300 ease-in-out data-closed:translate-x-full">
                <div className="flex h-full flex-col bg-white shadow-xl">

                  {/* Cart header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Shopping Cart
                      {totalItems > 0 && (
                        <span className="ml-2 text-sm font-normal text-gray-400">({totalItems} items)</span>
                      )}
                    </h2>
                    <button onClick={() => setCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Cart items */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                        <ShoppingBagIcon className="h-14 w-14" />
                        <p className="text-sm font-medium">Your cart is empty</p>
                        <button onClick={() => setCartOpen(false)} className="text-indigo-600 text-sm underline">
                          Continue Shopping
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-4">
                        {cartItems.map((item, i) => (
                          <li key={`${item.id}-${item.size}-${item.color}-${i}`} className="flex gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                              <img src={item.image} alt={item.title}
                                className="w-full h-full object-cover object-top" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                Size: {item.size} · Qty: {item.quantity}
                              </p>
                              <p className="text-sm font-semibold text-indigo-600 mt-1">{item.price}</p>
                            </div>
                            {/* ✅ removeFromCart from context with all 3 args */}
                            <button
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                              className="text-gray-300 hover:text-red-400 transition shrink-0"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Cart footer */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-3">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        {/* ✅ totalPrice from context */}
                        <span className="font-semibold text-gray-900">₹{totalPrice.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-gray-400">Shipping calculated at checkout</p>
                      <button
                        onClick={() => { setCartOpen(false); navigate('/checkout') }}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition"
                      >
                        Checkout →
                      </button>
                      <button
                        onClick={() => { setCartOpen(false); navigate('/cart') }}
                        className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
                      >
                        View Full Cart
                      </button>
                    </div>
                  )}
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      {/* ══ MOBILE MENU ══ */}
      <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 data-closed:opacity-0" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 data-closed:-translate-x-full">
            <div className="flex px-4 pt-5 pb-2">
              <button onClick={() => setMobileOpen(false)}
                className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                <XMarkIcon className="size-6" />
              </button>
            </div>
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map(cat => (
                    <Tab key={cat.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600">
                      {cat.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map(cat => (
                  <TabPanel key={cat.name} className="space-y-10 px-4 pt-10 pb-8">
                    <div className="grid grid-cols-2 gap-x-4">
                      {cat.featured.map(item => (
                        <div key={item.name} className="group relative text-sm">
                          <img alt={item.imageAlt} src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                          <a href={item.href} className="mt-6 block font-medium text-gray-900">
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">Shop now</p>
                        </div>
                      ))}
                    </div>
                    {cat.sections.map(section => (
                      <div key={section.name}>
                        <p className="font-medium text-gray-900">{section.name}</p>
                        <ul role="list" className="mt-6 flex flex-col space-y-6">
                          {section.items.map(item => (
                            <li key={item.name} className="flow-root">
                              <a href={item.href || '#'} className="-m-2 block p-2 text-gray-500">{item.name}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map(page => (
                <div key={page.name} className="flow-root">
                  <Link to={page.href} onClick={() => setMobileOpen(false)}
                    className="-m-2 block p-2 font-medium text-gray-900">
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <a href="#" className="-m-2 block p-2 font-medium text-gray-900">Sign in</a>
              </div>
              <div className="flow-root">
                <a href="#" className="-m-2 block p-2 font-medium text-gray-900">Create account</a>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ══ HEADER ══ */}
      <header className="relative bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
          Get free delivery on orders over ₹499
        </p>
        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              <button onClick={() => setMobileOpen(true)}
                className="rounded-md bg-white p-2 text-gray-400 lg:hidden">
                <Bars3Icon className="size-6" />
              </button>

              {/* Logo */}
              <Link to="/">
                <div className="flex items-center gap-3 bg-black px-4 py-2 rounded-xl">
                  <svg viewBox="0 0 56 56" className="w-10 h-10">
                    <polygon points="28,4 52,28 28,52 4,28" fill="none" stroke="#C9A84C" strokeWidth="1.5" />
                    <polygon points="28,14 42,28 28,42 14,28" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
                    <rect x="20" y="24" width="16" height="2" fill="#C9A84C" />
                    <rect x="27" y="26" width="2" height="14" fill="#C9A84C" />
                  </svg>
                  <div>
                    <p style={{ fontFamily: 'Georgia, serif', color: '#C9A84C', fontSize: 20, letterSpacing: 2 }}>TrendKart</p>
                    <p style={{ fontSize: 8, color: '#C9A84C', letterSpacing: 5 }}>LUXURY FASHION</p>
                  </div>
                </div>
              </Link>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map(cat => (
                    <Popover key={cat.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="group relative flex items-center text-sm font-medium text-gray-700 hover:text-gray-800 data-open:text-indigo-600">
                          {cat.name}
                          <span aria-hidden="true"
                            className="absolute inset-x-0 -bottom-px z-30 h-0.5 transition duration-200 group-data-open:bg-indigo-600" />
                        </PopoverButton>
                      </div>
                      <PopoverPanel transition
                        className="absolute inset-x-0 top-full z-20 bg-white text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-leave:duration-150">
                        <div aria-hidden="true" className="absolute inset-0 top-1/2 bg-white shadow-sm" />
                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {cat.featured.map(item => (
                                  <div key={item.name} className="group relative text-sm">
                                    <img alt={item.imageAlt} src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                                    <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">Shop now</p>
                                  </div>
                                ))}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-8 gap-y-10 text-sm">
                                {cat.sections.map(section => (
                                  <div key={section.name}>
                                    <p className="font-medium text-gray-900">{section.name}</p>
                                    <ul role="list" className="mt-6 space-y-4">
                                      {section.items.map(item => (
                                        <li key={item.name}>
                                          <a href={item.href || '#'} className="hover:text-gray-800">{item.name}</a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}
                  {navigation.pages.map(page => (
                    <Link key={page.name} to={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center gap-1">

                {/* Search */}
                <button onClick={() => { setSearchQuery(''); setSearchOpen(true) }}
                  className="p-2 text-gray-400 hover:text-gray-600 transition" aria-label="Search">
                  <MagnifyingGlassIcon className="size-6" />
                </button>

                {/* ✅ Cart button — opens sidebar + shows live badge */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="group relative -m-2 flex items-center p-2 ml-2"
                  aria-label="Open cart"
                >
                  <ShoppingBagIcon className="size-6 text-gray-400 group-hover:text-gray-600 transition" />
                  {/* ✅ Badge shows totalItems from CartContext */}
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </button>

                {/* Profile */}
                <Menu as="div" className="relative ml-2">
                  <MenuButton className="flex rounded-full focus-visible:outline-2 focus-visible:outline-indigo-500">
                    <img alt="profile" src="/scarlet.jpg"
                      className="size-8 rounded-full bg-gray-200 object-cover" />
                  </MenuButton>
                  <MenuItems transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75">
                    <MenuItem>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">Your Profile</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">Orders</Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">Settings</Link>
                    </MenuItem>
                    <MenuItem>
                      <button onClick={() => { logout(); navigate('/login') }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100">
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>

            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}