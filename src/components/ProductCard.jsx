import { useNavigate } from 'react-router-dom';
import { getOptimizedMedia, isVideo, PLACEHOLDER_IMAGE } from '../utils/cloudinary';

function getThumbnail(product) {
  if (product.media?.length) {
    const first = product.media[0];
    return isVideo(first) ? product.image_url : first;
  }
  return product.image_url;
}

export default function ProductCard({ product, onAddToCart, cart, updateQty }) {
  const outOfStock = product.stock === 0;
  const lowStock = !outOfStock && product.stock <= 5;
  const navigate = useNavigate();
  const cartItem = cart?.[product.id];
  const thumbnail = getThumbnail(product);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)] hover:border-gray-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100/60 overflow-hidden">
        <img
          src={thumbnail ? getOptimizedMedia(thumbnail, 'grid') : PLACEHOLDER_IMAGE}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />

        {/* Stock badges */}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-black/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
            Out of stock
          </span>
        )}
        {lowStock && (
          <span className="absolute top-2 left-2 bg-brand text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 space-y-1 sm:space-y-1.5">
        {/* Category */}
        <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-[0.08em] font-medium">
          {product.category}
        </p>

        {/* Name */}
        <h3 className="text-xs sm:text-sm font-semibold text-black line-clamp-2 leading-snug group-hover:text-black/90">
          {product.name}
        </h3>

        {/* Brand */}
        <p className="text-[10px] sm:text-xs text-gray-500 capitalize">
          {product.brand}
        </p>

        {/* Bottom section */}
        <div className="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-2">
          {/* Price */}
          <span className="text-sm sm:text-lg font-bold font-display text-black tracking-tight">
            ₹{product.mrp}
          </span>

          {/* Button / Stepper */}
          {outOfStock ? (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">Out of Stock</span>
          ) : cartItem ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center border border-gray-300 rounded-full overflow-hidden bg-white"
            >
              <button
                onClick={(e) => { e.stopPropagation(); updateQty(product.id, -1); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg hover:bg-gray-100 active:scale-90 transition"
              >
                −
              </button>
              <span className="w-5 sm:w-7 text-center text-xs sm:text-sm font-semibold tabular-nums">
                {cartItem.qty}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); updateQty(product.id, +1); }}
                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-sm sm:text-lg hover:bg-gray-100 active:scale-90 transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-semibold bg-black text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-md active:scale-95"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
