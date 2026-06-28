-- ============================================================================
-- Enable Row Level Security (RLS) - Production Grade
-- ============================================================================
--
-- This enables RLS with proper policies for an internal business app.
-- The app uses its own authentication (mobile + PIN), so RLS policies
-- allow full access to the anon role since auth is handled at app level.
--
-- Run this AFTER running supabase_complete_setup.sql
-- ============================================================================

-- ============================================================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_deliveries ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. CREATE POLICIES FOR ADMINS TABLE
-- ============================================================================
-- Admins: Allow all operations for authenticated app users
CREATE POLICY "Allow all for anon on admins" ON admins
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 3. CREATE POLICIES FOR EMPLOYEES TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on employees" ON employees
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 4. CREATE POLICIES FOR VEHICLES TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on vehicles" ON vehicles
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 5. CREATE POLICIES FOR HOTELS TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on hotels" ON hotels
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 6. CREATE POLICIES FOR BUSINESSES TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on businesses" ON businesses
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 7. CREATE POLICIES FOR DRIVER_RECORDS TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on driver_records" ON driver_records
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 8. CREATE POLICIES FOR TRIP_DETAILS TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on trip_details" ON trip_details
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 9. CREATE POLICIES FOR WATER_DELIVERY_RECORDS TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on water_delivery_records" ON water_delivery_records
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 10. CREATE POLICIES FOR HOTEL_DELIVERIES TABLE
-- ============================================================================
CREATE POLICY "Allow all for anon on hotel_deliveries" ON hotel_deliveries
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 11. VERIFY RLS IS ENABLED
-- ============================================================================
SELECT tablename, rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'admins', 'employees', 'vehicles', 'hotels', 'businesses',
    'driver_records', 'trip_details', 'water_delivery_records', 'hotel_deliveries'
  )
ORDER BY tablename;