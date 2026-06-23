/**
 * Auth service — boundary between UI and authentication backend.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 *
 * Today: pure mock — credentials are hard-coded so the team can ship the
 * three role modules independently. Latency is simulated so the UI shows
 * loading spinners correctly.
 *
 * Tomorrow: keep the same function signatures, replace the body with the
 * real Supabase call. Nothing in the UI/store layer needs to change.
 *
 *     const res = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/auth/login`, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify({ mobile, pin }),
 *     });
 *     if (!res.ok) return { ok: false, error: "Invalid credentials" };
 *     const data = (await res.json()) as AuthSession;
 *     return { ok: true, session: data };
 */
import { USE_MOCK } from './featureFlags';
import type { LoginPayload, LoginResult, Role } from "../types/auth";

interface MockAccount {
  mobile: string;
  pin: string;
  role: Role;
  name: string;
  userId: string;
}

/**
 * Mock accounts for development.
 * 
 * PRODUCTION FLOW:
 *   - Admin (mobile: 7598326133, pin: 0000) is pre-defined in the database
 *   - Admin creates employees via "Add Employee" screen
 *   - Employee role is auto-derived from business type:
 *       taxi business → DRIVER
 *       water_delivery business → STAFF
 *   - Only employees with status = 'enabled' can log in
 */
const MOCK_ACCOUNTS: MockAccount[] = [
  {
    mobile: "7598326133",
    pin: "0000",
    role: "ADMIN",
    name: "Yalini Admin",
    userId: "emp_seed_admin",
  },
  {
    mobile: "9988776655",
    pin: "1111",
    role: "DRIVER",
    name: "Driver Demo",
    userId: "driver-001",
  },
  {
    mobile: "8877665544",
    pin: "2222",
    role: "STAFF",
    name: "Staff Demo",
    userId: "staff-001",
  },
];

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login({ mobile, pin }: LoginPayload): Promise<LoginResult> {
  // Delegate to Supabase implementation when mock mode is off
  if (!USE_MOCK) {
    const { login: loginFromSupabase } = await import('./authService.supabase');
    return loginFromSupabase({ mobile, pin });
  }

  // Match real network latency so the UI loading state is exercised.
  await wait(600);

  const account = MOCK_ACCOUNTS.find(
    (a) => a.mobile === mobile && a.pin === pin,
  );
  if (!account) {
    return { ok: false, error: "Invalid mobile number or passcode" };
  }

  return {
    ok: true,
    session: {
      // Mock JWT-shaped token. Real token comes from backend in prod.
      token: `mock.${account.userId}.${Date.now()}`,
      user: {
        userId: account.userId,
        name: account.name,
        mobile: account.mobile,
        role: account.role,
      },
    },
  };
}

export async function logout(): Promise<void> {
  // Delegate to Supabase implementation when mock mode is off
  if (!USE_MOCK) {
    const { logout: logoutFromSupabase } = await import('./authService.supabase');
    return logoutFromSupabase();
  }
  // Real impl will call backend to revoke the token. Mock is a no-op.
  await wait(150);
}