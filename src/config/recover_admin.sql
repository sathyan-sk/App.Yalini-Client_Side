-- Recover deleted admin employee
-- Run this in Supabase SQL Editor if admin was accidentally deleted

-- Step 1: Remove references to admin from child tables
-- (This only affects seed/demo data - safe to delete)

-- Delete driver records for admin (if any)
DELETE FROM driver_records WHERE employee_id = 'emp_seed_admin';

-- Delete water delivery records for admin (if any)
DELETE FROM water_delivery_records WHERE employee_id = 'emp_seed_admin';

-- Delete trip details for admin's records (already deleted above, but safe)
DELETE FROM trip_details WHERE driver_record_id IN (
  SELECT id FROM driver_records WHERE employee_id = 'emp_seed_admin'
);

-- Delete hotel deliveries for admin's records (already deleted above, but safe)
DELETE FROM hotel_deliveries WHERE water_delivery_record_id IN (
  SELECT id FROM water_delivery_records WHERE employee_id = 'emp_seed_admin'
);

-- Step 2: Remove admin reference from vehicles and hotels
UPDATE vehicles SET assigned_employee_id = NULL, assigned_driver = NULL
WHERE assigned_employee_id = 'emp_seed_admin';

UPDATE hotels SET assigned_employee_id = NULL, assigned_employee_name = NULL
WHERE assigned_employee_id = 'emp_seed_admin';

-- Step 3: Delete the admin employee
DELETE FROM employees WHERE id = 'emp_seed_admin';

-- Step 4: Re-create admin employee
INSERT INTO employees (id, full_name, mobile, business_id, business_name, business_type, pin, role, status, created_at)
VALUES (
  'emp_seed_admin',
  'Yalini Admin',
  '7598326133',
  'biz_seed_city_taxi',
  'City Taxi',
  'taxi'::business_type,
  '0000',
  'admin'::user_role,
  'enabled'::status_type,
  '2026-06-01'::date
);

-- Verify
SELECT id, full_name, mobile, role, status FROM employees WHERE id = 'emp_seed_admin';