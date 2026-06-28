-- ============================================================================
-- Fix RLS Policies for admins table
-- ============================================================================
--
-- Run this in Supabase SQL Editor to allow the app to read/write admins.
-- ============================================================================

-- Disable RLS on admins table (simplest for internal app)
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- OR if you want RLS enabled with proper policies:
-- ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (anon key)
-- CREATE POLICY "Allow all for anon" ON admins
--   FOR ALL
--   TO anon
--   USING (true)
--   WITH CHECK (true);

-- Verify
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'admins';