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
              <div className="max-w-6xl mx-auto px-4 py-5 flex gap-3 flex-wrap">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
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
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border capitalize transition ${
                      activeCategory === cat
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-black border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Products */}
              <main className="max-w-6xl mx-auto px-4 pb-12">
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
    </div>
  );
}