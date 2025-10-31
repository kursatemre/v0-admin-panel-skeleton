-- Rollback script to remove pre-order system from database
-- Run this in your Supabase SQL Editor if you had previously installed the pre-order system

-- Drop orders table
DROP TABLE IF EXISTS orders CASCADE;

-- Remove pre_order_enabled column from products table
ALTER TABLE products DROP COLUMN IF EXISTS pre_order_enabled;

-- Note: This script is safe to run multiple times (uses IF EXISTS)
