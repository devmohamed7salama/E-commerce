# supabase-integration-env.md

# Goal

Standardize Supabase integration in a React (Vite) frontend project.

This file defines:

* Environment variables
* Supabase client setup
* File locations
* Security rules
* Best practices

---

# 1. Environment Variables (.env)

## File Location

```text
root of project
```

Same level as:

```text
package.json
vite.config.js
```

---

## File Name

```text
.env
```

---

## Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co

VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## RULES (IMPORTANT)

### Allowed in frontend:

* VITE_SUPABASE_URL
* VITE_SUPABASE_ANON_KEY

---

### Forbidden in frontend:

```text
SERVICE_ROLE_KEY ❌
DATABASE PASSWORD ❌
PRIVATE KEYS ❌
```

Never expose them in React.

---

# 2. Supabase Client Setup

## File Location

```text
src/app/supabase.js
```

---

## Responsibility

* Create Supabase client
* Export it globally
* No business logic here

---

## Code

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
```

---

# 3. Project Structure (Supabase Layer)

```text
src/
│
├── app/
│   └── supabase.js   ✅ Supabase client only
│
├── services/
│   ├── productService.js
│   ├── categoryService.js
│   ├── authService.js
│   ├── sliderService.js
│   ├── settingsService.js
│   └── storageService.js
│
├── hooks/
│   ├── useProducts.js
│   ├── useCategories.js
│   ├── useProduct.js
│   ├── useSliders.js
│   └── useSettings.js
```

---

# 4. Data Flow Rule

Always follow:

```text
Component → Hook → Service → Supabase
```

---

## Example

### UI Layer

```text
ProductsPage
```

↓

### Hook Layer

```text
useProducts()
```

↓

### Service Layer

```text
getProducts()
```

↓

### Supabase

```text
.from('products').select('*')
```

---

# 5. Service Layer Pattern

## Example: Product Service

```javascript
import { supabase } from "../app/supabase";

export async function getProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) throw error;

  return data;
}
```

---

## Rules

* No React code inside services
* No UI logic
* Only data access
* Always return clean data

---

# 6. Storage Setup

## Buckets (Supabase Dashboard)

Create manually:

```text
products
categories
sliders
logos
```

---

## File Upload Location

```text
src/services/storageService.js
```

---

## Upload Rule

* Upload file → get URL → store in DB
* Never store raw file in database

---

## Example

```javascript
import { supabase } from "../app/supabase";

export async function uploadImage(file, bucket) {
  const fileName = `${Date.now()}-${file.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) throw error;

  return data.path;
}
```

---

# 7. Authentication Setup

## File

```text
src/services/authService.js
```

---

## Login Example

```javascript
import { supabase } from "../app/supabase";

export async function login(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
```

---

## Session Check

```javascript
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
```

---

# 8. Admin Access Rule (CRITICAL)

Do NOT rely only on Supabase Auth.

You MUST use:

```text
profiles table
```

from database.

---

## Role Check

```text
role = "admin"
```

Only admins can access dashboard.

---

# 9. React Integration Rules

## Never do this ❌

```javascript
useEffect(() => {
  supabase.from(...)
}, []);
```

---

## Always do this ✅

```javascript
useProducts()
```

---

# 10. Recommended Query Pattern

Use TanStack Query:

```javascript
useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});
```

---

# 11. Error Handling Rule

Always wrap service calls:

```javascript
try {
  const data = await getProducts();
} catch (error) {
  console.error(error.message);
}
```

Never ignore errors.

---

# 12. Security Rules

## RLS must be enabled

* Public can READ only
* Admin can CREATE/UPDATE/DELETE

---

## Never:

* expose service role key
* bypass RLS from frontend
* trust client-side validation

---

# 13. Performance Rules

* Cache queries using TanStack Query
* Avoid repeated Supabase calls
* Use pagination for large datasets

---

# 14. Final Architecture

```text
React UI
   ↓
Hooks (TanStack Query)
   ↓
Services (Business/Data Layer)
   ↓
Supabase Client
   ↓
Database + Storage
```

---

# RESULT

This setup ensures:

* Clean architecture
* Secure Supabase usage
* Scalable frontend
* Easy debugging
* Production readiness
