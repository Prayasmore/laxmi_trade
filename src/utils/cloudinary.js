/**
 * Placeholder image URL for fallback
 */
export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600?text=No+Image';

/**
 * Size configuration for different image contexts
 */
const SIZE_CONFIGS = {
  grid: 'w_400,h_400',
  pdp: 'w_600,h_600',
  cart: 'w_100,h_100',
};

/**
 * Optimizes Cloudinary image URLs with automatic transformations
 *
 * @param {string} url - Original Cloudinary image URL
 * @param {string} size - Image size context: "grid", "pdp", or "cart"
 * @returns {string} Optimized Cloudinary URL with transformations
 *
 * @example
 * // Product grid image
 * <img src={getOptimizedImage(product.image_url, "grid")} alt={product.name} />
 *
 * // Product detail page image
 * <img src={getOptimizedImage(product.image_url, "pdp")} alt={product.name} />
 *
 * // Cart thumbnail
 * <img src={getOptimizedImage(product.image_url, "cart")} alt={product.name} />
 */
export function getOptimizedImage(url, size = 'grid') {
  // Handle empty, null, or non-string URLs
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  // If URL is not from Cloudinary, return original URL
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Get size configuration (default to grid if invalid size)
  const sizeConfig = SIZE_CONFIGS[size] || SIZE_CONFIGS.grid;

  // Build transformations string
  // - Size config (w_400,h_400, etc.)
  // - c_fill: Crop to fill the specified dimensions
  // - q_auto: Automatic quality optimization
  // - f_auto: Automatic format selection (WebP, AVIF, etc.)
  const transformations = `${sizeConfig},c_fill,q_auto,f_auto`;

  // Insert transformations after "/upload/"
  const optimizedUrl = url.replace('/upload/', `/upload/${transformations}/`);

  return optimizedUrl;
}

/**
 * Batch optimize multiple image URLs
 *
 * @param {Array} images - Array of image objects with url and size properties
 * @returns {Array} Array of optimized image URLs
 *
 * @example
 * const optimized = getOptimizedImages([
 *   { url: "...", size: "grid" },
 *   { url: "...", size: "pdp" }
 * ]);
 */
export function getOptimizedImages(images = []) {
  return images.map(({ url, size = 'grid' }) =>
    getOptimizedImage(url, size)
  );
}
