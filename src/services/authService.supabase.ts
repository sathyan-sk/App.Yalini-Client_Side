/**
 * Auth service — Supabase implementation.
 *
 * LOGIN FLOW:
 *   1. Admin is pre-defined in the database (created by the schema + seed data).
 *   2. Admin creates employees (DRIVER/STAFF) via "Add Employee" screen.
 *   3. Employee role is auto-derived from their assigned business type:
 *      - taxi business          → role = 'driver'
 *      - water_delivery business → role = 'staff'
 *   4. Only employees with status = 'enabled' can log in.
 *      Disabled employees are rejected at login.
 *
 * Keeps the same function signatures as the mock authService.ts
 * so the store layer (authStore) doesn't need to change.
 */
import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { LoginPayload, LoginResult, AuthSession, Role } from '../types/auth';

/**
 * Login using mobile + PIN.
 * Queries the employees table directly, checks status and role.
 *
 * In production, replace this with proper Supabase Auth (phone OTP).
 */
export async function login({ mobile, pin }: LoginPayload): Promise<LoginResult> {
  // Validate Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('[Auth] Supabase not configured');
    return { ok: false, error: 'Supabase is not configured. Check your .env file.' };
  }

  try {
    console.log('[Auth] Attempting login for mobile:', mobile);

    // Query the employees table with mobile
    const { data: employee, error } = await supabase
      .from('employees')
      .select('id, full_name, mobile, business_type, business_name, pin, role, status')
      .eq('mobile', mobile)
      .single();

    console.log('[Auth] Query result:', { employee, error });

    if (error || !employee) {
      console.error('[Auth] Employee not found:', error);
      const errorMsg = error?.message || 'Employee not found in database';
      return { ok: false, error: `Invalid mobile number or passcode (${errorMsg})` };
    }

    // Verify PIN (plain-text comparison for dev; use hashed PINs in production)
    if (employee.pin !== pin) {
      return { ok: false, error: 'Invalid mobile number or passcode' };
    }

    // Check if employee account is enabled for login
    if (employee.status !== 'enabled') {
      return { ok: false, error: 'Your account is disabled. Please contact your administrator.' };
    }

    // Map database role to app Role type
    let role: Role;
    switch (employee.role) {
      case 'admin':
        role = 'ADMIN';
        break;
      case 'driver':
        role = 'DRIVER';
        break;
      case 'staff':
        role = 'STAFF';
        break;
      default:
        // Fallback: derive from business_type
        role = employee.business_type === 'taxi' ? 'DRIVER' : 'STAFF';
    }

    return {
      ok: true,
      session: {
        token: `supabase_${employee.id}_${Date.now()}`,
        user: {
          userId: employee.id,
          name: employee.full_name,
          mobile: employee.mobile,
          role,
        },
      },
    };
  } catch (err) {
    console.error('[Supabase Auth] Login error:', err);
    return { ok: false, error: 'An unexpected error occurred. Please try again.' };
  }
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