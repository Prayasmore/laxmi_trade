/**
 * Placeholder image URL for fallback
 */
export const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600?text=No+Image';

/**
 * Returns true if the URL points to a video file
 */
export const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

/**
 * Returns true if the URL is a Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url?.includes('res.cloudinary.com');
};

/**
 * Injects transformations into a Cloudinary URL after "/upload/"
 * Non-Cloudinary URLs are returned unchanged.
 */
const transformCloudinaryUrl = (url, transformations) => {
  if (!isCloudinaryUrl(url)) return url;
  return url.replace('/upload/', `/upload/${transformations}/`);
};

/**
 * Optimizes Cloudinary image URLs with context-specific transformations
 *
 * @param {string} url - Original image URL
 * @param {string} type - Image context: "grid", "pdp", or "thumb"
 * @returns {string} Optimized URL (or original if not Cloudinary)
 *
 * @example
 * <img src={getOptimizedImage(product.image_url, "grid")} />
 * <img src={getOptimizedImage(product.image_url, "pdp")} />
 * <img src={getOptimizedImage(product.image_url, "thumb")} />
 */
export function getOptimizedImage(url, type = 'grid') {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return PLACEHOLDER_IMAGE;
  }

  const transformationsMap = {
    grid: 'f_auto,q_auto,w_400,h_400,c_pad,b_white',
    pdp: 'f_auto,q_auto,w_800,h_800,c_fit',
    thumb: 'f_auto,q_auto,w_100,h_100,c_fill',
  };

  const transformations = transformationsMap[type] || transformationsMap.grid;
  return transformCloudinaryUrl(url, transformations);
}

/**
 * Optimizes Cloudinary video URLs
 *
 * @param {string} url - Original video URL
 * @returns {string} Optimized video URL (or original if not Cloudinary)
 */
export function getOptimizedVideo(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  return transformCloudinaryUrl(url, 'f_auto,q_auto,w_720');
}

/**
 * Unified media optimizer — detects image vs video and applies
 * the correct transformations automatically.
 *
 * @param {string} url - Original media URL
 * @param {string} type - Context: "grid", "pdp", or "thumb" (ignored for videos)
 * @returns {string} Optimized URL
 *
 * @example
 * <img src={getOptimizedMedia(url, "grid")} />
 * <video src={getOptimizedMedia(videoUrl)} />
 */
export function getOptimizedMedia(url, type = 'grid') {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return '';
  }

  if (isVideo(url)) {
    return getOptimizedVideo(url);
  }

  return getOptimizedImage(url, type);
}
