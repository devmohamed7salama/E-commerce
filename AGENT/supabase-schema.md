# supabase-schema.md

## Project Type

Catalog / Store Website

Features:

* Categories & Sub Categories
* Products
* Multiple Product Images
* Product Colors
* Hero Slider
* Settings
* SEO
* WhatsApp Ordering
* Admin Dashboard
* Public Frontend

---

# IMPORTANT

Enable:

```sql
create extension if not exists pgcrypto;
```

---

# CATEGORIES

```sql
create table categories (
    id uuid primary key default gen_random_uuid(),

    name text not null,
    slug text unique not null,

    image_url text,

    parent_id uuid references categories(id) on delete cascade,

    is_active boolean default true,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

---

# PRODUCTS

```sql
create table products (
    id uuid primary key default gen_random_uuid(),

    category_id uuid not null references categories(id) on delete restrict,

    name text not null,
    slug text unique not null,

    short_description text,
    description text,

    price numeric(10,2) not null default 0,
    sale_price numeric(10,2),

    thumbnail_url text not null,

    is_featured boolean default false,
    is_active boolean default true,

    show_stock boolean default false,
    fake_stock integer default 0,

    show_offer_timer boolean default false,
    offer_end_date timestamptz,

    meta_title text,
    meta_description text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
```

---

# PRODUCT IMAGES

```sql
create table product_images (
    id uuid primary key default gen_random_uuid(),

    product_id uuid not null references products(id) on delete cascade,

    image_url text not null,

    sort_order integer default 0,

    created_at timestamptz default now()
);
```

---

# PRODUCT COLORS

```sql
create table product_colors (
    id uuid primary key default gen_random_uuid(),

    product_id uuid not null references products(id) on delete cascade,

    name text not null,

    hex_code text not null,

    created_at timestamptz default now()
);
```

---

# PRODUCT SIZES

Optional

```sql
create table product_sizes (
    id uuid primary key default gen_random_uuid(),

    product_id uuid not null references products(id) on delete cascade,

    size_name text not null,

    created_at timestamptz default now()
);
```

Examples:

```text
S
M
L
XL
XXL
```

---

# HERO SLIDER

```sql
create table sliders (
    id uuid primary key default gen_random_uuid(),

    title text,

    image_url text not null,

    link_type text not null default 'category',

    link_id uuid,

    sort_order integer default 0,

    is_active boolean default true,

    created_at timestamptz default now()
);
```

---

# SETTINGS

Single Row Table

```sql
create table settings (
    id integer primary key default 1,

    site_name text,

    site_description text,

    logo_url text,

    whatsapp text,

    facebook text,

    instagram text,

    tiktok text,

    hero_title text,

    hero_subtitle text,

    updated_at timestamptz default now()
);
```

Insert first row:

```sql
insert into settings(id)
values(1)
on conflict do nothing;
```

---

# INDEXES

```sql
create index idx_products_category
on products(category_id);

create index idx_products_slug
on products(slug);

create index idx_categories_slug
on categories(slug);

create index idx_product_images_product
on product_images(product_id);

create index idx_product_colors_product
on product_colors(product_id);

create index idx_product_sizes_product
on product_sizes(product_id);
```

---

# UPDATED_AT TRIGGER

```sql
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
new.updated_at = now();
return new;
end;
$$;
```

---

```sql
create trigger products_updated_at
before update on products
for each row
execute procedure set_updated_at();
```

---

```sql
create trigger categories_updated_at
before update on categories
for each row
execute procedure set_updated_at();
```

---

# STORAGE BUCKETS

Create manually:

```text
products
categories
slider
logos
```

Public Buckets:

```text
products
categories
slider
logos
```

---

# RLS

Enable RLS

```sql
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_colors enable row level security;
alter table product_sizes enable row level security;
alter table sliders enable row level security;
alter table settings enable row level security;
```

---

# PUBLIC READ

Frontend visitors can read only.

```sql
create policy "public categories"
on categories
for select
using (true);
```

```sql
create policy "public products"
on products
for select
using (true);
```

```sql
create policy "public product images"
on product_images
for select
using (true);
```

```sql
create policy "public product colors"
on product_colors
for select
using (true);
```

```sql
create policy "public product sizes"
on product_sizes
for select
using (true);
```

```sql
create policy "public sliders"
on sliders
for select
using (true);
```

```sql
create policy "public settings"
on settings
for select
using (true);
```

---

# ADMIN ACCESS

Dashboard uses authenticated users only.

```sql
create policy "authenticated categories"
on categories
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated products"
on products
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated product images"
on product_images
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated product colors"
on product_colors
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated product sizes"
on product_sizes
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated sliders"
on sliders
for all
to authenticated
using (true)
with check (true);
```

```sql
create policy "authenticated settings"
on settings
for all
to authenticated
using (true)
with check (true);
```

---

# RECOMMENDED FRONTEND ROUTES

```text
/

/products

/product/:slug

/category/:slug

/admin/login

/admin/dashboard

/admin/products

/admin/categories

/admin/sliders

/admin/settings
```

---

# FINAL NOTES

* Use UUID everywhere.
* Use slug instead of IDs in URLs.
* Use Supabase Auth for dashboard login.
* Do not expose Service Role Key in frontend.
* Use only ANON KEY in React.
* Upload images to Supabase Storage.
* Cache product queries using TanStack Query.
* Use meta_title and meta_description dynamically with React Helmet.
