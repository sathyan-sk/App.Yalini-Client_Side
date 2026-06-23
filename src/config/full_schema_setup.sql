-- ============================================================================
-- YALINI MOBILE APP - COMPLETE DATABASE SETUP (CLEAN - NO SEED DATA)
-- ============================================================================
-- This script creates the entire database schema with:
--   - All 8 tables with proper constraints
--   - Auto-update triggers for created_at/updated_at
--   - ONLY admin employee (no other seed data)
--   - RLS policies for public access (MVP)
--   - Indexes for performance
--
-- IMPORTANT: Only admin is pre-created. All other data (employees, vehicles,
-- hotels, businesses) must be created by admin through the app.
--
-- Run this ONCE in Supabase SQL Editor to set up the entire database.
-- Safe to re-run (uses IF NOT EXISTS everywhere).
-- ============================================================================

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. CUSTOM TYPES (ENUMS)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE business_type AS ENUM ('taxi', 'water_delivery');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE business_mode AS ENUM ('auto', 'manual');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('enabled', 'disabled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('submitted', 'pending');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'driver', 'staff');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TABLES
-- ============================================================================

-- 3.1 BUSINESSES
CREATE TABLE IF NOT EXISTS businesses (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type business_type NOT NULL,
    mode business_mode NOT NULL DEFAULT 'manual',
    status status_type NOT NULL DEFAULT 'enabled',
    location TEXT,
    employees INTEGER NOT NULL DEFAULT 0,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT businesses_name_check CHECK (length(trim(name)) > 0),
    CONSTRAINT businesses_employees_check CHECK (employees >= 0)
);

-- 3.2 EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    business_id VARCHAR(255) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type business_type NOT NULL,
    pin VARCHAR(4) NOT NULL,
    role user_role NOT NULL DEFAULT 'driver',
    status status_type NOT NULL DEFAULT 'enabled',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT employees_full_name_check CHECK (length(trim(full_name)) > 0),
    CONSTRAINT employees_mobile_check CHECK (mobile ~ '^[0-9]+$'),
    CONSTRAINT employees_pin_check CHECK (pin ~ '^[0-9]{4}$')
);

-- 3.3 VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    status status_type NOT NULL DEFAULT 'enabled',
    notes TEXT,
    assigned_driver VARCHAR(255),
    assigned_employee_id VARCHAR(255) REFERENCES employees(id) ON DELETE SET NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT vehicles_name_check CHECK (length(trim(name)) > 0),
    CONSTRAINT vehicles_number_check CHECK (length(trim(number)) > 0),
    CONSTRAINT vehicles_number_unique UNIQUE (number)
);

-- 3.4 HOTELS
CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rate_per_can INTEGER NOT NULL,
    status status_type NOT NULL DEFAULT 'enabled',
    location TEXT,
    assigned_employee_id VARCHAR(255) REFERENCES employees(id) ON DELETE SET NULL,
    assigned_employee_name VARCHAR(255),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT hotels_name_check CHECK (length(trim(name)) > 0),
    CONSTRAINT hotels_rate_check CHECK (rate_per_can > 0)
);

-- 3.5 DRIVER_RECORDS
CREATE TABLE IF NOT EXISTS driver_records (
    id VARCHAR(255) PRIMARY KEY,
    driver_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    vehicle_id VARCHAR(255) NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    vehicle_name VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status submission_status NOT NULL DEFAULT 'pending',
    avatar_color VARCHAR(7) NOT NULL,
    trips INTEGER NOT NULL DEFAULT 0,
    total_income NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_expense NUMERIC(10, 2) NOT NULL DEFAULT 0,
    settled_to_admin NUMERIC(10, 2) NOT NULL DEFAULT 0,
    balance_shortage NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    per_km_rate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    fuel_expense NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT driver_records_trips_check CHECK (trips >= 0),
    CONSTRAINT driver_records_unique_per_day UNIQUE (employee_id, date)
);

