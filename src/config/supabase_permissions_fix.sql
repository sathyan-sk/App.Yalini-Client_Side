-- ============================================================================
-- Fix Table Permissions for anon Role
-- ============================================================================
--
-- Run this in Supabase SQL Editor.
-- Grants SELECT/INSERT/UPDATE/DELETE to anon role on all app tables.
-- ============================================================================

-- Grant permissions on admins table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admins TO anon;

-- Grant permissions on other tables
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vehicles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hotels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.businesses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_details TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_delivery_records TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hotel_deliveries TO anon;

-- Grant usage on sequences (for auto-increment IDs if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Verify
SELECT grantee, table_name, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public'
  AND grantee = 'anon'
ORDER BY table_name, privilege_type;