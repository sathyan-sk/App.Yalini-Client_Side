/**
 * Auth service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */
import type { LoginPayload, LoginResult } from "../types/auth";

export async function login({ mobile, pin }: LoginPayload): Promise<LoginResult> {
  const { login } = await import('./authService.supabase');
  return login({ mobile, pin });
}

export async function logout(): Promise<void> {
  const { logout } = await import('./authService.supabase');
  return logout();
}
