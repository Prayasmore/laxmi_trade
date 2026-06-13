import { useState } from 'react';
import { motion } from 'framer-motion';
import CheckoutModal from './CheckoutModal';
import { getOptimizedMedia, isVideo, PLACEHOLDER_IMAGE } from '../utils/cloudinary';

const PLACEHOLDER = PLACEHOLDER_IMAGE;

// Prefer image_url, else the first non-video media item, else placeholder.
function cartThumb(product) {
  if (product.image_url) return getOptimizedMedia(product.image_url, 'thumb');
  const img = product.media?.find((m) => !isVideo(m));
  return img ? getOptimizedMedia(img, 'thumb') : PLACEHOLDER;
}

export default function Cart({ cart, onClose, onUpdateQty, onClearCart }) {
  const items = Object.values(cart);
  const total = items.reduce((sum, { product, qty }) => sum + product.mrp * qty, 0);
  const count = items.reduce((sum, { qty }) => sum + qty, 0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />

        {/* Side panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className="w-full max-w-sm bg-white flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold font-display">Your Cart</h2>
              <p className="text-xs text-gray-400">{count} {count === 1 ? 'item' : 'items'}</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 text-2xl leading-none transition"
              aria-label="Close cart"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-24 gap-3 text-center">
                <span className="text-5xl">🛒</span>
                <p className="text-gray-500 text-sm font-medium">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-1 text-sm font-semibold text-black underline underline-offset-4 decoration-brand decoration-2 hover:opacity-70 transition"
                >
                  Browse products
                </button>
              </div>
            ) : (
              items.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
                >
                  <img
                    src={cartThumb(product)}
                    alt={product.name}
                    className="w-14 h-14 object-contain rounded-lg border border-gray-200 shrink-0 bg-white"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PLACEHOLDER;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹{product.mrp} × {qty} = <span className="font-semibold text-black">₹{(product.mrp * qty).toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 border border-gray-200 rounded-full">
                    <button
                      onClick={() => onUpdateQty(product.id, -1)}
                      className="w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 active:scale-90 flex items-center justify-center transition text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="text-sm w-5 text-center font-semibold tabular-nums">{qty}</span>
                    <button
                      onClick={() => onUpdateQty(product.id, 1)}
                      className="w-7 h-7 rounded-full text-gray-600 hover:bg-gray-100 active:scale-90 flex items-center justify-center transition text-lg leading-none"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 space-y-3 bg-white">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-extrabold font-display text-black">₹{total.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
              >
                <span>Order via WhatsApp</span>
                <span>📲</span>
              </button>
              <button
                onClick={onClearCart}
                className="w-full text-xs text-gray-400 hover:text-red-500 transition py-1"
              >
                Clear cart
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {checkoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => { setCheckoutOpen(false); onClose(); }}
          onClearCart={onClearCart}
        />
      )}
    </>
  );
}
