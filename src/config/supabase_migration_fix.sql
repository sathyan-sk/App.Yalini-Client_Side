-- ============================================================================
-- Yalini Mobile App - Database Migration FIX
-- ============================================================================
--
-- Run this ENTIRE script in Supabase SQL Editor.
-- Safe to run multiple times.
-- ============================================================================

-- ============================================================================
-- 1. FIX VEHICLES: Fix assignment_status column type
-- ============================================================================

-- Drop constraints and default first
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_assignment_status_check;
ALTER TABLE vehicles ALTER COLUMN assignment_status DROP DEFAULT;

-- Drop and recreate the column as VARCHAR (not enum)
ALTER TABLE vehicles DROP COLUMN IF EXISTS assignment_status;
ALTER TABLE vehicles 
  ADD COLUMN assignment_status VARCHAR(20) NOT NULL DEFAULT 'available';

-- Add check constraint for valid values
ALTER TABLE vehicles 
  ADD CONSTRAINT vehicles_assignment_status_check 
  CHECK (assignment_status IN ('available', 'assigned', 'locked'));

-- Update existing vehicles to correct statuses
UPDATE vehicles 
SET assignment_status = 'assigned' 
WHERE assigned_employee_id IS NOT NULL;

-- ============================================================================
-- 2. HOTELS: Add missing columns (idempotent)
-- ============================================================================

-- Add address column
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS address TEXT;

-- Add pending_cans column
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS pending_cans INTEGER NOT NULL DEFAULT 0;

-- Drop and re-add constraint to ensure it exists
ALTER TABLE hotels DROP CONSTRAINT IF EXISTS hotels_pending_cans_check;
ALTER TABLE hotels 
  ADD CONSTRAINT hotels_pending_cans_check CHECK (pending_cans >= 0);

-- Add updated_at column for tracking modifications
ALTER TABLE hotels 
  ADD COLUMN IF NOT EXISTS updated_at DATE NOT NULL DEFAULT CURRENT_DATE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_assignment_status ON vehicles(assignment_status);
CREATE INDEX IF NOT EXISTS idx_hotels_pending_cans ON hotels(pending_cans);

-- ============================================================================
-- 3. VERIFY
-- ============================================================================

-- Check vehicles with their assignment status
SELECT id AS vehicle_id, name, number, assignment_status, 
       assigned_driver, assigned_employee_id
FROM vehicles
ORDER BY name;

-- Check hotels with new columns
SELECT id AS hotel_id, name, pending_cans, 
       CASE WHEN address IS NOT NULL THEN 'Yes' ELSE 'No' END AS has_address
FROM hotels
ORDER BY name;