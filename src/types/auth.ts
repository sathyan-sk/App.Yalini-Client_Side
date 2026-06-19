/**
 * Auth domain types shared across services, store, navigators and screens.
 *
 * `Role` is the single source of truth for module switching done by
 * `RootNavigator`. The backend (and the current mock auth service) returns
 * this role on successful login.
 */

export type Role = "ADMIN" | "DRIVER" | "STAFF";

export interface AuthUser {
  userId: string;
  name: string;
  mobile: string;
  role: Role;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  mobile: string;
  pin: string;
}

export type LoginResult =
  | { ok: true; session: AuthSession }
  | { ok: false; error: string };