-- 3.6 TRIP_DETAILS
CREATE TABLE IF NOT EXISTS trip_details (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'td_' || gen_random_uuid()::text,
    driver_record_id VARCHAR(255) NOT NULL REFERENCES driver_records(id) ON DELETE CASCADE,
    trip_number INTEGER NOT NULL,
    destination VARCHAR(255) NOT NULL,
    trip_type VARCHAR(20) NOT NULL DEFAULT 'private',
    payment_mode VARCHAR(20) NOT NULL DEFAULT 'cash',
    distance NUMERIC(10, 2) NOT NULL,
    income NUMERIC(10, 2) NOT NULL,
    expense NUMERIC(10, 2) NOT NULL,
    profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    expense_categories JSONB DEFAULT '{"fuel":0,"toll":0,"food":0,"other":0,"notes":""}'::jsonb,
    CONSTRAINT trip_details_trip_number_check CHECK (trip_number > 0),
    CONSTRAINT trip_details_distance_check CHECK (distance >= 0),
    CONSTRAINT trip_details_trip_type_check CHECK (trip_type IN ('vendor', 'private')),
    CONSTRAINT trip_details_payment_mode_check CHECK (payment_mode IN ('cash', 'online')),
    CONSTRAINT trip_details_unique_per_record UNIQUE (driver_record_id, trip_number)
);

-- 3.7 WATER_DELIVERY_RECORDS
CREATE TABLE IF NOT EXISTS water_delivery_records (
    id VARCHAR(255) PRIMARY KEY,
    delivery_person_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(255) NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status submission_status NOT NULL DEFAULT 'pending',
    avatar_color VARCHAR(7) NOT NULL,
    total_hotels INTEGER NOT NULL DEFAULT 0,
    total_cans INTEGER NOT NULL DEFAULT 0,
    total_delivered INTEGER NOT NULL DEFAULT 0,
    total_returned INTEGER NOT NULL DEFAULT 0,
    total_outstanding INTEGER NOT NULL DEFAULT 0,
    total_income NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_expense NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_profit NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT water_delivery_records_hotels_check CHECK (total_hotels >= 0),
    CONSTRAINT water_delivery_records_cans_check CHECK (total_cans >= 0),
    CONSTRAINT water_delivery_records_unique_per_day UNIQUE (employee_id, date)
);

-- 3.8 HOTEL_DELIVERIES
CREATE TABLE IF NOT EXISTS hotel_deliveries (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'hd_' || gen_random_uuid()::text,
    water_delivery_record_id VARCHAR(255) NOT NULL REFERENCES water_delivery_records(id) ON DELETE CASCADE,
    hotel_name VARCHAR(255) NOT NULL,
    location TEXT,
    total_cans INTEGER NOT NULL,
    delivered_cans INTEGER NOT NULL,
    returned_cans INTEGER NOT NULL,
    outstanding_cans INTEGER NOT NULL,
    income NUMERIC(10, 2) NOT NULL,
    expense NUMERIC(10, 2) NOT NULL,
    profit NUMERIC(10, 2) NOT NULL,
    CONSTRAINT hotel_deliveries_cans_check CHECK (total_cans >= 0)
);

