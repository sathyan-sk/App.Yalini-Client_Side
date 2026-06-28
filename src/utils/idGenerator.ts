/**
 * ID Generator utility.
 *
 * Generates unique IDs for records using timestamp + random suffix.
 * RN-safe (no crypto.randomUUID polyfill required).
 */

/** Generate a unique ID with the given prefix */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Strict ISO date (YYYY-MM-DD) for `createdAt` / date fields. */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}