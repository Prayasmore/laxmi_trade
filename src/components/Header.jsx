import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ search, onSearch, cartCount, onCartOpen }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-3">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-sm sm:text-base font-extrabold px-2 py-1 border bg-[#FFFF00] uppercase text-black whitespace-nowrap tracking-tight hover:opacity-80 transition-opacity cursor-pointer">
            Laxmi Trade
          </h1>
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="hidden sm:flex flex-1 min-w-0 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
        />

        {/* Desktop About Link */}
        <Link
          to="/about"
          className="flex-shrink-0 hidden sm:inline-block text-sm font-medium text-black hover:text-gray-600 transition px-2 py-1"
        >
          About
        </Link>

        {/* Cart Button - Desktop Only */}
        <button
          onClick={onCartOpen}
          className="hidden sm:flex flex-shrink-0 relative items-center gap-1.5 bg-black hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
        >
          🛒
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>

        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-md transition"
          aria-label="Toggle menu"
        >
          <svg
            className={`w-6 h-6 transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu - Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-200 px-3 py-3 space-y-2">
          {/* Mobile Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />

          {/* Mobile About Link */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-black hover:bg-gray-100 px-3 py-2 rounded-md transition"
          >
            📄 About Us
          </Link>

          {/* Mobile Cart Link (Optional) */}
          <button
            onClick={() => {
              onCartOpen();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left text-sm font-medium text-black hover:bg-gray-100 px-3 py-2 rounded-md transition"
          >
            🛒 View Cart ({cartCount})
          </button>
        </div>
      )}
    </header>
  );
}
