-- Migration: Add balance_shortage column to driver_records
-- This column stores the shortage amount (profit - settled_to_admin)

ALTER TABLE driver_records 
ADD COLUMN IF NOT EXISTS balance_shortage numeric DEFAULT 0;

-- Update existing records to have default value
UPDATE driver_records 
SET balance_shortage = 0 
WHERE balance_shortage IS NULL;