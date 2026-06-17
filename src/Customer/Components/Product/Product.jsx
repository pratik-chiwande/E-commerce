
import { useState, useMemo, useEffect } from 'react';  // ✅ all 3 imported together
// import { mens_kurta, womens_saree } from "../../../Data/data";
import { filters, singlefilter } from './FilterData';
import {
    Dialog, DialogBackdrop, DialogPanel,
    Disclosure, DisclosureButton, DisclosurePanel,
    Menu, MenuButton, MenuItem, MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import ProductCard from './ProductCard'

import {
  mens_kurta, mens_shoes, mens_shirt,
  womens_saree, womens_dress, electronics,
  beauty_products, kids_wear, home_decor, watches,
} from "../../../Data/data";

// ✅ Map category string → actual data array
const categoryMap = {
  mens_kurta,
  mens_shoes,
  mens_shirt,
  womens_saree,
  womens_dress,
  electronics,
  beauty_products,
  kids_wear,
  home_decor,
  watches,
}

// ✅ Map category string → display name
const categoryNames = {
  mens_kurta:     "Men's Kurta",
  mens_shoes:     "Men's Shoes",
  mens_shirt:     "Men's Shirt",
  womens_saree:   "Women's Saree",
  womens_dress:   "Women's Dress",
  electronics:    "Electronics",
  beauty_products:"Beauty Products",
  kids_wear:      "Kids Wear",
  home_decor:     "Home Decor",
  watches:        "Watches",
}

const sortOptions = [
    { name: 'Newest' },
    { name: 'Price: Low to High' },
    { name: 'Price: High to Low' },
]

const PRODUCTS_PER_PAGE = 8  // ✅ constant outside component, not a hook

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function parsePrice(priceStr) {
  if (!priceStr) return 0
  if (typeof priceStr === 'number') return priceStr
  return parseInt(String(priceStr).replace(/[₹,\s]/g, ''), 10) || 0
}

// ✅ ONE single export default function — all hooks live inside here, nothing else
export default function Product() {

    // ── All useState calls at the top ──────────────────────────────────────
    const [mobileFiltersOpen, setMobileFiltersOpen]     = useState(false)
    const [selectedSort, setSelectedSort]               = useState('')
    const [activeFilters, setActiveFilters]             = useState({})
    const [singleActiveFilters, setSingleActiveFilters] = useState({})
    const [currentPage, setCurrentPage]                 = useState(1)

     // ✅ Read which category was clicked from homepage
  const [selectedCategory] = useState(() => {
    return sessionStorage.getItem('selectedCategory') || 'mens_kurta'
  })

  // ✅ Get the right product array
  const categoryProducts = categoryMap[selectedCategory] || 'mens_shoes'
  const categoryTitle    = categoryNames[selectedCategory] || "Products"

    // ── All useEffect calls next ───────────────────────────────────────────
    // ✅ Reset to page 1 when filters or sort change
    useEffect(() => {
        setCurrentPage(1)
    }, [activeFilters, singleActiveFilters, selectedSort])

    // ── All useMemo calls next ─────────────────────────────────────────────
    const filteredProducts = useMemo(() => {
       let products = [...categoryProducts]  // ✅ uses selected category
  // ... rest of filter logic stays exactly the same

        // Color
        const selectedColors = Object.entries(activeFilters['color'] || {})
            .filter(([, checked]) => checked)
            .map(([val]) => val)
        if (selectedColors.length > 0) {
            products = products.filter(p => p.color?.some(c => selectedColors.includes(c)))
        }

        // Size
        const selectedSizes = Object.entries(activeFilters['size'] || {})
            .filter(([, checked]) => checked)
            .map(([val]) => val)
        if (selectedSizes.length > 0) {
            products = products.filter(p => p.size?.some(s => selectedSizes.includes(s.name)))
        }

        // Price
        const selectedPrice = singleActiveFilters['price']
        if (selectedPrice) {
            products = products.filter(p => {
                const price = parsePrice(p.price)
                if (selectedPrice === 'under-500')     return price < 500
                if (selectedPrice === '₹500- ₹1000')  return price >= 500  && price <= 1000
                if (selectedPrice === '₹1000- ₹2000') return price >= 1000 && price <= 2000
                if (selectedPrice === ' above ₹2000') return price > 2000
                return true
            })
        }

        // Availability
        const selectedStock = singleActiveFilters['stock']
        if (selectedStock) {
            products = products.filter(p => {
                const qty = p.size?.reduce((sum, s) => sum + s.quantity, 0) ?? 0
                if (selectedStock === 'In_stock')     return qty > 0
                if (selectedStock === 'Out_of_stock') return qty === 0
                return true
            })
        }

        // Gender
        const selectedGender = singleActiveFilters['gender']
        if (selectedGender) {
            products = products.filter(p =>
                p.gender === selectedGender || p.gender === 'unisex'
            )
        }

        // Sort
        if (selectedSort === 'Price: Low to High') {
            products.sort((a, b) => parsePrice(a.price) - parsePrice(b.price))
        } else if (selectedSort === 'Price: High to Low') {
            products.sort((a, b) => parsePrice(b.price) - parsePrice(a.price))
        }

        return products
    }, [activeFilters, singleActiveFilters, selectedSort])

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
    }, [filteredProducts, currentPage])

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)

    // ── Regular functions (not hooks) ──────────────────────────────────────
    const handleCheckboxChange = (sectionId, value, checked) => {
        setActiveFilters(prev => ({
            ...prev,
            [sectionId]: { ...prev[sectionId], [value]: checked }
        }))
    }

    const handleRadioChange = (sectionId, value) => {
        setSingleActiveFilters(prev => ({
            ...prev,
            [sectionId]: prev[sectionId] === value ? '' : value
        }))
    }

    const renderCheckboxes = (section, prefix) => (
        <div className="space-y-4">
            {section.options.map((option, idx) => (
                <div key={option.value} className="flex gap-3">
                    <div className="flex h-5 shrink-0 items-center">
                        <div className="group grid size-4 grid-cols-1">
                            <input
                                id={`${prefix}-${section.id}-${idx}`}
                                type="checkbox"
                                value={option.value}
                                checked={!!(activeFilters[section.id]?.[option.value])}
                                onChange={e => handleCheckboxChange(section.id, option.value, e.target.checked)}
                                className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            />
                            <svg fill="none" viewBox="0 0 14 14"
                                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white">
                                <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100" />
                            </svg>
                        </div>
                    </div>
                    <label htmlFor={`${prefix}-${section.id}-${idx}`} className="text-sm text-gray-600 cursor-pointer">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )

    const renderRadios = (section, prefix) => (
        <div className="space-y-4">
            {section.options.map((option, idx) => (
                <div key={option.value} className="flex gap-3 items-center">
                    <input
                        id={`${prefix}-${section.id}-${idx}`}
                        type="radio"
                        name={`${prefix}-${section.id}`}
                        value={option.value}
                        checked={singleActiveFilters[section.id] === option.value}
                        onChange={() => handleRadioChange(section.id, option.value)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor={`${prefix}-${section.id}-${idx}`} className="text-sm text-gray-600 cursor-pointer">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    )

    const renderDisclosureSection = (section, prefix, isRadio = false) => (
        <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
            <h3 className="-my-3 flow-root">
                <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                    <span className="font-medium text-gray-900">{section.name}</span>
                    <span className="ml-6 flex items-center">
                        <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                        <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                    </span>
                </DisclosureButton>
            </h3>
            <DisclosurePanel className="pt-6">
                {isRadio ? renderRadios(section, prefix) : renderCheckboxes(section, prefix)}
            </DisclosurePanel>
        </Disclosure>
    )

    // ── JSX return — always last ───────────────────────────────────────────
    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
                    <DialogBackdrop transition
                        className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0" />
                    <div className="fixed inset-0 z-40 flex">
                        <DialogPanel transition
                            className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button type="button" onClick={() => setMobileFiltersOpen(false)}
                                    className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400">
                                    <XMarkIcon aria-hidden="true" className="size-6" />
                                </button>
                            </div>
                            <div className="mt-4 border-t border-gray-200 px-4">
                                {filters.map(s => renderDisclosureSection(s, 'mob', false))}
                                {singlefilter.map(s => renderDisclosureSection(s, 'mob', true))}
                            </div>
                        </DialogPanel>
                    </div>
                </Dialog>

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pt-24 pb-6">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">New Arrivals</h1>
                        <div className="flex items-center">
                            <Menu as="div" className="relative inline-block text-left">
                                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                                    Sort
                                    <ChevronDownIcon aria-hidden="true" className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500" />
                                </MenuButton>
                                <MenuItems transition
                                    className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5">
                                    <div className="py-1">
                                        {sortOptions.map(option => (
                                            <MenuItem key={option.name}>
                                                <button onClick={() => setSelectedSort(option.name)}
                                                    className={classNames(
                                                        selectedSort === option.name ? 'font-semibold text-gray-900 bg-gray-50' : 'text-gray-500',
                                                        'block w-full text-left px-4 py-2 text-sm data-focus:bg-gray-100'
                                                    )}>
                                                    {option.name}
                                                </button>
                                            </MenuItem>
                                        ))}
                                    </div>
                                </MenuItems>
                            </Menu>
                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <Squares2X2Icon aria-hidden="true" className="size-5" />
                            </button>
                            <button type="button" onClick={() => setMobileFiltersOpen(true)}
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
                                <FunnelIcon aria-hidden="true" className="size-5" />
                            </button>
                        </div>
                    </div>

                    <section aria-labelledby="products-heading" className="pt-6 pb-24">
                        <h2 id="products-heading" className="sr-only">Products</h2>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">

                            {/* Desktop Filters */}
                            <form className="hidden lg:block">
                                {filters.map(s => renderDisclosureSection(s, 'desk', false))}
                                {singlefilter.map(s => renderDisclosureSection(s, 'desk', true))}
                            </form>

                            {/* Product grid + Pagination */}
                            <div className="lg:col-span-4 w-full">

                                {/* Count */}
                                <p className="text-sm text-gray-500 mb-3">
                                    {filteredProducts.length === 0
                                        ? '0 products found'
                                        : `Showing ${(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–${Math.min(currentPage * PRODUCTS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} products`
                                    }
                                </p>

                                {/* Grid */}
                                {paginatedProducts.length === 0 ? (
                                    <p className="text-center text-gray-400 mt-16 text-lg">
                                        No products match your filters.
                                    </p>
                                ) : (
                                    <div className="flex-wrap justify-center bg-white py-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                        {paginatedProducts.map((item, i) => (
                                            <ProductCard key={`${item.id}-${i}`} product={item} />
                                        ))}
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-1 mt-10">

                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            ← Prev
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                                            const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                                            const showLeftDots  = page === 2 && currentPage > 4
                                            const showRightDots = page === totalPages - 1 && currentPage < totalPages - 3

                                            if (showLeftDots)  return <span key="dots-left"  className="px-2 text-gray-400 select-none">…</span>
                                            if (showRightDots) return <span key="dots-right" className="px-2 text-gray-400 select-none">…</span>
                                            if (!showPage) return null

                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={classNames(
                                                        'w-9 h-9 rounded-md text-sm font-medium transition',
                                                        currentPage === page
                                                            ? 'bg-indigo-600 text-white shadow'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                    )}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}