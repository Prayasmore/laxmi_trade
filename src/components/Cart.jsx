import { useState } from 'react';
import CheckoutModal from './CheckoutModal';

const PLACEHOLDER = 'https://placehold.co/56x56?text=📦';

export default function Cart({ cart, onClose, onUpdateQty, onClearCart }) {
  const items = Object.values(cart);
  const total = items.reduce((sum, { product, qty }) => sum + product.mrp * qty, 0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Side panel */}
      <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none transition"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {items.length === 0 ? (
            <p className="text-gray-400 text-center mt-20 text-sm">Your cart is empty.</p>
          ) : (
            items.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-3">
                <img
                  src={product.image_url || PLACEHOLDER}
                  alt={product.name}
                  className="w-14 h-14 object-contain rounded-lg border shrink-0 bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ₹{product.mrp} × {qty} = ₹{(product.mrp * qty).toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onUpdateQty(product.id, -1)}
                    className="w-7 h-7 rounded border text-gray-600 hover:bg-gray-100 flex items-center justify-center transition text-lg leading-none"
                  >
                    −
                  </button>
                  <span className="text-sm w-5 text-center font-medium">{qty}</span>
                  <button
                    onClick={() => onUpdateQty(product.id, 1)}
                    className="w-7 h-7 rounded border text-gray-600 hover:bg-gray-100 flex items-center justify-center transition text-lg leading-none"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-4 py-4 border-t space-y-3">
            <div className="flex justify-between font-semibold text-base">
              <span>Total</span>
              <span className="text-black font-bold">₹{total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="w-full bg-black hover:bg-gray-800 text-white py-2.5 rounded-md font-medium flex items-center justify-center gap-2 transition"
            >
              <span>Order via WhatsApp</span>
              <span>📲</span>
            </button>
          </div>
        )}
      </div>
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
