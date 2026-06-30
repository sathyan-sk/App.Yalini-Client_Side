-- ============================================================================
-- Yalini Mobile App - Multi-Hotel Assignment Schema Migration
-- ============================================================================
--
-- This migration finalizes the multi-hotel assignment feature for water delivery staff.
-- It creates the staff_hotel_assignments junction table (N:N relationship) and
-- migrates existing single-assignment data into the new structure.
--
-- Run this ONCE in Supabase SQL Editor after the app code changes are deployed.
-- Safe to re-run (uses IF NOT EXISTS / idempotent patterns).
-- ============================================================================

-- ============================================================================
-- 1. CREATE STAFF_HOTEL_ASSIGNMENTS JUNCTION TABLE
-- ============================================================================
-- This enables N:N relationship: one staff → many hotels, one hotel → many staff
CREATE TABLE IF NOT EXISTS staff_hotel_assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  staff_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  hotel_id TEXT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by TEXT REFERENCES employees(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(staff_id, hotel_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_staff_hotel_staff_id 
  ON staff_hotel_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_hotel_hotel_id 
  ON staff_hotel_assignments(hotel_id);
CREATE INDEX IF NOT EXISTS idx_staff_hotel_active 
  ON staff_hotel_assignments(is_active);

-- ============================================================================
-- 2. MIGRATE EXISTING SINGLE ASSIGNMENTS TO JUNCTION TABLE
-- ============================================================================
-- Copies data from hotels.assigned_employee_id into staff_hotel_assignments
INSERT INTO staff_hotel_assignments (staff_id, hotel_id, assigned_at, is_active)
SELECT 
  h.assigned_employee_id,
  h.id,
  NOW(),
  true
FROM hotels h
WHERE h.assigned_employee_id IS NOT NULL
  AND h.status = 'enabled'
ON CONFLICT (staff_id, hotel_id) DO NOTHING;

-- ============================================================================
-- 3. VERIFY MIGRATION
-- ============================================================================
SELECT 'staff_hotel_assignments' as table_name, COUNT(*) as count FROM staff_hotel_assignments
UNION ALL
SELECT 'hotels (with assignment)', COUNT(*) FROM hotels WHERE assigned_employee_id IS NOT NULL;

-- Show sample assignments
SELECT 
  sha.staff_id,
  e.full_name as staff_name,
  sha.hotel_id,
  h.name as hotel_name,
  sha.assigned_at,
  sha.is_active
FROM staff_hotel_assignments sha
JOIN employees e ON sha.staff_id = e.id
JOIN hotels h ON sha.hotel_id = h.id
WHERE sha.is_active = true
ORDER BY e.full_name, h.name;

-- ============================================================================
-- COMPLETION
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ Multi-Hotel Schema Migration Complete!';
    RAISE NOTICE '📊 staff_hotel_assignments table created';
    RAISE NOTICE '🔄 Existing assignments migrated';
    RAISE NOTICE '==============================================';
END $$;