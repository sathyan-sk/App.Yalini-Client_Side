-- ============================================================================
-- Fix Employee Role Assignment Issues
-- ============================================================================
--
-- This script fixes employees with mismatched roles:
-- - Taxi business employees should have role = 'driver'
-- - Water delivery employees should have role = 'staff'
--
-- Run this in Supabase SQL Editor to fix existing data.
-- ============================================================================

-- First, show current mismatches
SELECT 
    e.id,
    e.full_name,
    e.mobile,
    e.business_type,
    e.role as current_role,
    CASE 
        WHEN e.business_type = 'taxi' THEN 'driver'
        WHEN e.business_type = 'water_delivery' THEN 'staff'
        ELSE e.role
    END as expected_role,
    b.name as business_name
FROM employees e
JOIN businesses b ON e.business_id = b.id
WHERE 
    (e.business_type = 'taxi' AND e.role != 'driver')
    OR 
    (e.business_type = 'water_delivery' AND e.role != 'staff');

-- Fix taxi employees with wrong role
UPDATE employees 
SET role = 'driver'::user_role
WHERE business_type = 'taxi' 
  AND role != 'driver';

-- Fix water delivery employees with wrong role
UPDATE employees 
SET role = 'staff'::user_role
WHERE business_type = 'water_delivery' 
  AND role != 'staff';

-- Verify fix
SELECT 
    e.id,
    e.full_name,
    e.business_type,
    e.role,
    b.name as business_name
FROM employees e
JOIN businesses b ON e.business_id = b.id
ORDER BY e.business_type, e.role;

-- Summary
SELECT 
    business_type,
    role,
    COUNT(*) as count
FROM employees
GROUP BY business_type, role
ORDER BY business_type, role;

-- ============================================================================
-- Add Constraint to Prevent Future Mismatches
-- ============================================================================

-- Drop existing constraint if it exists
DO $$ BEGIN
    ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_role_business_type_check;
EXCEPTION
    WHEN others THEN null;
END $$;

-- Add check constraint to ensure role matches business_type
ALTER TABLE employees ADD CONSTRAINT employees_role_business_type_check
    CHECK (
        (business_type = 'taxi' AND role = 'driver')
        OR 
        (business_type = 'water_delivery' AND role = 'staff')
        OR 
        (role = 'admin')  -- Admin can be in any business type
    );

-- Verify constraint was added
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'employees'::regclass 
  AND conname = 'employees_role_business_type_check';