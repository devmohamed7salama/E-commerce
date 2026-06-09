-- Supabase Database Schema
-- Project: WhatsApp-based Product Catalog System

-- Enable pgcrypto extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- 1. CATEGORIES TABLE
create table if not exists categories (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique not null,
    image_url text,
    parent_id uuid references categories(id) on delete cascade,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. PRODUCTS TABLE
create table if not exists products (
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

-- 3. PRODUCT IMAGES TABLE
create table if not exists product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    image_url text not null,
    sort_order integer default 0,
    created_at timestamptz default now()
);

-- 4. PRODUCT COLORS TABLE
create table if not exists product_colors (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    name text not null,
    hex_code text not null,
    created_at timestamptz default now()
);

-- 5. PRODUCT SIZES TABLE
create table if not exists product_sizes (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null references products(id) on delete cascade,
    size_name text not null,
    created_at timestamptz default now()
);

-- 6. HERO SLIDER TABLE
create table if not exists sliders (
    id uuid primary key default gen_random_uuid(),
    title text,
    image_url text not null,
    link_type text not null default 'category',
    link_id uuid,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamptz default now()
);

-- 7. SETTINGS TABLE
create table if not exists settings (
    id integer primary key default 1,
    site_name text,
    site_description text,
    logo_url text,
    use_logo boolean default false,
    owner_name text,
    whatsapp text,
    facebook text,
    instagram text,
    tiktok text,
    hero_title text,
    hero_subtitle text,
    updated_at timestamptz default now()
);

-- 8. PROFILES TABLE (for admin role checking)
create table if not exists profiles (
    id uuid primary key references auth.users on delete cascade,
    email text,
    role text default 'admin',
    created_at timestamptz default now()
);

-- Insert default single row for settings
insert into settings (id)
values (1)
on conflict do nothing;

-- 9. INDEXES
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_slug on products(slug);
create index if not exists idx_categories_slug on categories(slug);
create index if not exists idx_product_images_product on product_images(product_id);
create index if not exists idx_product_colors_product on product_colors(product_id);
create index if not exists idx_product_sizes_product on product_sizes(product_id);

-- 10. UPDATED_AT TRIGGER FUNCTION AND TRIGGERS
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger products_updated_at
before update on products
for each row
execute procedure set_updated_at();

create trigger categories_updated_at
before update on categories
for each row
execute procedure set_updated_at();

-- 11. PROFILE CREATION TRIGGER ON SIGNUP
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, email, role)
    values (new.id, new.email, 'admin');
    return new;
end;
$$;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- 12. ROW LEVEL SECURITY (RLS)
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_colors enable row level security;
alter table product_sizes enable row level security;
alter table sliders enable row level security;
alter table settings enable row level security;
alter table profiles enable row level security;

-- 13. PUBLIC READ POLICIES
create policy "public categories" on categories for select using (true);
create policy "public products" on products for select using (true);
create policy "public product images" on product_images for select using (true);
create policy "public product colors" on product_colors for select using (true);
create policy "public product sizes" on product_sizes for select using (true);
create policy "public sliders" on sliders for select using (true);
create policy "public settings" on settings for select using (true);

-- 14. ADMIN ACCESS POLICIES (AUTHENTICATED WRITE/ALL)
create policy "authenticated categories" on categories for all to authenticated using (true) with check (true);
create policy "authenticated products" on products for all to authenticated using (true) with check (true);
create policy "authenticated product images" on product_images for all to authenticated using (true) with check (true);
create policy "authenticated product colors" on product_colors for all to authenticated using (true) with check (true);
create policy "authenticated product sizes" on product_sizes for all to authenticated using (true) with check (true);
create policy "authenticated sliders" on sliders for all to authenticated using (true) with check (true);
create policy "authenticated settings" on settings for all to authenticated using (true) with check (true);

-- Profiles policies
create policy "Allow users to read their own profile" on profiles for select to authenticated using (auth.uid() = id);
create policy "Allow users to update their own profile" on profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- 15. STORAGE BUCKETS CONFIGURATION (Create buckets if they don't exist)
insert into storage.buckets (id, name, public)
values 
  ('products', 'products', true),
  ('categories', 'categories', true),
  ('sliders', 'sliders', true),
  ('logos', 'logos', true)
on conflict (id) do nothing;

-- 16. STORAGE POLICIES (Drop existing first to avoid errors)
drop policy if exists "Public Access to Buckets" on storage.objects;
drop policy if exists "Authenticated Insert to Buckets" on storage.objects;
drop policy if exists "Authenticated Update to Buckets" on storage.objects;
drop policy if exists "Authenticated Delete to Buckets" on storage.objects;

create policy "Public Access to Buckets" on storage.objects 
  for select using (bucket_id in ('products', 'categories', 'sliders', 'logos'));

create policy "Authenticated Insert to Buckets" on storage.objects 
  for insert to authenticated with check (bucket_id in ('products', 'categories', 'sliders', 'logos'));

create policy "Authenticated Update to Buckets" on storage.objects 
  for update to authenticated with check (bucket_id in ('products', 'categories', 'sliders', 'logos'));

create policy "Authenticated Delete to Buckets" on storage.objects 
  for delete to authenticated using (bucket_id in ('products', 'categories', 'sliders', 'logos'));
