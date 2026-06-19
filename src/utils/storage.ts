/**
 * storage — small cross-platform key/value wrapper used by the auth store.
 *
 * Re-exports the storage singleton from @/src/utils/storage for use by authStore.
 * This provides secureGet, secureSet, and secureRemove methods.
 *
 * Usage:
 *   import { storage } from \"../utils/storage\"
 *   await storage.secureSet(\"yalini.auth.session.v1\", JSON.stringify(session))
 *   const raw = await storage.secureGet<string>(\"yalini.auth.session.v1\", \"\")
 *   await storage.secureRemove(\"yalini.auth.session.v1\")
 */

import { storage as baseStorage } from "./storage-base";

// Re-export the storage interface compatible with authStore
export const storage = {
  async secureGet<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const value = await baseStorage.secureGet(key, null);
      if (value === null || value === undefined) {
        return defaultValue;
      }
      // If value is already a string (from JSON.stringify), return as-is for parsing
      return value as unknown as T;
    } catch (error) {
      console.warn(`[storage] secureGet failed for key "${key}":`, error);
      return defaultValue;
    }
  },

  async secureSet(key: string, value: string): Promise<void> {
    try {
      await baseStorage.secureSet(key, value);
    } catch (error) {
      console.warn(`[storage] secureSet failed for key "${key}":`, error);
    }
  },

  async secureRemove(key: string): Promise<void> {
    try {
      await baseStorage.secureRemove(key);
    } catch (error) {
      console.warn(`[storage] secureRemove failed for key "${key}":`, error);
    }
  },
};
