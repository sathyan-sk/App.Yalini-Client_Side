/**
 * Zustand auth store — the single source of truth for the logged-in user.
 *
 * Lifecycle:
 *   1. `bootstrap()` is called once on app start; it tries to restore a
 *      previously persisted session from SecureStore (via `@/src/utils/storage`).
 *   2. `signIn()` calls the auth service, persists the resulting session,
 *      and flips `status` → \"authenticated\".
 *   3. `signOut()` clears persistence and flips `status` → \"unauthenticated\".
 *
 * `RootNavigator` subscribes to `status` and `user?.role` to decide which
 * navigator to mount (Login vs Admin/Driver/Staff).
 *
 * The store is intentionally tiny — no per-feature data lives here.
 */
import { create } from "zustand";

import { login as loginService, logout as logoutService } from "../services/authService";
import type { AuthSession, AuthUser, LoginPayload, Role } from "../types/auth";
import { storage } from "../utils/storage";

type Status = "booting" | "authenticated" | "unauthenticated";

const SESSION_KEY = "yalini.auth.session.v1";

interface AuthState {
  status: Status;
  token: string | null;
  user: AuthUser | null;
  loginError: string | null;
  isSubmitting: boolean;

  bootstrap: () => Promise<void>;
  signIn: (payload: LoginPayload) => Promise<{ ok: true; role: Role } | { ok: false; error: string }>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

async function persistSession(session: AuthSession | null) {
  if (session) {
    await storage.secureSet(SESSION_KEY, JSON.stringify(session));
  } else {
    await storage.secureRemove(SESSION_KEY);
  }
}

async function restoreSession(): Promise<AuthSession | null> {
  const raw = await storage.secureGet<string>(SESSION_KEY, "");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "booting",
  token: null,
  user: null,
  loginError: null,
  isSubmitting: false,

  async bootstrap() {
    const session = await restoreSession();
      if (__DEV__) {
    set({ status: "unauthenticated" })
    return
    // if (session) {
    //   set({
    //     status: "authenticated",
    //     token: session.token,
    //     user: session.user,
    //   });
    } else {
      set({ status: "unauthenticated" });
    }
  },

  async signIn(payload) {
    if (get().isSubmitting) {
      return { ok: false, error: "Please wait..." };
    }
    set({ isSubmitting: true, loginError: null });

    const result = await loginService(payload);
    if (!result.ok) {
      set({ isSubmitting: false, loginError: result.error });
      return { ok: false, error: result.error };
    }

    await persistSession(result.session);
    set({
      status: "authenticated",
      token: result.session.token,
      user: result.session.user,
      isSubmitting: false,
      loginError: null,
    });
    return { ok: true, role: result.session.user.role };
  },

  async signOut() {
    await logoutService();
    await persistSession(null);
    set({
      status: "unauthenticated",
      token: null,
      user: null,
      loginError: null,
    });
  },

  clearError() {
    set({ loginError: null });
  },
}));
