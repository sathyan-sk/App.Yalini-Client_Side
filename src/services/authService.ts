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

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function login({ mobile, pin }: LoginPayload): Promise<LoginResult> {
  // Delegate to Supabase implementation when mock mode is off
  if (!USE_MOCK) {
    const { login: loginFromSupabase } = await import('./authService.supabase');
    return loginFromSupabase({ mobile, pin });
  }

  // Mock mode disabled in production
  await wait(600);
  
  // In production (USE_MOCK=false), this code path is never reached
  // Authentication is handled by authService.supabase.ts
  return {
    ok: false,
    error: "Mock authentication is disabled. Please configure Supabase.",
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