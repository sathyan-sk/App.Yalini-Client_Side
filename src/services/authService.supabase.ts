/**
 * Auth service — Supabase implementation.
 *
 * AUTHENTICATION FLOW:
 *   1. Check admins table → if found → role = ADMIN (super user)
 *   2. Check employees table → if found → role = DRIVER or STAFF
 *   3. Only users with status = 'enabled' can log in
 *
 * ARCHITECTURE:
 *   admins table: Super users who manage the app (NOT employees)
 *   employees table: Drivers and Staff who use the app
 *
 * IMPORTANT: The admins table must be created via SQL migration
 * (supabase_complete_setup.sql) before the app can authenticate admins.
 */
import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { LoginPayload, LoginResult, AuthSession, Role } from '../types/auth';

/**
 * Login using mobile + PIN.
 * Checks admins table first (super users), then employees table.
 */
export async function login({ mobile, pin }: LoginPayload): Promise<LoginResult> {
  if (!isSupabaseConfigured()) {
    console.error('[Auth] Supabase not configured');
    return { ok: false, error: 'Supabase is not configured. Check your .env file.' };
  }

  console.log('[Auth] Attempting login for mobile:', mobile);

  // STEP 1: Check admins table (super users)
  const { data: admin, error: adminErr } = await supabase
    .from('admins')
    .select('id, full_name, mobile, pin, status')
    .eq('mobile', mobile)
    .maybeSingle();

  console.log('[Auth DEBUG] Admin query:', { admin, adminErr });

  if (admin) {
    // Verify PIN
    if (admin.pin !== pin) {
      return { ok: false, error: 'Invalid mobile number or passcode' };
    }

    // Check if admin account is enabled
    if (admin.status !== 'enabled') {
      return { ok: false, error: 'Your account is disabled. Please contact your administrator.' };
    }

    console.log('[Auth] Admin authenticated:', admin.full_name);
    return {
      ok: true,
      session: {
        token: `admin_${admin.id}_${Date.now()}`,
        user: {
          userId: admin.id,
          name: admin.full_name,
          mobile: admin.mobile,
          role: 'ADMIN',
        },
      },
    };
  }

  // STEP 2: Check employees table (drivers and staff)
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('id, full_name, mobile, business_type, business_name, pin, role, status')
    .eq('mobile', mobile)
    .maybeSingle();

  if (empError) {
    console.error('[Auth] Database error:', empError.message);
    return { ok: false, error: 'Database error. Please try again.' };
  }

  if (!employee) {
    console.log('[Auth DEBUG] No employee found either. Check database!');
    return { ok: false, error: 'Invalid mobile number or passcode' };
  }

  // Verify PIN
  if (employee.pin !== pin) {
    return { ok: false, error: 'Invalid mobile number or passcode' };
  }

  // Check if employee account is enabled
  if (employee.status !== 'enabled') {
    return { ok: false, error: 'Your account is disabled. Please contact your administrator.' };
  }

  // Map database role to app Role type
  const role: Role = employee.role === 'driver' ? 'DRIVER' : 'STAFF';

  console.log('[Auth] Employee authenticated:', employee.full_name, 'as', role);
  return {
    ok: true,
    session: {
      token: `emp_${employee.id}_${Date.now()}`,
      user: {
        userId: employee.id,
        name: employee.full_name,
        mobile: employee.mobile,
        role,
      },
    },
  };
}

/**
 * Logout — no-op since we manage sessions client-side via authStore.
 */
export async function logout(): Promise<void> {
  console.log('[Supabase Auth] Logout called (no-op)');
}

/**
 * Get current session (stub — session managed by authStore + SecureStore).
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  return null;
}