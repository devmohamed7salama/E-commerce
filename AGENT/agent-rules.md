# agent-rules.md

# Project Overview

Build a modern catalog/e-commerce style web application using:

* React 19
* Vite
* Bootstrap 5
* Supabase
* React Router
* React Helmet Async
* TanStack Query
* React Hook Form
* Zod

This project is NOT a full ecommerce system.

There is:

* No checkout
* No payment gateway
* No cart logic

Orders are sent directly to WhatsApp.

---

# Main Goal

Create a fast, SEO-friendly catalog website with a modern dashboard.

The project must be scalable, maintainable, and production-ready.

---

# Architecture Rules

Follow Feature-Based Architecture.

Never place all code inside pages.

Separate:

```text
src

├── app
├── routes

├── pages

├── components

├── features

├── hooks

├── services

├── layouts

├── contexts

├── utils

├── constants

├── assets
```

---

# Folder Structure

```text
src

├── app
│   └── supabase.js

├── routes

├── pages
│
├── layouts
│
├── features
│
├── components
│
├── hooks
│
├── services
│
├── contexts
│
├── utils
│
├── constants
│
└── assets
```

---

# Features Structure

Each feature owns itself.

Example:

```text
features

├── products

│   ├── services
│   ├── hooks
│   ├── components
│   ├── validations
│   └── pages

├── categories

├── sliders

├── settings

└── auth
```

---

# Component Rules

Components must be reusable.

Bad:

```jsx
ProductCardForHome
```

Good:

```jsx
ProductCard
```

---

Bad:

```jsx
HeroSliderForHome
```

Good:

```jsx
HeroSlider
```

---

# Naming Rules

Use:

```text
PascalCase
```

for:

```text
Components
Pages
Layouts
```

Examples:

```text
Navbar.jsx

ProductCard.jsx

AdminLayout.jsx

ProductsPage.jsx
```

---

Use:

```text
camelCase
```

for:

```text
variables
functions
hooks
```

Examples:

```js
getProducts()

createProduct()

useProducts()
```

---

# Routing Rules

Public:

```text
/

/products

/product/:slug

/category/:slug
```

---

Admin:

```text
/admin/login

/admin/dashboard

/admin/products

/admin/categories

/admin/sliders

/admin/settings
```

---

# Authentication Rules

Dashboard must require login.

Public users:

```text
read only
```

---

Authenticated Admin:

```text
create
update
delete
```

---

Never store auth state manually.

Use:

```js
supabase.auth.getSession()
```

and

```js
onAuthStateChange()
```

---

# Data Fetching Rules

Never fetch directly inside components.

Bad:

```jsx
useEffect(() => {
 fetch(...)
}, [])
```

---

Good:

```js
services/productService.js
```

then

```js
hooks/useProducts.js
```

then

```jsx
ProductPage
```

---

# Query Rules

Use:

```text
TanStack Query
```

for:

* caching
* refetching
* loading states
* mutations

---

Avoid:

```text
manual loading states
```

when Query can handle them.

---

# Forms Rules

Use:

```text
React Hook Form
```

and

```text
Zod
```

for every dashboard form.

---

Examples:

```text
Create Product

Edit Product

Category Form

Settings Form
```

---

# Supabase Rules

Never use Service Role Key.

Allowed:

```env
VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY
```

---

Forbidden:

```env
SERVICE_ROLE_KEY
```

inside frontend.

---

# Storage Rules

Images must be uploaded to:

```text
products

categories

slider

logos
```

## buckets.

Store only URLs inside database.

Never store files in database.

---

# SEO Rules

Every page must have:

```text
title

description
```

---

Products:

```text
meta_title

meta_description
```

from database.

---

Category pages:

generate dynamic metadata.

---

# Performance Rules

Avoid:

```text
large images
```

Compress before upload.

---

Use:

```html
loading="lazy"
```

for product images.

---

Use:

```text
pagination
```

if products become large.

---

# Code Quality Rules

Never duplicate logic.

Extract reusable code.

---

Avoid huge components.

Maximum preferred size:

```text
200-300 lines
```

per component.

---

Split responsibilities.

---

# Error Handling Rules

Every request must handle:

```text
loading

error

empty state
```

---

Never leave blank screens.

---

# Dashboard Rules

Admin can manage:

* Products
* Categories
* Slider
* Settings

---

Products:

* Create
* Update
* Delete

---

Categories:

* Create
* Update
* Delete

---

Slider:

* Create
* Update
* Delete

---

Settings:

* Update

---

# WhatsApp Rules

Generate dynamic links:

```text
https://wa.me/{phone}?text={message}
```

---

Message Example

```text
مرحباً

أريد الاستفسار عن المنتج:

T-Shirt Black Oversize
```

---

# UI Rules

Modern

Clean

Light Theme

Mobile First

Responsive

Fast

Accessible

Simple

Professional

No visual clutter.

---

# Final Objective

Build a production-ready catalog website that feels like a modern ecommerce store while keeping the business flow extremely simple:

Product → WhatsApp → Customer Conversation → Order
