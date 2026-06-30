-- Migration: Add settlement columns to water_delivery_records
-- These columns store the total settlement amounts (cash + online) for a delivery person's session

-- Add total_settled column (combined cash + online)
ALTER TABLE water_delivery_records 
ADD COLUMN IF NOT EXISTS total_settled numeric DEFAULT 0;

-- Add total_cash_settled column (cash only)
ALTER TABLE water_delivery_records 
ADD COLUMN IF NOT EXISTS total_cash_settled numeric DEFAULT 0;

-- Add total_online_settled column (online only)
ALTER TABLE water_delivery_records 
ADD COLUMN IF NOT EXISTS total_online_settled numeric DEFAULT 0;

-- Update existing records to have default values
UPDATE water_delivery_records 
SET total_settled = 0 
WHERE total_settled IS NULL;

UPDATE water_delivery_records 
SET total_cash_settled = 0 
WHERE total_cash_settled IS NULL;

UPDATE water_delivery_records 
SET total_online_settled = 0 
WHERE total_online_settled IS NULL;