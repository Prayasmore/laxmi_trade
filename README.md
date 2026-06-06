# 📦 Laxmi Trade Stationery Ecommerce – Project Documentation

---

## 🧠 Core Architecture

This project follows a **no-backend, headless architecture**:

```
Google Sheets (Inventory)
        ↓
Google Apps Script (API layer)
        ↓
React Frontend (fetch + state)
        ↓
UI Components (Product Cards, Filters, Cart)
```

👉 Google Sheets acts as a **CMS + Database**
👉 React handles rendering and interactions

---

## 📊 Product Data Source (Google Sheets)

All product data is managed via **Google Sheets (Inventory tab)**.

### Fields Used:

| Field        | Purpose                                          |
| ------------ | ------------------------------------------------ |
| id           | Unique identifier (used in cart)                 |
| name         | Product title shown on UI                        |
| category     | Used for filtering                               |
| brand        | Subtitle / secondary info                        |
| mrp          | Product price                                    |
| stock        | Inventory tracking (optional UI use)             |
| unit         | Optional display                                 |
| image_url    | Primary product image (fallback for media)       |
| media        | Comma-separated URLs for multi-media gallery     |
| description  | Used in Product Detail Page                      |
| is_active    | Controls visibility                              |
| tags         | Search & advanced filtering                      |
| last_updated | Metadata                                         |

### Media Field

The `media` field supports multiple images and videos per product:

```
media: "url1.jpg,url2.jpg,video1.mp4"
```

* If `media` exists → split into array, each URL trimmed
* If `media` is empty/missing → fallback to `[image_url]`
* Supports image formats (jpg, png, webp, etc.) and video formats (mp4, webm, ogg)

Final structure per product:

```js
product.media = string[] // always an array
```

---

## ⚡ Frontend Control via Google Sheets

The frontend is **completely driven by sheet data**.

### 🎯 Key Fields That Control UI

#### 1. Product Name

* Source: `name`
* UI:

```jsx
{product.name}
```

---

#### 2. Category (Drives Filters)

* Source: `category`

Used for:

* Filter buttons
* Product grouping

```js
products.filter(p => p.category === selectedCategory)
```

👉 Changing category in sheet = instant UI change

---

#### 3. Price

* Source: `mrp`

```jsx
₹{product.mrp}
```

---

#### 4. Media (Images + Videos)

* Primary source: `media` (comma-separated URLs)
* Fallback: `image_url`

**Product Listing (Grid):**

```js
// getThumbnail picks the right image for grid display
// If first media item is a video → falls back to image_url
const thumbnail = getThumbnail(product);
<img src={getOptimizedMedia(thumbnail, "grid")} />
```

**Product Detail Page:**

```jsx
// Main display — supports both images and videos
{isVideo(selectedMedia) ? (
  <video src={getOptimizedMedia(selectedMedia)} controls />
) : (
  <img src={getOptimizedMedia(selectedMedia, "pdp")} />
)}
```

**Thumbnail Gallery:**

```jsx
// Horizontal scroll on mobile, vertical on desktop (left side)
{product.media.map(url => (
  <button onClick={() => setSelectedMedia(url)}>
    <img src={getOptimizedMedia(url, "thumb")} />
  </button>
))}
```

---

#### 5. Product Visibility (Important)

* Source: `is_active`

```js
products.filter(p => p.is_active === "TRUE")
```

👉 `FALSE` → product hidden from website

---

#### 6. Tags (Search & Future Filters)

* Source: `tags`

Used for:

* Search
* Advanced filtering

---

## 🖼️ Cloudinary Media Optimization

All media URLs are optimized via `src/utils/cloudinary.js` before rendering.

### Utility Functions:

| Function              | Purpose                                       |
| --------------------- | --------------------------------------------- |
| `isVideo(url)`        | Detects video files (.mp4, .webm, .ogg)       |
| `isCloudinaryUrl(url)`| Checks if URL is from res.cloudinary.com       |
| `getOptimizedImage()` | Applies image-specific Cloudinary transforms   |
| `getOptimizedVideo()` | Applies video-specific Cloudinary transforms   |
| `getOptimizedMedia()` | Unified helper — auto-detects image vs video   |

### Image Transformation Presets:

| Type    | Transformations                       | Use Case              |
| ------- | ------------------------------------- | --------------------- |
| `grid`  | `f_auto,q_auto,w_400,h_400,c_pad,b_white` | Product listing cards |
| `pdp`   | `f_auto,q_auto,w_800,h_800,c_fit`    | Product detail page   |
| `thumb` | `f_auto,q_auto,w_100,h_100,c_fill`   | Thumbnail gallery     |

### Video Transformations:

```
f_auto,q_auto,w_720
```

Auto-compressed, 720px wide for fast loading.

### How It Works:

```js
// Injects transformations into Cloudinary URL after "/upload/"
// Non-Cloudinary URLs are returned unchanged
getOptimizedMedia(url, "grid")
// → .../upload/f_auto,q_auto,w_400,h_400,c_pad,b_white/...
```

