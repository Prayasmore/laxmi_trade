import { useState } from 'react';

const SHOP_NUMBER = '919967103809';
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

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-base font-bold">Checkout Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="px-5 py-4 space-y-4">
          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}

          {/* Phone */}
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            maxLength={10}
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}

          {/* Address */}
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full border px-3 py-2 rounded-md"
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}

          {/* Summary */}
          <div className="bg-gray-50 p-3 rounded-md text-sm">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex justify-between">
                <span>{product.name} × {qty}</span>
                <span>₹{(product.mrp * qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold flex justify-between mt-2 border-t pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 border py-2 rounded">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded"
            >
              {loading ? "Processing..." : "Order via WhatsApp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}