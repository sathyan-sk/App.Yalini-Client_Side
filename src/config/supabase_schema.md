-- ============================================================================
-- Yalini Mobile App - Supabase Database Schema (FINAL)
-- ============================================================================
--
-- This is the COMPLETE schema matching all Supabase service implementations.
-- Uses VARCHAR primary keys to match the application's string-based IDs
-- (e.g., 'biz_seed_city_taxi', 'emp_seed_ramesh', 'veh_seed_swift_dzire').
--
-- Run the ENTIRE script in Supabase SQL Editor — it's safe to run multiple
-- times (all CREATE/ALTER use IF [NOT] EXISTS / idempotent patterns).
--
-- ============================================================================

-- ============================================================================
-- 1. ENABLE EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. ENUMS (Custom Types)
-- ============================================================================

-- Business type
DO $$ BEGIN
    CREATE TYPE business_type AS ENUM ('taxi', 'water_delivery');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Business mode
DO $$ BEGIN
    CREATE TYPE business_mode AS ENUM ('auto', 'manual');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Status (enabled / disabled)
DO $$ BEGIN
    CREATE TYPE status_type AS ENUM ('enabled', 'disabled');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- Submission status
DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('submitted', 'pending');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- User role for auth
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'driver', 'staff');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. TABLE 1: BUSINESSES
-- NOTE: Uses VARCHAR PK to match app-level string IDs (e.g. 'biz_seed_city_taxi')
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_businesses_type ON businesses(type);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_created_at ON businesses(created_at);

-- ============================================================================
-- 4. TABLE 2: EMPLOYEES  (includes role column for proper auth)
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_employees_business_id ON employees(business_id);
CREATE INDEX IF NOT EXISTS idx_employees_business_type ON employees(business_type);
CREATE INDEX IF NOT EXISTS idx_employees_role ON employees(role);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_mobile ON employees(mobile);
CREATE INDEX IF NOT EXISTS idx_employees_created_at ON employees(created_at);

