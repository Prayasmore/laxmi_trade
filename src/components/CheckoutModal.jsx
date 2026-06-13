import { useState } from 'react';
import { motion } from 'framer-motion';

const SHOP_NUMBER = '917039942367';
const STORAGE_KEY = 'laxmi_customer';
const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

export default function CheckoutModal({ cart, onClose, onClearCart }) {
  const items = Object.values(cart);
  const total = items.reduce((sum, { product, qty }) => sum + product.mrp * qty, 0);

  const [form, setForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) return saved;
    } catch {}
    return { name: '', phone: '', address: '' };
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!form.address.trim()) errs.address = 'Address is required.';
    return errs;
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (loading) return;

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    // ✅ Generate Order ID
    const orderId = `LT-${Date.now()}`;

    // ✅ Prepare items
    const itemsString = items
      .map(
        ({ product, qty }, i) =>
          `${i + 1}. ${product.name} (Qty: ${qty}) - ₹${(product.mrp * qty).toFixed(2)}`
      )
      .join('\n');

    // ✅ Payload
    const payload = {
      orderId,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      items: itemsString,
      total,
    };

    // 🔥 SEND TO GOOGLE SHEET (CORS SAFE)
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        mode: "no-cors", // 🔥 critical fix
      });

      console.log("Order sent to sheet ✅", payload);
    } catch (err) {
      console.error("Order save failed ❌", err);
    }

    // ✅ Save user details
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));

    // ✅ Clear cart state after successful order
    onClearCart();

    // ✅ Remove any cart data from localStorage if it exists
    localStorage.removeItem('cart');

    // ✅ WhatsApp message
    const message = encodeURIComponent(
      [
        `🛒 *New Order - Laxmi Trade*`,
        ``,
        `*Order ID:* ${orderId}`,
        ``,
        `👤 *Customer Details*`,
        `Name: ${form.name.trim()}`,
        `Phone: ${form.phone.trim()}`,
        ``,
        `📍 *Address*`,
        form.address.trim(),
        ``,
        `📦 *Order Items*`,
        itemsString,
        ``,
        `💰 *Total: ₹${total.toFixed(2)}*`,
        ``,
        `---`,
        `Please confirm the order and share UPI details. 🙌`,
      ].join('\n')
    );

    // ✅ Redirect to WhatsApp
    await new Promise((res) => setTimeout(res, 400));

    window.open(`https://wa.me/${SHOP_NUMBER}?text=${message}`, '_blank');

    onClose();
  }

  const inputBase =
    "w-full border rounded-xl px-3.5 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-gray-400";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold font-display">Checkout Details</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-100 text-2xl leading-none transition"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="px-5 py-4 space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className={`${inputBase} ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              inputMode="numeric"
              maxLength={10}
              className={`${inputBase} ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Delivery Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="House / street / area, city"
              rows={3}
              className={`${inputBase} resize-none ${errors.address ? 'border-red-400' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
          </div>

          {/* Summary */}
          <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl text-sm space-y-1.5">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between gap-2 text-gray-600">
                <span className="truncate">{product.name} × {qty}</span>
                <span className="shrink-0 font-medium text-gray-800">₹{(product.mrp * qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold flex justify-between mt-2 border-t border-gray-200 pt-2.5 text-base">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-50 active:scale-95 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Processing…" : <><span>Order via WhatsApp</span><span>📲</span></>}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}