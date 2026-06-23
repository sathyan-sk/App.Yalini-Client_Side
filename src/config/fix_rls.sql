-- Fix RLS Policies - Drop and recreate to ensure they work
-- Run this in Supabase SQL Editor if you get "permission denied for schema public"

-- First, ensure schema usage is granted
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;

-- Grant table permissions
GRANT ALL ON businesses, employees, vehicles, hotels, driver_records, trip_details, water_delivery_records, hotel_deliveries TO anon, authenticated, public;

-- Drop existing policies (ignore errors if they don't exist)
DROP POLICY IF EXISTS businesses_all ON businesses;
DROP POLICY IF EXISTS employees_all ON employees;
DROP POLICY IF EXISTS vehicles_all ON vehicles;
DROP POLICY IF EXISTS hotels_all ON hotels;
DROP POLICY IF EXISTS driver_records_all ON driver_records;
DROP POLICY IF EXISTS trip_details_all ON trip_details;
DROP POLICY IF EXISTS water_delivery_records_all ON water_delivery_records;
DROP POLICY IF EXISTS hotel_deliveries_all ON hotel_deliveries;

-- Recreate policies with explicit permissions
CREATE POLICY businesses_all ON businesses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY employees_all ON employees FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY vehicles_all ON vehicles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY hotels_all ON hotels FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY driver_records_all ON driver_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY trip_details_all ON trip_details FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY water_delivery_records_all ON water_delivery_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY hotel_deliveries_all ON hotel_deliveries FOR ALL USING (true) WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('businesses', 'employees', 'vehicles', 'hotels', 'driver_records', 'trip_details', 'water_delivery_records', 'hotel_deliveries')
ORDER BY tablename, policyname;