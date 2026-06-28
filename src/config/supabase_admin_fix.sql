-- ============================================================================
-- Yalini Mobile App - Admin Authentication & Data Consistency Fix
-- ============================================================================
--
-- Run this ENTIRE script in Supabase SQL Editor.
-- Safe to run multiple times.
-- ============================================================================

-- ============================================================================
-- 1. CREATE ADMINS TABLE (separate from employees)
-- ============================================================================
CREATE TABLE IF NOT EXISTS admins (
    id VARCHAR(255) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    pin VARCHAR(4) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'enabled',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT admins_mobile_check CHECK (mobile ~ '^[0-9]+$'),
    CONSTRAINT admins_pin_check CHECK (pin ~ '^[0-9]{4}$'),
    CONSTRAINT admins_status_check CHECK (status IN ('enabled', 'disabled'))
);

-- Insert default admin (only if not exists)
INSERT INTO admins (id, full_name, mobile, pin, status, created_at)
SELECT * FROM (VALUES
    ('admin_001', 'Yalini Admin', '7598326133', '0000', 'enabled', CURRENT_DATE)
) AS v(id, full_name, mobile, pin, status, created_at)
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE admins.id = v.id);

-- ============================================================================
-- 2. ADD INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_admins_mobile ON admins(mobile);
CREATE INDEX IF NOT EXISTS idx_admins_status ON admins(status);

-- ============================================================================
-- 3. VERIFY
-- ============================================================================
SELECT id, full_name, mobile, status FROM admins;