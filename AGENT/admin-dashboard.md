# Admin Dashboard Specification & Architecture

This document defines the interface layout, routing, data flows, and form structures for the **Admin Dashboard Control Panel**. The admin section is a separate workspace designed specifically for catalog administrators to manage categories, products, sliders, and site configurations.

---

## 1. Authentication & Security Guard

All admin pages (except `/admin/login`) are protected behind a route guard to restrict access to authorized store managers only.

```text
User → Navigates to /admin/*
        ↓
  ProtectedRoute
        ↓
  Get Session & Get Profile (profiles table)
        ↓
  Is Authenticated & role = 'admin'?
     ├── YES ──> Render AdminLayout & Sub-page
     └── NO  ──> Redirect to /admin/login (with toast warning)
```

> [!IMPORTANT]
> The trigger `on_auth_user_created` automatically creates a profile row set to `role = 'admin'` in the `profiles` table upon sign-up in Supabase. Non-admin users can be manually demoted in the database if necessary.

---

## 2. Admin Layout System

The dashboard interface uses a clean, light-themed, sidebar-based layout that prioritizes scannability:
- **Sidebar Menu (280px Width)**:
  - Brand Logo/Header + "المدير" status badge.
  - Links: `الإحصائيات`, `إدارة المنتجات`, `إدارة الأقسام`, `سلايدر الواجهة`, `إعدادات المتجر`.
  - Action button: `تسجيل الخروج` (Logout).
- **Header Top-bar**:
  - Store preview button (`عرض المتجر`).
  - Mobile responsive toggle button.
- **RTL Support**: The dashboard dir is set to `rtl` and uses the **Cairo Font** for clear legibility.

---

## 3. Dashboard Sections & Operations

### A. Manage Products (`/admin/products`)
Shows the list of catalog items with options to search, filter by category, and edit/delete products.

- **Interface Elements**:
  - "إضافة منتج جديد" button linking to the product form.
  - Search input box (filters list by name instantly).
  - Category selector dropdown filter.
  - Responsive table showing columns:
    1. **صورة المنتج** (Thumbnail)
    2. **اسم المنتج** (Name)
    3. **القسم** (Category Name)
    4. **السعر الأساسي / سعر العرض** (Pricing details)
    5. **حالة المخزن** (Fake stock value or Out-of-Stock badge)
    6. **حالة التميز / التفعيل** (Featured & Active status pill badges)
    7. **الإجراءات** (Edit & Delete actions grouped on the right side)

---

### B. Product Form (`/admin/products/new` and `/admin/products/edit/:id`)
A multi-field form that handles basic details, stock, timers, SEO fields, images upload, colors, and sizes.

#### Validation Schema (Zod)
```javascript
const productSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن لا يقل عن 3 أحرف"),
  slug: z.string().min(3, "الرابط الفريد يجب أن لا يقل عن 3 أحرف").regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على حروف صغيرة وأرقام وفواصل فقط"),
  category_id: z.string().uuid("يجب اختيار قسم صالح"),
  short_description: z.string().max(200, "الوصف القصير يجب أن لا يتجاوز 200 حرف").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "السعر يجب أن يكون 0 أو أكثر"),
  sale_price: z.number().min(0).optional().nullable(),
  thumbnail_url: z.string().url("رابط الصورة المصغرة غير صالح"),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  show_stock: z.boolean().default(false),
  fake_stock: z.number().int().min(0).default(0),
  show_offer_timer: z.boolean().default(false),
  offer_end_date: z.string().optional().nullable(),
  meta_title: z.string().max(60, "عنوان الميتا يجب أن لا يتجاوز 60 حرفًا").optional(),
  meta_description: z.string().max(160, "وصف الميتا يجب أن لا يتجاوز 160 حرفًا").optional(),
});
```

#### Advanced Input Options
- **Gallery Images Selector**:
  - Allows selecting files.
  - Uploads to `products` bucket using `uploadProductImage(file)` inside `storageService`.
  - Previews uploaded thumbnails in a grid.
- **Product Colors Manager**:
  - Dynamic input lists where admins can click `إضافة لون` (Add color).
  - Render color name text input and visual Color Picker input (`<input type="color" />`).
- **Product Sizes Manager**:
  - Checkbox group or tags input allowing selection of catalog sizes (e.g. `S`, `M`, `L`, `XL`, `XXL`, or custom numeric shoe sizes).

> [!TIP]
> **Data Flow Pattern**:
> When saving a product, the form submits to the `useCreateProduct` or `useUpdateProduct` hook. The query mutate function performs two phases:
> 1. Inserts/Updates the base product record.
> 2. Resets and inserts child records in parallel (`product_colors`, `product_sizes`, `product_images`) using the generated product ID.

---

### C. Manage Categories (`/admin/categories`)
Allows creating, editing, and nesting product divisions.

- **Interface Elements**:
  - Grid list showing category card name, image, and its parent category.
  - Form Fields:
    - **اسم القسم** (Category Name)
    - **الرابط الفريد** (Slug)
    - **صورة القسم** (Image Upload - uploads to `categories` bucket)
    - **القسم الرئيسي** (Parent Category - select selector displaying active parent categories, allowing sub-category support)
    - **حالة التفعيل** (Is Active - boolean toggle)

---

### D. Manage Sliders (`/admin/sliders`)
Manages homepage promotional slider carousels.

- **Form Fields**:
  - **العنوان** (Slide Title - optional overlay text)
  - **صورة البانر** (Slider Image - uploads to `sliders` bucket)
  - **نوع الرابط** (Link Type - options: `قسم معين` (Category Link) or `بلا رابط` (None))
  - **القسم المرتبط** (Link Target - displays dropdown listing active categories if Category Link type is chosen)
  - **الترتيب** (Sort Order - numeric input for slide sequence)
  - **حالة التفعيل** (Is Active - boolean toggle)

---

### E. Manage Settings (`/admin/settings`)
Updates global site configuration. This updates the single settings row in the database where `id = 1`.

- **Form Fields**:
  - **اسم الموقع** (Site Name - e.g. "براند للملابس")
  - **وصف الموقع** (Site Description - general SEO metadata text)
  - **شعار الموقع** (Logo Image - uploads to `logos` bucket)
  - **رقم الواتساب** (WhatsApp Phone Number - formatted as numeric text, e.g. `201234567890` without spaces or `+`)
  - **روابط التواصل** (Facebook, Instagram, TikTok input URLs)
  - **عنوان واجهة البانر** (Hero Slider welcome overlay title)
  - **العنوان الفرعي للبانر** (Hero Slider welcome subtitle)

---

## 4. UI Library & Form Implementation Best Practices

1. **State Management**:
   - Query updates must trigger proper toast feedback notifications: `toast.loading()` -> `toast.success()` / `toast.error()`.
   - Always invalidate relevant query caches using the `QUERY_KEYS` constants on success, forcing lists to refresh instantly.
2. **Immediate Image Preview**:
   - Provide immediate previews for image inputs. When a file is chosen, upload it to the storage bucket asynchronously and load the returned public URL.
3. **Empty States**:
   - When database tables contain no data (e.g. no products yet), render an empty state panel showing a box icon, a helpful text message, and a clear call-to-action button (e.g. "إضافة أول منتج").
