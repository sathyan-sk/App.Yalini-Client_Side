-- ============================================================================
-- Yalini Mobile App - Complete Database Setup
-- ============================================================================
--
-- Run this ONCE in Supabase SQL Editor to set up the entire database.
-- This creates all tables, disables RLS, and inserts default data.
-- ============================================================================

-- ============================================================================
-- 1. DISABLE RLS ON ALL TABLES (required for app to work with anon key)
-- ============================================================================
ALTER TABLE IF EXISTS admins DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hotels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS businesses DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS driver_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS trip_details DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS water_delivery_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS hotel_deliveries DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. CREATE ADMINS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    pin VARCHAR(4) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'enabled',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Insert default admin
INSERT INTO admins (id, full_name, mobile, pin, status, created_at)
VALUES ('admin_001', 'Yalini Admin', '7598326133', '0000', 'enabled', CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. CREATE BUSINESSES TABLE (if not exists)
-- ============================================================================
CREATE TABLE IF NOT EXISTS businesses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    mode VARCHAR(50) NOT NULL DEFAULT 'manual',
    status VARCHAR(50) NOT NULL DEFAULT 'enabled',
    employees INTEGER NOT NULL DEFAULT 0,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Insert default businesses
INSERT INTO businesses (id, name, type, mode, status, employees, created_at)
VALUES
  ('biz_seed_city_taxi', 'City Taxi', 'taxi', 'manual', 'enabled', 0, CURRENT_DATE),
  ('biz_seed_yalini_minerals', 'Yalini Minerals', 'water_delivery', 'manual', 'enabled', 0, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. VERIFY
-- ============================================================================
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'businesses', COUNT(*) FROM businesses;