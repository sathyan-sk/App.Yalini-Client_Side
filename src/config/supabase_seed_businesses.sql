-- ============================================================================
-- Yalini Mobile App - One-Time Business Seed Migration
-- ============================================================================
--
-- IMPORTANT: Run this ONCE in Supabase SQL Editor.
-- This creates the 2 pre-configured businesses required for the app to function.
-- Do NOT run this on every startup - it's a one-time database initialization.
--
-- The app will load these businesses from the database on startup.
-- Admin can edit name, mode, and status via the Edit Business screen.
-- Admin CANNOT create new businesses or delete existing ones.
-- Business type (taxi/water_delivery) is LOCKED and cannot be changed.
-- ============================================================================

-- ============================================================================
-- 1. INSERT BUSINESSES (only if they don't exist)
-- ============================================================================
INSERT INTO businesses (id, name, type, mode, status, employees, created_at)
SELECT * FROM (VALUES
    ('biz_seed_city_taxi',        'City Taxi',       'taxi'::business_type,           'manual'::business_mode, 'enabled'::status_type, 0, CURRENT_DATE),
    ('biz_seed_yalini_minerals',  'Yalini Minerals',  'water_delivery'::business_type, 'manual'::business_mode, 'enabled'::status_type, 0, CURRENT_DATE)
) AS v(id, name, type, mode, status, employees, created_at)
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE businesses.id = v.id);

-- ============================================================================
-- 2. VERIFY
-- ============================================================================
SELECT id, name, type, mode, status, employees
FROM businesses
ORDER BY type;