-- ============================================================================
-- 5. TABLE 3: VEHICLES
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_assigned_employee ON vehicles(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON vehicles(created_at);

-- ============================================================================
-- 6. TABLE 4: HOTELS
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_hotels_status ON hotels(status);
CREATE INDEX IF NOT EXISTS idx_hotels_assigned_employee ON hotels(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_hotels_created_at ON hotels(created_at);

-- ============================================================================
-- 7. TABLE 5: DRIVER_RECORDS
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_driver_records_employee ON driver_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_driver_records_vehicle ON driver_records(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_driver_records_date ON driver_records(date);
CREATE INDEX IF NOT EXISTS idx_driver_records_status ON driver_records(status);
CREATE INDEX IF NOT EXISTS idx_driver_records_created_at ON driver_records(created_at);

-- ============================================================================
-- 8. TABLE 6: TRIP_DETAILS
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_trip_details_driver_record ON trip_details(driver_record_id);

-- ============================================================================
-- 9. TABLE 7: WATER_DELIVERY_RECORDS
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_water_delivery_records_employee ON water_delivery_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_date ON water_delivery_records(date);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_status ON water_delivery_records(status);
CREATE INDEX IF NOT EXISTS idx_water_delivery_records_created_at ON water_delivery_records(created_at);

-- ============================================================================
-- 10. TABLE 8: HOTEL_DELIVERIES
-- ============================================================================
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

CREATE INDEX IF NOT EXISTS idx_hotel_deliveries_record ON hotel_deliveries(water_delivery_record_id);

-- ============================================================================
-- 11. ROW LEVEL SECURITY (Public access for MVP — tighten for production)
-- ============================================================================
ALTER TABLE businesses   ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees    ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels       ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_records   ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_details     ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_delivery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_deliveries        ENABLE ROW LEVEL SECURITY;

-- Public access policies (all operations)
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
-- 12. TRIGGER: Auto-update vehicles.updated_at
-- ============================================================================
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

-- ============================================================================
-- 13. SEED DATA  — matches the mock seedData.ts exactly
--     Safe to run multiple times (uses idempotent INSERT ... WHERE NOT EXISTS).
-- ============================================================================

-- Insert businesses
INSERT INTO businesses (id, name, type, mode, status, employees, created_at)
SELECT * FROM (VALUES
    ('biz_seed_city_taxi',        'City Taxi',       'taxi'::business_type,           'auto'::business_mode,   'enabled'::status_type, 4, '2026-06-10'::date),
    ('biz_seed_yalini_minerals',  'Yalini Minerals',  'water_delivery'::business_type, 'manual'::business_mode, 'enabled'::status_type, 3, '2026-06-05'::date)
) AS v(id, name, type, mode, status, employees, created_at)
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE businesses.id = v.id);

-- Insert/Update employees with role
-- Uses ON CONFLICT to ensure role is always set correctly even if employee existed before
INSERT INTO employees (id, full_name, mobile, business_id, business_name, business_type, pin, role, status, created_at)
VALUES
    -- Admin (root user - independent of any business)
    ('emp_seed_admin',             'Yalini Admin',    '7598326133', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '0000', 'admin'::user_role,  'enabled'::status_type, '2026-06-01'::date),
    -- Taxi drivers
    ('emp_seed_ramesh',            'Ramesh Kumar',    '9876543210', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '1234', 'driver'::user_role, 'enabled'::status_type, '2026-06-10'::date),
    ('emp_seed_ajay',              'Ajay Verma',      '9876543212', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '1234', 'driver'::user_role, 'enabled'::status_type, '2026-06-08'::date),
    ('emp_seed_deepak',            'Deepak Patel',    '9876543214', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '1234', 'driver'::user_role, 'enabled'::status_type, '2026-06-06'::date),
    ('emp_seed_vijay',             'Vijay Kumar',     '9876543216', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '1234', 'driver'::user_role, 'disabled'::status_type, '2026-06-04'::date),
    -- Water delivery staff
    ('emp_seed_suresh',            'Suresh Kumar',    '9876543211', 'biz_seed_yalini_minerals', 'Yalini Minerals', 'water_delivery'::business_type, '1234', 'staff'::user_role,  'enabled'::status_type, '2026-06-09'::date),
    ('emp_seed_mani',              'Mani Kumar',      '9876543213', 'biz_seed_yalini_minerals', 'Yalini Minerals', 'water_delivery'::business_type, '1234', 'staff'::user_role,  'enabled'::status_type, '2026-06-07'::date),
    ('emp_seed_pawan',             'Pawan Prasad',    '9876543215', 'biz_seed_yalini_minerals', 'Yalini Minerals', 'water_delivery'::business_type, '1234', 'staff'::user_role,  'enabled'::status_type, '2026-06-05'::date),
    -- Demo accounts matching authService mock credentials
    ('driver-001',                 'Driver Demo',     '9988776655', 'biz_seed_city_taxi',       'City Taxi',       'taxi'::business_type,             '1111', 'driver'::user_role, 'enabled'::status_type, '2026-06-01'::date),
    ('staff-001',                  'Staff Demo',      '8877665544', 'biz_seed_yalini_minerals', 'Yalini Minerals', 'water_delivery'::business_type, '2222', 'staff'::user_role,  'enabled'::status_type, '2026-06-01'::date)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    mobile = EXCLUDED.mobile,
    business_id = EXCLUDED.business_id,
    business_name = EXCLUDED.business_name,
    business_type = EXCLUDED.business_type,
    pin = EXCLUDED.pin,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- Insert vehicles
INSERT INTO vehicles (id, name, number, status, notes, assigned_driver, assigned_employee_id, created_at, updated_at)
SELECT * FROM (VALUES
    ('veh_seed_swift_dzire',  'Swift Dzire',   'TN01AB1234', 'enabled'::status_type, 'Regular maintenance completed last week', 'Ramesh Kumar',  'emp_seed_ramesh', '2026-06-10'::date, '2026-06-15'::date),
    ('veh_seed_innova_crysta', 'Innova Crysta', 'TN01CD5678', 'enabled'::status_type, 'Premium vehicle for airport transfers',   'Ajay Verma',    'emp_seed_ajay',   '2026-06-05'::date, '2026-07-01'::date),
    ('veh_seed_wagon_r',      'Wagon R',       'TN01EF9012', 'enabled'::status_type, '',                                            'Deepak Patel',  'emp_seed_deepak', '2026-06-01'::date, '2026-06-01'::date),
    ('veh_seed_honda_city',   'Honda City',    'TN01GH3456', 'disabled'::status_type,'Under maintenance',                          NULL,            NULL,               '2026-05-20'::date, '2026-06-10'::date)
) AS v(id, name, number, status, notes, assigned_driver, assigned_employee_id, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM vehicles WHERE vehicles.id = v.id);

-- Insert hotels
INSERT INTO hotels (id, name, rate_per_can, status, location, assigned_employee_id, assigned_employee_name, created_at)
SELECT * FROM (VALUES
    ('hotel_seed_golden_palace',  'Hotel Golden Palace',  25, 'enabled'::status_type, 'MG Road, Sector 5',           'emp_seed_suresh', 'Suresh Kumar',   '2026-06-10'::date),
    ('hotel_seed_royal_inn',      'Royal Inn',            28, 'enabled'::status_type, 'Anna Nagar, Block B',         'emp_seed_suresh', 'Suresh Kumar',   '2026-06-08'::date),
    ('hotel_seed_green_valley',   'Green Valley Resort',  30, 'enabled'::status_type, 'Velachery Main Road',         'emp_seed_mani',   'Mani Kumar',     '2026-06-06'::date),
    ('hotel_seed_sunrise',        'Sunrise Hotel',        22, 'enabled'::status_type, 'T Nagar, North Street',       'emp_seed_mani',   'Mani Kumar',     '2026-06-04'::date),
    ('hotel_seed_blue_ocean',     'Hotel Blue Ocean',     26, 'enabled'::status_type, 'Adyar, 2nd Cross',            'emp_seed_pawan',  'Pawan Prasad',   '2026-06-02'::date),
    ('hotel_seed_mountain_view',  'Mountain View Hotel',  24, 'disabled'::status_type,'Guindy Industrial Estate',    NULL,              NULL,             '2026-05-28'::date)
) AS v(id, name, rate_per_can, status, location, assigned_employee_id, assigned_employee_name, created_at)
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE hotels.id = v.id);

-- ============================================================================
-- 14. MIGRATION: Add role column to existing employees table (if upgrading)
-- ============================================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'employees' AND column_name = 'role'
    ) THEN
        ALTER TABLE employees ADD COLUMN role user_role NOT NULL DEFAULT 'driver';
        RAISE NOTICE '✅ Added role column to employees table';
    ELSE
        RAISE NOTICE 'ℹ️  role column already exists in employees table';
    END IF;
END $$;

-- Set correct roles for any existing employees
UPDATE employees
SET role = 'admin'
WHERE mobile = '7598326133' AND role IS DISTINCT FROM 'admin';

UPDATE employees
SET role = 'driver'
WHERE business_type = 'taxi' AND mobile != '7598326133' AND role IS DISTINCT FROM 'driver';

UPDATE employees
SET role = 'staff'
WHERE business_type = 'water_delivery' AND role IS DISTINCT FROM 'staff';

-- ============================================================================
-- COMPLETION
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE '==============================================';
    RAISE NOTICE '✅ Yalini Mobile DB Schema created/updated!';
    RAISE NOTICE '📊 Tables: 8 (VARCHAR primary keys)';
    RAISE NOTICE '👤 User roles: admin, driver, staff';
    RAISE NOTICE '🌱 Seed data: inserted (if not existed)';
    RAISE NOTICE '==============================================';
END $$;