# hooks-services-architecture.md

# Goal

Create a clean separation between:

```text
UI
Hooks
Services
Supabase
```

Components must never communicate directly with Supabase.

All database access must go through Services.

Hooks consume Services.

Pages consume Hooks.

---

# Architecture Flow

```text
Page

↓

Hook

↓

Service

↓

Supabase

↓

Database
```

---

# Example

```text
ProductsPage

↓

useProducts()

↓

productService.js

↓

supabase
```

---

# Folder Structure

```text
src

├── app
│   └── supabase.js

├── services

├── hooks

├── features

└── pages
```

---

# Supabase Client

## File

```text
src/app/supabase.js
```

Responsibilities:

* Create client
* Export client
* Nothing else

---

Example

```javascript
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

---

# Services Layer

## Purpose

All CRUD operations live here.

No UI logic.

No React logic.

No state logic.

Only data access.

---

# Product Service

## File

```text
services/productService.js
```

Functions:

```javascript
getProducts()

getFeaturedProducts()

getProductBySlug()

createProduct()

updateProduct()

deleteProduct()
```

---

Example

```javascript
export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;

  return data;
}
```

---

# Category Service

## File

```text
services/categoryService.js
```

Functions:

```javascript
getCategories()

getCategoryBySlug()

createCategory()

updateCategory()

deleteCategory()
```

---

# Slider Service

## File

```text
services/sliderService.js
```

Functions:

```javascript
getSliders()

createSlider()

updateSlider()

deleteSlider()
```

---

# Settings Service

## File

```text
services/settingsService.js
```

Functions:

```javascript
getSettings()

updateSettings()
```

---

# Storage Service

## File

```text
services/storageService.js
```

Responsibilities:

* Upload image
* Delete image
* Generate public URL

---

Functions

```javascript
uploadProductImage()

uploadCategoryImage()

uploadSliderImage()

deleteImage()

getPublicUrl()
```

---

Example

```javascript
export async function uploadProductImage(file) {

  const fileName =
    `${Date.now()}-${file.name}`;

  const { data, error } =
    await supabase.storage
      .from("products")
      .upload(fileName, file);

  if (error) throw error;

  return data;
}
```

---

# Auth Service

## File

```text
services/authService.js
```

Functions

```javascript
login()

logout()

getSession()

getUser()
```

---

Example

```javascript
export async function login(
  email,
  password
) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
```

---

# Hooks Layer

## Purpose

Handle:

* Queries
* Mutations
* Loading
* Error
* Cache

Using TanStack Query.

---

# Products Hook

## File

```text
hooks/useProducts.js
```

Example

```javascript
const {
 data,
 isLoading,
 error
}
```

from

```javascript
useQuery(...)
```

---

Responsibilities

```text
Fetch Products

Cache Products

Loading State

Error State
```

---

# Product Hook

## File

```text
hooks/useProduct.js
```

Responsibilities

```text
Single Product

Product Details

Product Page
```

---

# Categories Hook

## File

```text
hooks/useCategories.js
```

Responsibilities

```text
Fetch Categories

Cache Categories
```

---

# Sliders Hook

## File

```text
hooks/useSliders.js
```

Responsibilities

```text
Fetch Hero Slider
```

---

# Settings Hook

## File

```text
hooks/useSettings.js
```

Responsibilities

```text
Site Settings

Social Links

WhatsApp Number
```

---

# Mutations

Never write insert/update/delete inside components.

Use Mutation Hooks.

---

Example

## File

```text
hooks/useCreateProduct.js
```

---

Responsibilities

```text
Create Product

Invalidate Cache

Handle Success

Handle Error
```

---

Example Flow

```text
CreateProductForm

↓

useCreateProduct

↓

productService

↓

supabase
```

---

# Query Keys

Centralize Query Keys.

## File

```text
constants/queryKeys.js
```

---

Example

```javascript
export const QUERY_KEYS = {

 PRODUCTS: "products",

 PRODUCT: "product",

 CATEGORIES: "categories",

 SETTINGS: "settings",

 SLIDERS: "sliders",

};
```

---

# Cache Invalidation

After:

```text
Create

Update

Delete
```

invalidate relevant queries.

---

Example

```javascript
queryClient.invalidateQueries({
 queryKey: ["products"]
});
```

---

# Error Handling

Create helper.

## File

```text
utils/getErrorMessage.js
```

Purpose

Convert Supabase errors to readable messages.

---

Example

```javascript
try {

}
catch(error){

}
```

---

Show Toast.

Never silently fail.

---

# Toast Notifications

Recommended:

```bash
npm install react-hot-toast
```

---

Success

```text
Product Created
```

---

Error

```text
Failed To Create Product
```

---

# Admin Route Protection

## File

```text
components/ProtectedRoute.jsx
```

Responsibilities

```text
Check Session

Check Admin

Redirect Login
```

---

Flow

```text
No Session

↓

Login
```

---

```text
Session Exists

↓

Dashboard
```

---

# Role System (IMPORTANT)

Do NOT allow every authenticated user.

Create:

```sql
profiles
```

table.

---

Schema

```sql
create table profiles (

id uuid primary key,

email text,

role text default 'admin'

);
```

---

Only allow:

```text
role = admin
```

for dashboard access.

---

# Image Upload Flow

```text
User Selects Image

↓

Upload To Storage

↓

Get URL

↓

Save URL In Database

↓

Render In Frontend
```

---

Never:

```text
Store Base64

Store Files In Database
```

---

# Loading Strategy

Use:

```text
Skeleton Loading
```

for:

* Products
* Categories
* Slider

---

Avoid:

```text
Full Page Spinner
```

---

# Realtime

Not required.

Disable realtime completely.

No business value for this project.

---

# Security Rules

Never expose:

```env
SERVICE_ROLE_KEY
```

---

Allowed:

```env
VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY
```

---

Never trust frontend validation.

Validate:

* React Hook Form
* Zod
* Supabase Policies

Together.

---

# Final Architecture

```text
Pages

↓

Hooks

↓

Services

↓

Supabase

↓

Database
```

This structure keeps the codebase scalable, maintainable, testable, and easy to extend as products, categories, SEO features, and dashboard functionality grow over time.
