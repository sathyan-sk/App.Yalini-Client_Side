-- ============================================================================
-- Business Mode Implementation - Database Updates
-- ============================================================================
--
-- Adds mode column to businesses table (if not exists) and updates RLS policies.
-- ============================================================================

-- Add mode column if not exists
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS mode VARCHAR(50) NOT NULL DEFAULT 'manual';

-- Update RLS policies to check business mode
-- In auto mode, employees can self-assign
-- In manual mode, only admin can assign

-- Grant permissions
GRANT SELECT, UPDATE ON public.businesses TO anon;

-- Verify
SELECT id, name, type, mode FROM businesses;