# DM - WhatsApp Product Catalog

A modern, SEO-friendly product catalog website with WhatsApp-based ordering. Built as a lightweight alternative to full e-commerce — no checkout, no payment gateway, no cart logic. Orders are sent directly via WhatsApp.

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 |
| **Build Tool** | Vite 8 |
| **UI** | Bootstrap 5.3 |
| **Icons** | Lucide React |
| **Routing** | React Router v7 |
| **Form Handling** | React Hook Form + Zod |
| **Data Fetching** | TanStack Query |
| **Backend** | Supabase (Postgres, Auth, Storage) |
| **Language** | JavaScript (JSX) |

## Features

### Public (Storefront)
- **Home page** — Hero banner, slider, category grid, featured products
- **Product listing** — Filter by category, search, mobile-responsive layout
- **Product details** — Image gallery, colors, sizes, quantity selector, offer timer, WhatsApp order button
- **Cart sidebar** — Slide-out cart with inline checkout and WhatsApp submission
- **WhatsApp integration** — Each product and the cart generates a pre-filled WhatsApp message
- **SEO** — Meta tags, Open Graph, Schema.org JSON-LD (Product), breadcrumbs
- **Responsive** — Mobile-first, RTL support (Arabic)

### Admin Dashboard
- **Dashboard** — Stats overview (products, categories, sliders, stock, prices)
- **Products CRUD** — Create/edit/delete products with colors, sizes, gallery images, SEO fields, offer timer
- **Categories CRUD** — Create/edit/delete categories with image upload and parent category support
- **Hero Sliders CRUD** — Create/edit/delete promotional banners with link-to-product/category support
- **Settings** — Site name, description, logo, social links (WhatsApp, Facebook, Instagram, TikTok), hero banner content, display toggles
- **Authentication** — Email/password login via Supabase Auth, protected routes

## Database Schema

8 tables with Row Level Security (RLS), public read policies, and authenticated write policies.

| Table | Purpose |
|---|---|
| `categories` | Product categories with optional parent (subcategories), slug, image |
| `products` | Products with pricing, stock simulation, offer timer, SEO metadata |
| `product_images` | Gallery images for products (sortable) |
| `product_colors` | Color variants per product (name + hex code) |
| `product_sizes` | Size variants per product |
| `sliders` | Hero carousel banners (linkable to product or category) |
| `settings` | Single-row table for site configuration |
| `profiles` | Admin user profiles linked to `auth.users` |

### Storage Buckets

- `products` — Product images
- `categories` — Category images
- `sliders` — Slider banner images
- `logos` — Site logo images

## Routes

### Public

| Path | Component |
|---|---|
| `/` | HomePage |
| `/products` | ProductsPage (all) |
| `/category/:categorySlug` | ProductsPage (filtered) |
| `/product/:slug` | ProductDetailsPage |
| `/checkout` | CheckoutPage |

### Admin

| Path | Component |
|---|---|
| `/admin/login` | AdminLoginPage |
| `/admin/dashboard` | AdminDashboardPage |
| `/admin/products` | ManageProductsPage |
| `/admin/products/new` | ProductFormPage (create) |
| `/admin/products/edit/:id` | ProductFormPage (edit) |
| `/admin/categories` | ManageCategoriesPage |
| `/admin/sliders` | ManageSlidersPage |
| `/admin/settings` | ManageSettingsPage |

## Project Structure

```
src/
├── app/            # Supabase client
├── assets/         # Static images
├── components/     # Reusable UI components
├── constants/      # Query keys
├── contexts/       # React contexts (Cart)
├── hooks/          # TanStack Query hooks
├── layouts/        # Public / Admin layouts
├── pages/          # Route pages
├── routes/         # React Router config
├── services/       # Supabase data services
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor to create all tables, indexes, triggers, RLS policies, and storage buckets.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Architecture

```
Page → Hook (TanStack Query) → Service → Supabase
```

- **Services** handle all Supabase queries/mutations
- **Hooks** wrap services with TanStack Query (caching, loading, error states)
- **Pages** consume hooks and render UI
- **Forms** use React Hook Form + Zod for validation

All admin routes are protected by `ProtectedRoute` which checks Supabase auth session and admin role.
