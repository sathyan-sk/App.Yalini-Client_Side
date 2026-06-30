-- Migration: Add settlement fields to driver_records and trip_details

-- Add total_cash_settled and total_online_settled to driver_records
ALTER TABLE driver_records 
ADD COLUMN IF NOT EXISTS total_cash_settled numeric DEFAULT 0;

ALTER TABLE driver_records 
ADD COLUMN IF NOT EXISTS total_online_settled numeric DEFAULT 0;

-- Add settled_cash and settled_online to trip_details
ALTER TABLE trip_details 
ADD COLUMN IF NOT EXISTS settled_cash numeric DEFAULT 0;

ALTER TABLE trip_details 
ADD COLUMN IF NOT EXISTS settled_online numeric DEFAULT 0;

-- Update existing records to have default values
UPDATE driver_records SET total_cash_settled = 0 WHERE total_cash_settled IS NULL;
UPDATE driver_records SET total_online_settled = 0 WHERE total_online_settled IS NULL;
UPDATE trip_details SET settled_cash = 0 WHERE settled_cash IS NULL;
UPDATE trip_details SET settled_online = 0 WHERE settled_online IS NULL;