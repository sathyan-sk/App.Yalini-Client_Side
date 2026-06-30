-- Migration: Create staff_hotel_assignments table for many-to-many relationship
-- This allows one staff member to be assigned to multiple hotels

-- Create the junction table
CREATE TABLE IF NOT EXISTS staff_hotel_assignments (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  staff_id TEXT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  hotel_id TEXT NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by TEXT REFERENCES employees(id),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(staff_id, hotel_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_staff_hotel_staff_id 
  ON staff_hotel_assignments(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_hotel_hotel_id 
  ON staff_hotel_assignments(hotel_id);
CREATE INDEX IF NOT EXISTS idx_staff_hotel_active 
  ON staff_hotel_assignments(is_active);

-- Migration: Copy existing assignments from hotels.assigned_employee_id
INSERT INTO staff_hotel_assignments (staff_id, hotel_id, assigned_at, is_active)
SELECT 
  h.assigned_employee_id,
  h.id,
  NOW(),
  true
FROM hotels h
WHERE h.assigned_employee_id IS NOT NULL
  AND h.status = 'enabled'
ON CONFLICT (staff_id, hotel_id) DO NOTHING;

-- Add comment
COMMENT ON TABLE staff_hotel_assignments IS 'Junction table for many-to-many relationship between staff and hotels';