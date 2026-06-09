-- Run these queries in your Supabase SQL Editor to update your settings table:

ALTER TABLE settings ADD COLUMN IF NOT EXISTS use_logo boolean DEFAULT false;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS owner_name text;
