# seo-performance.md

# Goal

Make the website:

* Extremely fast
* Fully indexable
* SEO optimized for Google
* Mobile-first performance
* Ready for local business traffic (Egypt market)

Focus: Product pages ranking on Google + WhatsApp conversion.

---

# Core SEO Strategy

The site is NOT a blog.

It is a:

```text id="seo1"
Product Listing + Landing Pages System
```

Each product = landing page.

Each category = landing page.

---

# URL Structure

Clean slugs only:

```text id="seo2"
/products/t-shirt-black-oversize

/category/mens-shirts
```

Never use IDs in URLs.

---

# Meta Tags Strategy

Every page must have dynamic metadata.

---

## Product Page

Required:

```text id="seo3"
meta_title

meta_description

slug
```

---

Example:

```text id="seo4"
Meta Title:
T-Shirt Black Oversize | Premium Cotton - Buy Now

Meta Description:
High quality black oversized t-shirt made from 100% cotton. Available in multiple sizes. Order now via WhatsApp.
```

---

## Category Page

```text id="seo5"
Best Men's T-Shirts | Summer Collection 2026

Shop premium men's t-shirts with modern designs, comfortable fit, and best prices in Egypt.
```

---

# Open Graph (OG Tags)

Required for WhatsApp + Facebook sharing:

```html id="seo6"
<meta property="og:title" content="" />
<meta property="og:description" content="" />
<meta property="og:image" content="" />
<meta property="og:type" content="product" />
```

---

# Twitter Cards

```html id="seo7"
<meta name="twitter:card" content="summary_large_image" />
```

---

# Sitemap

Generate automatically:

```text id="seo8"
/sitemap.xml
```

Includes:

* Products
* Categories
* Static pages

---

# Robots.txt

```text id="seo9"
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

---

# Performance Strategy

## Image Optimization

All images must be:

* WebP preferred
* Compressed before upload
* Max width: 1200px
* Lazy loaded

---

## Frontend Rules

Use:

```text id="seo10"
React.lazy
Code splitting
Route-based splitting
```

---

Avoid:

```text id="seo11"
Huge initial bundle
Unoptimized images
Inline heavy assets
```

---

# React Performance Rules

## Components

* Keep components small
* Avoid unnecessary re-renders

---

## Memoization

Use:

```javascript id="seo12"
React.memo
useMemo
useCallback
```

only when needed (not everywhere).

---

## Lists

Always:

```text id="seo13"
key = stable id
```

Never index as key.

---

# Data Strategy (SEO Critical)

Pages must NOT wait for slow loading UI.

Use:

```text id="seo14"
SSR-like behavior (via prefetch)
```

with TanStack Query.

---

Prefetch:

* Products list
* Categories
* Product details

---

# Structured Data (Schema.org)

## Product Schema

```json id="seo15"
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "",
  "image": "",
  "description": "",
  "offers": {
    "@type": "Offer",
    "price": "",
    "priceCurrency": "EGP",
    "availability": "https://schema.org/InStock"
  }
}
```

---

## Category Schema

Use:

```json id="seo16"
ItemList
```

---

# Internal Linking Strategy

Every page must link to:

* Related products
* Category pages
* Featured items

---

Example:

```text id="seo17"
"Related Products"
"Similar Items"
"More from this category"
```

---

# WhatsApp SEO Strategy

All conversions happen via WhatsApp.

Each product must generate:

```text id="seo18"
pre-filled message
```

Example:

```
Hi, I want to order:
T-Shirt Black Oversize
Size: L
```

---

# Core Web Vitals Strategy

## LCP (Largest Contentful Paint)

Fix by:

* Optimized hero image
* Lazy loading below fold
* CDN for images

---

## CLS (Layout Shift)

Avoid:

* Unknown image sizes
* Dynamic layout jumps

Always define:

```css id="seo19"
width + height
```

for images.

---

## FID / Interaction

* Reduce JS bundle
* Avoid blocking tasks
* Use lightweight UI components

---

# Mobile SEO First

Most traffic = mobile.

Rules:

* 100% responsive
* Buttons large enough
* WhatsApp CTA always visible
* No hover-only interactions

---

# Content SEO Strategy

Each product page must contain:

* Minimum 80–150 words description
* Natural keywords
* Human-readable text (not AI spam)

---

Avoid:

```text id="seo20"
Keyword stuffing
Duplicate descriptions
```

---

# URL Slug Rules

Must be:

* lowercase
* hyphen-separated
* SEO readable

Example:

```text id="seo21"
t-shirt-black-oversize
mens-cotton-shirt
```

---

# Pagination SEO

For large catalogs:

Use:

```text id="seo22"
?page=1
?page=2
```

OR infinite scroll with proper indexing support.

---

# Image SEO

Every image must have:

```html id="seo23"
alt="product name + description"
```

Example:

```text id="seo24"
Black Oversized Cotton T-Shirt Front View
```

---

# Analytics (Optional but Recommended)

* Google Analytics
* Meta Pixel

Track:

* Product views
* WhatsApp clicks
* Category engagement

---

# Performance Budget

Target:

```text id="seo25"
Lighthouse Score > 90
```

---

# Final Outcome

If implemented correctly:

* Products rank on Google
* Categories rank for keywords
* Fast mobile browsing
* High WhatsApp conversion rate
* Minimal infrastructure cost
* Scalable catalog system

This is a **conversion-first SEO architecture**, not a traditional website.
