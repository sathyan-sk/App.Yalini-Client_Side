-- Migration: Add settlement columns to hotel_deliveries
-- These columns store per-hotel settlement amounts and shortage

-- Add rate_per_can column
ALTER TABLE hotel_deliveries 
ADD COLUMN IF NOT EXISTS rate_per_can numeric DEFAULT 0;

-- Add settled_cash column
ALTER TABLE hotel_deliveries 
ADD COLUMN IF NOT EXISTS settled_cash numeric DEFAULT 0;

-- Add settled_online column
ALTER TABLE hotel_deliveries 
ADD COLUMN IF NOT EXISTS settled_online numeric DEFAULT 0;

-- Add shortage column
ALTER TABLE hotel_deliveries 
ADD COLUMN IF NOT EXISTS shortage numeric DEFAULT 0;

-- Update existing records to have default values
UPDATE hotel_deliveries 
SET rate_per_can = 0 
WHERE rate_per_can IS NULL;

UPDATE hotel_deliveries 
SET settled_cash = 0 
WHERE settled_cash IS NULL;

UPDATE hotel_deliveries 
SET settled_online = 0 
WHERE settled_online IS NULL;

UPDATE hotel_deliveries 
SET shortage = 0 
WHERE shortage IS NULL;