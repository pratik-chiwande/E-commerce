import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navigation from './Customer/Components/Navigation/Navigation'
import Homepages from './Customer/Pages/HomePage/Homepages'
import ProductDetails from './Customer/Components/ProductDetails/ProductDetails'
import Product from './Customer/Components/Product/Product'
import Cart from './Customer/Components/Cart/Cart'
import Order from './Customer/Components/Order/Order'
import Checkout from './Customer/Components/Checkout/Checkout'
import Footer from './Customer/Components/Footer/Footer'
import Profile from './Customer/Pages/Profile'
import Login from './Customer/Components/Auth/Login'
import Register from './Customer/Components/Auth/Register'

export default function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Homepages />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Order />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>


      <Footer />
    </>
  )
}