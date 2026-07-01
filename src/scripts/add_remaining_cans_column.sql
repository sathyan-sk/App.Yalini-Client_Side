-- Migration: Add remaining_cans_at_delivery column to hotel_deliveries table
-- This tracks how many cans were remaining when each hotel delivery was made
-- 
-- Example:
--   Delivery 1 - Hotel Taj: delivered=120, remaining=380 (500 loaded - 120 delivered)
--   Delivery 2 - Hotel Taj: delivered=200, remaining=180 (380 remaining - 200 delivered)
--
-- Run this in your Supabase SQL Editor

ALTER TABLE hotel_deliveries 
ADD COLUMN IF NOT EXISTS remaining_cans_at_delivery INTEGER DEFAULT 0;