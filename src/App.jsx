import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from './utils/sheet';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden flex flex-col">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-2.5">
        <div className="h-2.5 w-1/3 skeleton rounded" />
        <div className="h-3.5 w-4/5 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-12 skeleton rounded" />
          <div className="h-8 w-14 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))]
      .filter(Boolean)
      .sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === 'all' || p.category === activeCategory;

      const q = search.toLowerCase();

      const matchesSearch =
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.tags?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory]);

  function addToCart(product) {
    setCart((prev) => {
      const existing = prev[product.id];
      return {
        ...prev,
        [product.id]: { product, qty: existing ? existing.qty + 1 : 1 },
      };
    });
  }

  function updateQty(id, delta) {
    setCart((prev) => {
      const item = prev[id];
      if (!item) return prev;

      const newQty = item.qty + delta;

      if (newQty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }

      return {
        ...prev,
        [id]: { ...item, qty: newQty },
      };
    });
  }

  const cartCount = Object.values(cart).reduce(
    (sum, item) => sum + item.qty,
    0
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header
        search={search}
        onSearch={setSearch}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onLogoClick={() => setActiveCategory('all')}
      />

      {cartOpen && (
        <Cart
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onClearCart={() => setCart({})}
        />
      )}

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <>
              {/* Hero */}
              <section className="relative overflow-hidden border-b border-gray-100">
                {/* soft brand glow */}
                <div aria-hidden className="absolute -top-24 -right-16 w-72 h-72 rounded-full bg-brand/40 blur-3xl" />
                <div aria-hidden className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-brand-soft/50 blur-3xl" />
                <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-14">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="max-w-2xl"
                  >
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide bg-black text-white px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand" /> Your neighbourhood stationery
                    </span>
                    <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold font-display leading-[1.05] text-black">
                      Everything for school,{' '}
                      <span className="relative inline-block">
                        <span className="relative z-10">office &amp; creativity</span>
                        <span aria-hidden className="absolute inset-x-0 bottom-1 h-3 sm:h-4 bg-brand -z-0" />
                      </span>
                    </h1>
                    <p className="mt-4 text-sm sm:text-base text-gray-600 max-w-xl">
                      Notebooks, pens, art supplies, packing &amp; office essentials — quality brands at fair prices, delivered straight to your WhatsApp.
                    </p>
                  </motion.div>
                </div>
              </section>

              {/* Categories */}
              <div className="sticky top-14 sm:top-16 z-30 bg-white/85 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide lg:overflow-visible">
                  <div className="flex gap-2 sm:gap-2.5 lg:flex-wrap whitespace-nowrap">
                    <button
                      onClick={() => setActiveCategory('all')}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                        activeCategory === 'all'
                          ? 'bg-black text-white border-black shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-black'
                      }`}
                    >
                      All
                    </button>

                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border capitalize transition-all duration-200 active:scale-95 ${
                          activeCategory === cat
                            ? 'bg-black text-white border-black shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:text-black'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}

                    {/* Spacer to prevent last item sticking to edge */}
                    <div className="flex-shrink-0 w-1 lg:hidden" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Products */}
              <main className="max-w-6xl mx-auto px-4 pt-6 pb-20 sm:pb-12">
                {loading && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center h-64 gap-1">
                    <p className="text-red-500 text-base font-medium">Couldn’t load products</p>
                    <p className="text-gray-400 text-sm">{error}</p>
                  </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 gap-2 text-center">
                    <span className="text-4xl">🔍</span>
                    <p className="text-gray-500 text-base font-medium">No products found</p>
                    <p className="text-gray-400 text-sm">Try a different category or search term.</p>
                  </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {filtered.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: 'easeOut', delay: Math.min(i * 0.03, 0.3) }}
                      >
                        <ProductCard
                          product={product}
                          onAddToCart={addToCart}
                          cart={cart}
                          updateQty={updateQty}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </main>
            </>
          }
        />

        {/* PRODUCT DETAIL */}
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              products={products}
              onAddToCart={addToCart}
              loading={loading}
              cart={cart}
              updateQty={updateQty}
            />
          }
        />

        {/* ABOUT US */}
        <Route path="/about" element={<About />} />
      </Routes>

      {/* Floating Cart Bar - Mobile Only */}
      {cartCount > 0 && !cartOpen && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-1">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full bg-brand text-black rounded-xl py-3 px-4 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform border border-black"
          >
            <div className="flex items-center gap-2">
              <span className="bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-sm font-bold">
                {cartCount === 1 ? '1 item' : `${cartCount} items`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold">View Cart</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}