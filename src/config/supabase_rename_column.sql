-- ============================================================================
-- Rename pending_cans to outstanding_cans in hotels table
-- ============================================================================
--
-- Run this in Supabase SQL Editor to rename the column.
-- This ensures consistency between database and app code.
-- ============================================================================

-- Rename column
ALTER TABLE hotels RENAME COLUMN pending_cans TO outstanding_cans;

-- Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'hotels' 
  AND column_name = 'outstanding_cans';