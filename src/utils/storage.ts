/**
 * storage — thin secure storage wrapper for Yalini ERP.
 *
 * Wraps expo-secure-store directly.
 * Used by authStore for session persistence.
 *
 * Usage:
 *   import { storage } from "../utils/storage"
 *   await storage.secureSet("yalini.auth.session.v1", JSON.stringify(session))
 *   const raw = await storage.secureGet<string>("yalini.auth.session.v1", "")
 *   await storage.secureRemove("yalini.auth.session.v1")
 */

import * as SecureStore from "expo-secure-store"

export const storage = {

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