-- ============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_businesses_type ON businesses(type);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_employees_business_id ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_employees_business_type ON employees(business_type);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_mobile ON employees(mobile);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_employee ON vehicles(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_assigned_employee ON hotels(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_driver_records_employee ON driver_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_driver_records_vehicle ON driver_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_driver_records_date ON driver_records(date);
CREATE INDEX IF NOT EXISTS idx_driver_records_status ON driver_records(status);
CREATE INDEX IF NOT EXISTS idx_trip_details_driver_record ON trip_details(driver_record_id);
CREATE INDEX IF NOT EXISTS idx_trip_details_expense_categories ON trip_details USING GIN (expense_categories);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_employee ON water_delivery_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_date ON water_delivery_records(date);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_status ON water_delivery_records(status);
CREATE INDEX IF NOT EXISTS idx_hotel_deliveries_record ON hotel_deliveries(water_delivery_record_id);

-- ============================================================================
-- 5. TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ============================================================================

-- 5.1 Auto-update vehicles.updated_at
CREATE OR REPLACE FUNCTION update_vehicle_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_DATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_vehicle_timestamp ON vehicles;
CREATE TRIGGER trigger_update_vehicle_timestamp
    BEFORE UPDATE ON vehicles
    FOR EACH ROW
    EXECUTE FUNCTION update_vehicle_timestamp();

-- 5.2 Auto-update driver_records.created_at (if ever updated)
CREATE OR REPLACE FUNCTION update_driver_record_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_driver_record_timestamp ON driver_records;
CREATE TRIGGER trigger_update_driver_record_timestamp
    BEFORE UPDATE ON driver_records
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_record_timestamp();

-- 5.3 Auto-update water_delivery_records.created_at (if ever updated)
CREATE OR REPLACE FUNCTION update_water_record_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.created_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_water_record_timestamp ON water_delivery_records;
CREATE TRIGGER trigger_update_water_record_timestamp
    BEFORE UPDATE ON water_delivery_records
    FOR EACH ROW
    EXECUTE FUNCTION update_water_record_timestamp();

-- ============================================================================
-- 6. ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_deliveries ENABLE ROW LEVEL SECURITY;

-- Public access policies (MVP - tighten for production)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'businesses' AND policyname = 'businesses_all') THEN
        CREATE POLICY businesses_all ON businesses FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'employees' AND policyname = 'employees_all') THEN
        CREATE POLICY employees_all ON employees FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'vehicles_all') THEN
        CREATE POLICY vehicles_all ON vehicles FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hotels' AND policyname = 'hotels_all') THEN
        CREATE POLICY hotels_all ON hotels FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'driver_records' AND policyname = 'driver_records_all') THEN
        CREATE POLICY driver_records_all ON driver_records FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'trip_details' AND policyname = 'trip_details_all') THEN
        CREATE POLICY trip_details_all ON trip_details FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'water_delivery_records' AND policyname = 'water_delivery_records_all') THEN
        CREATE POLICY water_delivery_records_all ON water_delivery_records FOR ALL USING (true) WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'hotel_deliveries' AND policyname = 'hotel_deliveries_all') THEN
        CREATE POLICY hotel_deliveries_all ON hotel_deliveries FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ============================================================================
-- 6.5 GRANT TABLE PERMISSIONS TO ROLES
-- ============================================================================
-- Grant permissions to anon (unauthenticated) and authenticated roles
-- This is required for RLS policies to work
GRANT SELECT, INSERT, UPDATE, DELETE ON businesses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON employees TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON vehicles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON hotels TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON driver_records TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON trip_details TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON water_delivery_records TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON hotel_deliveries TO anon, authenticated;

-- Grant usage on sequences (for auto-increment if used)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================================
-- 7. SEED DATA (ONLY ADMIN - NO OTHER DATA)
-- ============================================================================

-- 7.1 Insert default business for admin
INSERT INTO businesses (id, name, type, mode, status, employees, created_at)
VALUES ('biz_seed_default', 'Default Business', 'taxi'::business_type, 'manual'::business_mode, 'enabled'::status_type, 1, CURRENT_DATE)
ON CONFLICT (id) DO NOTHING;

-- 7.2 Insert ONLY admin employee (pre-defined, can login with mobile: 7598326133, pin: 0000)
-- Admin must create all other employees, vehicles, hotels through the app
INSERT INTO employees (id, full_name, mobile, business_id, business_name, business_type, pin, role, status, created_at)
VALUES (
    'emp_seed_admin',
    'Yalini Admin',
    '7598326133',
    'biz_seed_default',
    'Default Business',
    'taxi'::business_type,
    '0000',
    'admin'::user_role,
    'enabled'::status_type,
    CURRENT_DATE
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ YALINI MOBILE DATABASE READY!';
    RAISE NOTICE '==============================================';
    RAISE NOTICE '📊 Tables created: 8';
    RAISE NOTICE '👤 Admin login: mobile=7598326133, pin=0000';
    RAISE NOTICE '⚠️  NO other seed data - admin must create:';
    RAISE NOTICE '   - Businesses';
    RAISE NOTICE '   - Employees (drivers/staff)';
    RAISE NOTICE '   - Vehicles';
    RAISE NOTICE '   - Hotels';
    RAISE NOTICE '==============================================';
END $$;
