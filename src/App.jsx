import { useState, useEffect, useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { fetchProducts } from './utils/sheet';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';

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
    <div className="min-h-screen bg-white">
      <Header
        search={search}
        onSearch={setSearch}
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
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
              {/* Categories */}
              <div className="max-w-6xl mx-auto px-4 py-4 overflow-x-auto scrollbar-hide lg:overflow-visible">
                <div className="flex gap-2 sm:gap-3 lg:flex-wrap whitespace-nowrap">
                  <button
                    onClick={() => setActiveCategory('all')}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      activeCategory === 'all'
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>

                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition ${
                        activeCategory === cat
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}

                  {/* Spacer to prevent last item sticking to edge */}
                  <div className="flex-shrink-0 w-1 lg:hidden" aria-hidden="true" />
                </div>
              </div>

              {/* Products */}
              <main className="max-w-6xl mx-auto px-4 pb-20 sm:pb-12">
                {loading && (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400 text-lg">
                      Loading products...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-red-500 text-base">Error: {error}</p>
                  </div>
                )}

                {!loading && !error && filtered.length === 0 && (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400 text-lg">
                      No products found.
                    </p>
                  </div>
                )}

                {!loading && !error && filtered.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filtered.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        cart={cart}
                        updateQty={updateQty}
                      />
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
            className="w-full bg-[#FFFF00] text-black rounded-xl py-3 px-4 flex items-center justify-between shadow-lg active:scale-[0.98] transition-transform border border-black"
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