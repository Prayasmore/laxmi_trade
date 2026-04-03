import { useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'https://placehold.co/200x200?text=No+Image';

export default function ProductCard({ product, onAddToCart, cart, updateQty }) {
  const outOfStock = product.stock === 0;
  const navigate = useNavigate();
  const cartItem = cart?.[product.id];

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition overflow-hidden flex flex-col cursor-pointer"
    >
      
      {/* Image */}
      <div className="aspect-square bg-white overflow-hidden">
        <img
          src={product.image_url || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 space-y-1 sm:space-y-1.5">

        {/* Category */}
        <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wide">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-black line-clamp-2 leading-snug">
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-[10px] sm:text-xs text-gray-500 capitalize">
          {product.brand}
        </p>

        {/* Bottom section */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-2">

          {/* Price */}
          <span className="text-sm sm:text-lg font-semibold text-black">
            ₹{product.mrp}
          </span>

          {/* Button / Stepper */}
          {outOfStock ? (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Out of Stock</span>
          ) : cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-gray-300 rounded-md overflow-hidden"
            >
              <button
                onClick={(e) => { e.stopPropagation(); updateQty(product.id, -1); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg hover:bg-gray-100 transition"
              >
                −
              </button>
              <span className="w-5 sm:w-7 text-center text-xs sm:text-sm font-semibold">
                {cartItem.qty}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQty(product.id, +1); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg hover:bg-gray-100 transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-1.5 rounded-md transition font-medium bg-black text-white hover:bg-gray-800"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}