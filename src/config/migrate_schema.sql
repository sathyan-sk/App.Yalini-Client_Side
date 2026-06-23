-- ============================================================================
-- Yalini Mobile App - Schema Migration (Apply All Recent Changes)
-- ============================================================================
--
-- Run this in Supabase SQL Editor to apply all schema updates.
-- This is safe to run multiple times (uses IF NOT EXISTS).
--
-- Changes included:
--   1. Add trip_type + payment_mode to trip_details
--   2. Add constraints for new columns
--   3. Ensure RLS policies exist for all tables
-- ============================================================================

-- ============================================================================
-- 1. ADD trip_type, payment_mode, profit, and expense_categories to trip_details
-- ============================================================================
ALTER TABLE trip_details 
  ADD COLUMN IF NOT EXISTS trip_type VARCHAR(20) NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS payment_mode VARCHAR(20) NOT NULL DEFAULT 'cash',
  ADD COLUMN IF NOT EXISTS profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS expense_categories JSONB DEFAULT '{"fuel":0,"toll":0,"food":0,"other":0,"notes":""}'::jsonb;

-- Create index for JSONB column (optional, for faster queries)
CREATE INDEX IF NOT EXISTS idx_trip_details_expense_categories ON trip_details USING GIN (expense_categories);

-- ============================================================================
-- 2. ADD constraints for new columns
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'trip_details_trip_type_check'
  ) THEN
    ALTER TABLE trip_details 
      ADD CONSTRAINT trip_details_trip_type_check 
      CHECK (trip_type IN ('vendor', 'private'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'trip_details_payment_mode_check'
  ) THEN
    ALTER TABLE trip_details 
      ADD CONSTRAINT trip_details_payment_mode_check 
      CHECK (payment_mode IN ('cash', 'online'));
  END IF;
END $$;

-- ============================================================================
-- 3. ENSURE RLS policies exist for all tables
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'businesses' AND policyname = 'businesses_all') THEN
    CREATE POLICY businesses_all ON businesses FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'employees_all') THEN
    CREATE POLICY employees_all ON employees FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'vehicles_all') THEN
    CREATE POLICY vehicles_all ON vehicles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hotels' AND policyname = 'hotels_all') THEN
    CREATE POLICY hotels_all ON hotels FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'driver_records' AND policyname = 'driver_records_all') THEN
    CREATE POLICY driver_records_all ON driver_records FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trip_details' AND policyname = 'trip_details_all') THEN
    CREATE POLICY trip_details_all ON trip_details FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'water_delivery_records' AND policyname = 'water_delivery_records_all') THEN
    CREATE POLICY water_delivery_records_all ON water_delivery_records FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hotel_deliveries' AND policyname = 'hotel_deliveries_all') THEN
    CREATE POLICY hotel_deliveries_all ON hotel_deliveries FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- 4. VERIFY - Show current trip_details structure
-- ============================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'trip_details'
ORDER BY ordinal_position;

-- ============================================================================
-- COMPLETION
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE '✅ Schema migration completed!';
  RAISE NOTICE '📊 trip_details: added trip_type, payment_mode';
  RAISE NOTICE '🔒 RLS policies: verified for all 8 tables';
  RAISE NOTICE '==============================================';
END $$;