/**
 * storage — thin wrapper around expo-secure-store.
 *
 * Exposes three primitives that the auth store (and any future store)
 * can use without importing expo-secure-store directly.
 *
 * secureGet<T>   — read an encrypted value (returns defaultValue if missing)
 * secureSet      — write an encrypted value
 * secureRemove   — delete an encrypted value
 *
 * Usage:
 *   import { storage } from "../utils/storage"
 *
 *   await storage.secureSet("my.key", "value")
 *   await storage.secureGet<string>("my.key", "")
 *   await storage.secureRemove("my.key")
 */

import * as SecureStore from "expo-secure-store"

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface Storage {
  /**
   * Read an encrypted value from SecureStore.
   * Returns `defaultValue` when the key is missing or an error occurs.
   *
   * @example
   * const raw = await storage.secureGet<string>("yalini.auth.session.v1", "")
   */
  secureGet<T>(key: string, defaultValue: T): Promise<T>

  /**
   * Write an encrypted value to SecureStore.
   *
   * @example
   * await storage.secureSet("yalini.auth.session.v1", JSON.stringify(session))
   */
  secureSet(key: string, value: string): Promise<void>

  /**
   * Delete an encrypted value from SecureStore.
   *
   * @example
   * await storage.secureRemove("yalini.auth.session.v1")
   */
  secureRemove(key: string): Promise<void>
}

// ─────────────────────────────────────────────────────────────
// IMPLEMENTATION
// ─────────────────────────────────────────────────────────────

export const storage: Storage = {

  async secureGet<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await SecureStore.getItemAsync(key)
      if (value === null || value === undefined) {
        return defaultValue
      }
      return value as unknown as T
    } catch (error) {
      console.warn(`[storage] secureGet failed for key "${key}":`, error)
      return defaultValue
    }
  },

  async secureSet(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value)
    } catch (error) {
      console.warn(`[storage] secureSet failed for key "${key}":`, error)
      throw error
    }
  },

  async secureRemove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key)
    } catch (error) {
      console.warn(`[storage] secureRemove failed for key "${key}":`, error)
      throw error
    }
  },

}