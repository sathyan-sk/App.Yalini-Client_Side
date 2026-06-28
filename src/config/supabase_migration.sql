-- ============================================================================
-- Yalini Mobile App - Database Migration Script
-- ============================================================================
--
-- This migration adds columns that were defined in the new schema but
-- are missing from your current database.
-- 
-- Run this entire script in Supabase SQL Editor.
-- Safe to run multiple times (uses IF NOT EXISTS patterns).
-- ============================================================================

-- ============================================================================
-- 1. HOTELS: Add missing columns
-- ============================================================================

-- Add address column (TEXT, not enum - just a string)
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Add pending_cans column (integer, tracks non-returned cans)
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS pending_cans INTEGER NOT NULL DEFAULT 0;

-- Add constraint to ensure pending_cans is never negative
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'hotels_pending_cans_check' 
    AND conrelid = 'hotels'::regclass
  ) THEN
    ALTER TABLE hotels 
      ADD CONSTRAINT hotels_pending_cans_check CHECK (pending_cans >= 0);
  END IF;
END $$;

-- Add updated_at column (DATE type for tracking last modification)
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS updated_at DATE NOT NULL DEFAULT CURRENT_DATE;

-- Create index for pending_cans queries
CREATE INDEX IF NOT EXISTS idx_hotels_pending_cans ON hotels(pending_cans);

-- ============================================================================
-- 2. VEHICLES: Add assignment_status column
-- ============================================================================

-- IMPORTANT: assignment_status is VARCHAR, NOT the status_type enum.
-- status_type only accepts 'enabled'/'disabled'.
-- assignment_status accepts 'available'/'assigned'/'locked'.
ALTER TABLE vehicles 
  ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(20) NOT NULL DEFAULT 'available';

-- Add check constraint to enforce valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'vehicles_assignment_status_check' 
    AND conrelid = 'vehicles'::regclass
  ) THEN
    ALTER TABLE vehicles 
      ADD CONSTRAINT vehicles_assignment_status_check 
      CHECK (assignment_status IN ('available', 'assigned', 'locked'));
  END IF;
END $$;

-- Create index for assignment_status queries
CREATE INDEX IF NOT EXISTS idx_vehicles_assignment_status ON vehicles(assignment_status);

-- ============================================================================
-- 3. UPDATE SEED DATA: Set initial assignment_status for existing vehicles
-- ============================================================================

-- Set vehicles with assigned drivers to 'assigned', others to 'available'
UPDATE vehicles 
SET assignment_status = 'assigned' 
WHERE assigned_employee_id IS NOT NULL 
  AND assignment_status IS NULL;

UPDATE vehicles 
SET assignment_status = 'available' 
WHERE assignment_status IS NULL;

-- ============================================================================
-- 4. VERIFY: Check what was added
-- ============================================================================

-- Check hotels columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'hotels'
ORDER BY ordinal_position;

-- Check vehicles columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'vehicles'
ORDER BY ordinal_position;

-- Show current vehicle assignment statuses
SELECT id, name, number, assignment_status, assigned_driver
FROM vehicles
ORDER BY name;