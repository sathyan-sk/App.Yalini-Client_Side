-- ============================================================================
-- Concurrency Control - Prevent Race Conditions
-- ============================================================================
--
-- Adds assignment_status column to track asset state:
-- - 'available': Ready for assignment
-- - 'assigned': Currently assigned to an employee
-- - 'assigning': Temporary lock during assignment (prevents race conditions)
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Add assignment_status to vehicles
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(50) NOT NULL DEFAULT 'available';
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS assignment_locked_at TIMESTAMP;

-- Add assignment_status to hotels  
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS assignment_status VARCHAR(50) NOT NULL DEFAULT 'available';
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS assignment_locked_at TIMESTAMP;

-- Create function to safely assign with concurrency control
CREATE OR REPLACE FUNCTION safe_assign_asset(
  asset_table TEXT,
  asset_id VARCHAR(255),
  employee_id VARCHAR(255),
  lock_timeout INTEGER DEFAULT 5
) RETURNS BOOLEAN AS $$
DECLARE
  current_status VARCHAR(50);
  locked_at TIMESTAMP;
BEGIN
  -- Get current status
  EXECUTE format('SELECT assignment_status, assignment_locked_at FROM %I WHERE id = %L', asset_table, asset_id)
  INTO current_status, locked_at;
  
  -- Check if locked by another process (within timeout)
  IF current_status = 'assigning' AND locked_at IS NOT NULL THEN
    IF EXTRACT(EPOCH FROM (NOW() - locked_at)) < lock_timeout THEN
      RAISE EXCEPTION 'Asset is being assigned by another user. Please wait.';
    END IF;
  END IF;
  
  -- Set to assigning (lock it)
  EXECUTE format('UPDATE %I SET assignment_status = %L, assignment_locked_at = NOW() WHERE id = %L', 
    asset_table, 'assigning', asset_id);
  
  -- Complete the assignment
  IF asset_table = 'vehicles' THEN
    EXECUTE format('UPDATE %I SET assigned_employee_id = %L, assignment_status = %L, assignment_locked_at = NULL WHERE id = %L',
      asset_table, employee_id, 'assigned', asset_id);
  ELSIF asset_table = 'hotels' THEN
    -- For hotels, we need employee name too - this is handled in app code
    EXECUTE format('UPDATE %I SET assigned_employee_id = %L, assignment_status = %L, assignment_locked_at = NULL WHERE id = %L',
      asset_table, employee_id, 'assigned', asset_id);
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    -- Release lock on error
    EXECUTE format('UPDATE %I SET assignment_status = %L, assignment_locked_at = NULL WHERE id = %L',
      asset_table, 'available', asset_id);
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON FUNCTION safe_assign_asset TO anon;

-- Update existing data
UPDATE vehicles SET assignment_status = 'available' WHERE assignment_status IS NULL;
UPDATE hotels SET assignment_status = 'available' WHERE assignment_status IS NULL;

-- Verify
SELECT 'vehicles' as table_name, assignment_status, COUNT(*) as count 
FROM vehicles GROUP BY assignment_status
UNION ALL
SELECT 'hotels', assignment_status, COUNT(*) 
FROM hotels GROUP BY assignment_status;