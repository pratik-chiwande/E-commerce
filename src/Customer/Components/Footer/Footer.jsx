import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4  grid-cols-2 gap-8">

          {/* Brand */}
          {/* <div>
            <h2 className="text-2xl font-bold text-orange-500">
              E-Commerce
            </h2>
            <p className="mt-3 text-gray-400">
              Shop the latest products at the best prices.
            </p>
          </div> */}

            <div>
            <h2 className="text-lg font-semibold mb-3 ">
           Company
            </h2>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-orange-500">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-orange-500">
                  Blog
                </a>
              </li>
              <li>
                <a href="/jobs" className="hover:text-orange-500">
                  Jobs
                </a>
              </li>
              <li>
                <a href="/press" className="hover:text-orange-500">
                  Press
                </a>
              </li>
               <li>
                <a href="/partners" className="hover:text-orange-500">
                  Partners
                </a>
              </li>
            </ul>
          </div> 



          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-orange-500">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-orange-500">
                  Products
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-orange-500">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-orange-500">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/*  Legal*/}

          <div>
            <h3 className=" text-lg font-semibold mb-3">
                Legal
            </h3>

            <ul className="space-y-2 text-gray-500"> 
                <li>
                    <a href="/claim" className="hover:text-orange-500">
                  Claim
                </a>
                </li>
                <li>
                     <a href="/privacy" className="hover:text-orange-500">
                  Privacy
                </a>
                </li>
                <li>
                   <a href="/terms" className="hover:text-orange-500">
               Terms
                </a>
                </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Contact Us
            </h3>
            <p className="text-gray-400">
              Email: support@ecart.com
            </p>
            <p className="text-gray-400">
              Phone: +91 9876543210
            </p>
            <p className="text-gray-400">
              Pune, Maharashtra, India
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          © {new Date().getFullYear()} E-Commerce. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;