---

## 🔄 Data Fetching Logic

Products are fetched from Google Sheets via API:

```js
const fetchProducts = async () => {
  const res = await fetch(SHEET_API_URL);
  const data = await res.json();
  setProducts(data);
};
```

### Post-Fetch Processing (`sheet.js`):

```js
// Each product is normalized with:
{
  category: row.category.trim().toLowerCase(),
  brand: row.brand.trim().toLowerCase(),
  mrp: parseFloat(row.mrp),
  stock: parseInt(row.stock),
  media: row.media?.trim()
    ? row.media.split(',').map(url => url.trim()).filter(Boolean)
    : [row.image_url].filter(Boolean),
}
```

---

## 🧩 UI Rendering Flow

```js
products.map(product => (
  <ProductCard product={product} />
))
```

Each product dynamically renders:

* Name
* Price
* Image (optimized via Cloudinary)
* Category
* Cart controls

---

## 🖼️ Product Detail Page — Media Gallery

### Layout:

| Breakpoint      | Layout                                         |
| --------------- | ---------------------------------------------- |
| Mobile          | Main display on top, thumbnails scroll horizontally below |
| Desktop (md+)   | Thumbnails stacked vertically on LEFT, main display on RIGHT |

### Features:

* **Multi-media support** — images and videos in a single gallery
* **Thumbnail selection** — click to change main display
* **Video handling** — play icon overlay on video thumbnails, controls enabled, no autoplay
* **Image optimization** — `object-contain` for no cropping, `bg-gray-100` background
* **Max height** — `max-h-[400px]` for consistent sizing
* **Scroll** — horizontal on mobile, vertical on desktop (capped at `max-h-[400px]`)
* **Backward compatible** — single-image products show no thumbnail strip

### State:

```js
const [selectedMedia, setSelectedMedia] = useState(product.media[0]);
```

---

## 🛒 Cart System

### State Structure:

```js
{
  [productId]: { product, qty }
}
```

### Features:

* Add/remove items
* Quantity stepper
* Cart drawer (responsive)
* WhatsApp order integration

---

## 📦 Checkout Flow

1. User adds items to cart
2. Opens checkout modal
3. Enters:

   * Name
   * Phone
   * Address

### On Order:

* Send data to Google Apps Script
* Generate WhatsApp message
* Redirect to WhatsApp

---

## 📄 Google Sheets Order Logging

Orders are stored in **Orders tab**

### Fields:

* Order ID
* Customer details
* Items
* Total
* Status

---

## 🎨 UI & Responsiveness

* Mobile-first design
* Responsive grid layout
* Clean Tailwind CSS v4 styling
* Optimized for local shop users
* Cloudinary auto-optimization for fast media loading

---

## 📱 Navigation & UX

* Logo → redirects to homepage
* Mobile navbar → hamburger menu
* Cart inside menu (mobile optimized)
* Floating cart bar on mobile (when items in cart)

---

## 💡 Key Design Philosophy

* No backend required
* Easy for non-technical users
* Google Sheets = Admin Panel
* WhatsApp = Order system
* Cloudinary = Media CDN + optimization

---

## ⚠️ Important Notes

### 1. Category Consistency

Always keep categories consistent:

❌ pen / Pen / PEN
✅ Pen

---

### 2. Image & Media Handling

* Use Cloudinary URLs for all media
* Avoid large image uploads — Cloudinary auto-optimizes
* For multi-media: add comma-separated URLs in the `media` column
* Videos: use .mp4 format for best compatibility
* If `media` is empty, `image_url` is used as fallback

---

### 3. API Endpoint

Replace:

```
YOUR_GOOGLE_SCRIPT_URL
```

With your deployed Apps Script URL

---

## 📁 Key Files

| File                          | Purpose                                      |
| ----------------------------- | -------------------------------------------- |
| `src/utils/sheet.js`          | Fetches & normalizes product data from Sheets |
| `src/utils/cloudinary.js`     | Media URL optimization utilities              |
| `src/components/ProductCard.jsx` | Product grid card (listing page)           |
| `src/components/Header.jsx`   | Header with search and cart icon              |
| `src/components/Cart.jsx`     | Cart drawer                                   |
| `src/components/CheckoutModal.jsx` | Checkout form + WhatsApp integration     |
| `src/pages/ProductDetail.jsx` | Product detail page with media gallery        |
| `src/pages/About.jsx`         | About page                                    |
| `src/App.jsx`                 | Main app — routing, state, filtering          |

---

## 🚀 Future Enhancements

* Stock-based UI (Out of stock badge)
* Admin analytics
* Real Google reviews integration
* Image zoom on product detail page
* Swipe gestures for media gallery on mobile

---

## 🧠 Final Insight

This project is essentially:

> 💥 A Headless Ecommerce System powered by Google Sheets

* No backend
* Fully dynamic
* Easily scalable
* Cloudinary-optimized media
* Multi-media product galleries
* Perfect for local businesses

---

*This document explains how the frontend is fully controlled by Google Sheets and how data flows through the system.*
