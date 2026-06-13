import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ search, onSearch, cartCount, onCartOpen, onLogoClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-gray-200/70 sticky top-0 z-40">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo */}
        <Link to="/" onClick={onLogoClick} className="flex-shrink-0">
          <h1 className="text-sm sm:text-base font-extrabold font-display px-2.5 py-1.5 rounded-md border border-black/10 bg-brand uppercase text-black whitespace-nowrap tracking-tight shadow-[0_2px_0_rgba(0,0,0,0.15)] hover:shadow-[0_4px_0_rgba(0,0,0,0.18)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            Laxmi Trade
          </h1>
        </Link>

        {/* Search Bar - Hidden on Mobile */}
        <div className="hidden sm:flex flex-1 min-w-0 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
          </svg>
          <input
            type="text"
            placeholder="Search products, brands…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-gray-100/80 border border-transparent rounded-full pl-9 pr-4 py-2 text-sm focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-brand/60 transition"
          />
        </div>

        {/* Desktop About Link */}
        <Link
          to="/about"
          className="flex-shrink-0 hidden sm:inline-block text-sm font-medium text-gray-700 hover:text-black transition px-2 py-1 relative after:absolute after:left-2 after:right-2 after:-bottom-0.5 after:h-0.5 after:bg-brand after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
        >
          About
        </Link>

        {/* Cart Button - Desktop Only */}
        <button
          onClick={onCartOpen}
          className="hidden sm:flex flex-shrink-0 relative items-center gap-1.5 bg-black hover:bg-gray-800 text-white pl-3 pr-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-lg active:scale-95"
        >
          🛒
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-brand text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </button>

        {/* Hamburger Menu - Mobile Only */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition"
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
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full bg-gray-100 border border-transparent rounded-full pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand/60 transition"
            />
          </div>

          {/* Mobile About Link */}
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-black hover:bg-gray-100 px-3 py-2.5 rounded-lg transition"
          >
            📄 About Us
          </Link>

          {/* Mobile Cart Link (Optional) */}
          <button
            onClick={() => {
              onCartOpen();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left text-sm font-medium text-black hover:bg-gray-100 px-3 py-2.5 rounded-lg transition"
          >
            🛒 View Cart ({cartCount})
          </button>
        </div>
      )}
    </header>
  );
}
