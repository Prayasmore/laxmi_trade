import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getOptimizedMedia, isVideo, PLACEHOLDER_IMAGE } from '../utils/cloudinary';

export default function ProductDetail({ products, onAddToCart, loading, cart, updateQty }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => String(p.id) === id);
  const media = product?.media?.length ? product.media : [];

  const [selectedMedia, setSelectedMedia] = useState(media[0] || '');

  // Sync selection when product/media changes
  useEffect(() => {
    if (media.length) setSelectedMedia(media[0]);
  }, [product?.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm font-medium"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const outOfStock = product.stock === 0;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-5 md:py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-black transition mb-3 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Breadcrumb */}
      <p className="text-xs text-gray-400 mb-4 truncate capitalize">
        Home / {product.category} / {product.name}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
        {/* Media Section — mobile: column (main + thumbnails below), desktop: row (thumbnails left + main right) */}
        <div className="flex flex-col-reverse md:flex-row gap-3">
          {/* Thumbnail Gallery — only show if more than 1 media item */}
          {media.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden md:max-h-[440px] scrollbar-hide pb-1 md:pb-0 md:pr-1">
              {media.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedMedia(url)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    selectedMedia === url
                      ? 'border-black ring-2 ring-brand ring-offset-1'
                      : 'border-gray-200 hover:border-gray-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  {isVideo(url) ? (
                    <>
                      <video
                        src={getOptimizedMedia(url)}
                        muted
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                      {/* Play icon overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <img
                      src={getOptimizedMedia(url, 'thumb')}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Main Display */}
          <div className="group flex-1 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm max-h-[440px] flex items-center justify-center">
            {isVideo(selectedMedia) ? (
              <video
                key={selectedMedia}
                src={getOptimizedMedia(selectedMedia)}
                controls
                className="w-full h-full max-h-[440px] object-contain"
              />
            ) : (
              <img
                src={selectedMedia ? getOptimizedMedia(selectedMedia, 'pdp') : PLACEHOLDER_IMAGE}
                alt={product.name}
                className="w-full h-full max-h-[440px] object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
            )}
          </div>
        </div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-col gap-2 md:gap-4"
        >
          <p className="text-xs text-gray-400 uppercase tracking-[0.08em] font-medium">
            {product.category}
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">
            {product.name}
          </h1>

          {product.brand && (
            <p className="text-sm text-gray-500 capitalize">
              Brand: <span className="font-medium text-gray-700">{product.brand}</span>
            </p>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-display text-black tracking-tight">
              ₹{product.mrp}
            </span>
            <span className="text-xs text-gray-400">incl. taxes</span>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description ||
              'High-quality stationery product. Perfect for daily use.'}
          </p>

          {/* Stock */}
          <span
            className={`inline-flex w-fit items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              outOfStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${outOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
            {outOfStock ? 'Out of stock' : `In stock · ${product.stock} available`}
          </span>

          {/* Cart action */}
          {(() => {
            const cartItem = cart[product.id];
            if (outOfStock) {
              return (
                <button
                  disabled
                  className="mt-2 w-full min-h-[42px] py-2.5 rounded-md font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              );
            }
            if (cartItem) {
              return (
                <div className="mt-2 flex items-center border border-gray-300 rounded-full overflow-hidden w-fit">
                  <button
                    onClick={() => updateQty(product.id, -1)}
                    className="w-11 h-11 flex items-center justify-center text-xl font-medium hover:bg-gray-100 active:scale-90 transition"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-base font-semibold tabular-nums">
                    {cartItem.qty}
                  </span>
                  <button
                    onClick={() => updateQty(product.id, +1)}
                    className="w-11 h-11 flex items-center justify-center text-xl font-medium hover:bg-gray-100 active:scale-90 transition"
                  >
                    +
                  </button>
                </div>
              );
            }
            return (
              <button
                onClick={() => onAddToCart(product)}
                className="mt-2 w-full min-h-[48px] py-3 rounded-full font-semibold text-sm bg-black text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.98]"
              >
                Add to Cart
              </button>
            );
          })()}
        </motion.div>
      </div>
    </div>
  );
}
