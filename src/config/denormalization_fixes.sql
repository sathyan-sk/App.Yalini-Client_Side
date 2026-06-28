-- ============================================================================
-- Denormalization Fixes - Keep Related Fields in Sync
-- ============================================================================
--
-- This script adds triggers to automatically maintain denormalized fields:
-- 1. Vehicles: When assigned_employee_id changes, update assigned_driver
-- 2. Hotels: When assigned_employee_id changes, update assigned_employee_name
-- 3. Businesses: When employees count changes, update the businesses table
--
-- Run this in Supabase SQL Editor to add automatic sync.
-- ============================================================================

-- ============================================================================
-- 1. Vehicle Assignment Sync Trigger
-- ============================================================================

-- Function to auto-update assigned_driver when assigned_employee_id changes
CREATE OR REPLACE FUNCTION sync_vehicle_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_employee_id is being set or changed
    IF NEW.assigned_employee_id IS NOT NULL AND 
       (OLD.assigned_employee_id IS NULL OR NEW.assigned_employee_id != OLD.assigned_employee_id) THEN
        
        -- Fetch employee name
        UPDATE vehicles 
        SET assigned_driver = (
            SELECT full_name 
            FROM employees 
            WHERE id = NEW.assigned_employee_id
        )
        WHERE id = NEW.id;
        
    -- If assigned_employee_id is being cleared
    ELSIF NEW.assigned_employee_id IS NULL AND OLD.assigned_employee_id IS NOT NULL THEN
        UPDATE vehicles 
        SET assigned_driver = NULL
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_sync_vehicle_assignment ON vehicles;

-- Create trigger
CREATE TRIGGER trigger_sync_vehicle_assignment
    AFTER UPDATE OF assigned_employee_id ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION sync_vehicle_assignment();

-- ============================================================================
-- 2. Hotel Assignment Sync Trigger
-- ============================================================================

-- Function to auto-update assigned_employee_name when assigned_employee_id changes
CREATE OR REPLACE FUNCTION sync_hotel_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_employee_id is being set or changed
    IF NEW.assigned_employee_id IS NOT NULL AND 
       (OLD.assigned_employee_id IS NULL OR NEW.assigned_employee_id != OLD.assigned_employee_id) THEN
        
        -- Fetch employee name
        UPDATE hotels 
        SET assigned_employee_name = (
            SELECT full_name 
            FROM employees 
            WHERE id = NEW.assigned_employee_id
        )
        WHERE id = NEW.id;
        
    -- If assigned_employee_id is being cleared
    ELSIF NEW.assigned_employee_id IS NULL AND OLD.assigned_employee_id IS NOT NULL THEN
        UPDATE hotels 
        SET assigned_employee_name = NULL
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_sync_hotel_assignment ON hotels;

-- Create trigger
CREATE TRIGGER trigger_sync_hotel_assignment
    AFTER UPDATE OF assigned_employee_id ON hotels
    FOR EACH ROW
    EXECUTE FUNCTION sync_hotel_assignment();

-- ============================================================================
-- 3. Fix Existing Data - Sync Current Assignments
-- ============================================================================

-- Fix vehicles with assigned_employee_id but missing assigned_driver
UPDATE vehicles v
SET assigned_driver = e.full_name
FROM employees e
WHERE v.assigned_employee_id = e.id
  AND (v.assigned_driver IS NULL OR v.assigned_driver != e.full_name);

-- Fix hotels with assigned_employee_id but missing assigned_employee_name
UPDATE hotels h
SET assigned_employee_name = e.full_name
FROM employees e
WHERE h.assigned_employee_id = e.id
  AND (h.assigned_employee_name IS NULL OR h.assigned_employee_name != e.full_name);

-- ============================================================================
-- 4. Verification
-- ============================================================================

-- Show vehicles with assignments
SELECT 
    v.id,
    v.name,
    v.number,
    v.assigned_employee_id,
    v.assigned_driver,
    e.full_name as employee_name,
    CASE 
        WHEN v.assigned_driver = e.full_name THEN '✅ Synced'
        WHEN v.assigned_employee_id IS NULL THEN '⚪ Unassigned'
        ELSE '❌ Mismatch'
    END as sync_status
FROM vehicles v
LEFT JOIN employees e ON v.assigned_employee_id = e.id
WHERE v.assigned_employee_id IS NOT NULL;

-- Show hotels with assignments
SELECT 
    h.id,
    h.name,
    h.assigned_employee_id,
    h.assigned_employee_name,
    e.full_name as employee_name,
    CASE 
        WHEN h.assigned_employee_name = e.full_name THEN '✅ Synced'
        WHEN h.assigned_employee_id IS NULL THEN '⚪ Unassigned'
        ELSE '❌ Mismatch'
    END as sync_status
FROM hotels h
LEFT JOIN employees e ON h.assigned_employee_id = e.id
WHERE h.assigned_employee_id IS NOT NULL;

-- Summary
SELECT 
    'Vehicles' as entity,
    COUNT(*) FILTER (WHERE assigned_employee_id IS NOT NULL) as assigned,
    COUNT(*) FILTER (WHERE assigned_driver IS NOT NULL) as with_name,
    COUNT(*) FILTER (WHERE assigned_employee_id IS NOT NULL AND assigned_driver IS NULL) as missing_name
FROM vehicles
UNION ALL
SELECT 
    'Hotels',
    COUNT(*) FILTER (WHERE assigned_employee_id IS NOT NULL),
    COUNT(*) FILTER (WHERE assigned_employee_name IS NOT NULL),
    COUNT(*) FILTER (WHERE assigned_employee_id IS NOT NULL AND assigned_employee_name IS NULL)
FROM hotels;