/**
 * Business persistence service — local-only (AsyncStorage) for the UI milestone.
 *
 * The shared `storage` util only round-trips primitives, so the businesses
 * list is serialised to a single JSON string under {@link BUSINESS_STORAGE_KEY}.
 * Replace `loadBusinesses`/`saveBusinesses` here when wiring a real backend —
 * the rest of the module reads through {@link useBusinesses}.
 *
 * First-run UX is non-empty: if no record exists yet, two demo businesses are
 * seeded so the list, search, and stat cards have meaningful content on cold
 * start (matches the reference design).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BUSINESS_STORAGE_KEY,
} from "../screens/adminScreens/MyBusiness/data/constants";

const storage = {
  async getItem(key: string, defaultValue = ""): Promise<string> {
    const value = await AsyncStorage.getItem(key);
    return value ?? defaultValue;
  },
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
};
import type {
  Business,
  BusinessFormValues,
} from "../screens/adminScreens/MyBusiness/types";

/** Strict ISO date (YYYY-MM-DD) for `createdAt`. */
function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** RN-safe unique id generator (no crypto.randomUUID polyfill required). */
function generateId(): string {
  return `biz_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const SEED_BUSINESSES: Business[] = [
  {
    id: "biz_seed_city_taxi",
    name: "City Taxi",
    type: "taxi",
    mode: "auto",
    status: "active",
    location: "Chennai, Tamil Nadu",
    employees: 8,
    createdAt: "2026-06-10",
  },
  {
    id: "biz_seed_yalini_minerals",
    name: "Yalini Minerals",
    type: "water_delivery",
    mode: "manual",
    status: "active",
    location: "Chennai, Tamil Nadu",
    employees: 6,
    createdAt: "2026-06-05",
  },
];

export async function loadBusinesses(): Promise<Business[]> {
  const raw = await storage.getItem(BUSINESS_STORAGE_KEY, "");
  if (!raw) {
    await saveBusinesses(SEED_BUSINESSES);
    return [...SEED_BUSINESSES];
  }
  try {
    const parsed = JSON.parse(raw) as Business[];
    if (!Array.isArray(parsed)) return [...SEED_BUSINESSES];
    // Migrate old 'water' type to 'water_delivery'
    const migrated = parsed.map(b => ({
      ...b,
      type: b.type === 'water' ? 'water_delivery' : b.type
    })) as Business[];
    return migrated;
  } catch {
    return [...SEED_BUSINESSES];
  }
}

export async function saveBusinesses(businesses: Business[]): Promise<void> {
  await storage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(businesses));
}

export async function createBusiness(
  values: BusinessFormValues,
): Promise<Business> {
  const next: Business = {
    id: generateId(),
    name: values.name.trim(),
    type: values.type,
    mode: values.mode,
    status: values.status,
    employees: 0,
    createdAt: todayISODate(),
  };
  const current = await loadBusinesses();
  await saveBusinesses([next, ...current]);
  return next;
}

export async function updateBusiness(
  id: string,
  patch: BusinessFormValues,
): Promise<Business | null> {
  const current = await loadBusinesses();
  let updated: Business | null = null;
  const next = current.map((b) => {
    if (b.id !== id) return b;
    updated = {
      ...b,
      name: patch.name.trim(),
      type: patch.type,
      mode: patch.mode,
      status: patch.status,
    };
    return updated;
  });
  if (!updated) return null;
  await saveBusinesses(next);
  return updated;
}

export async function deleteBusiness(id: string): Promise<void> {
  const current = await loadBusinesses();
  await saveBusinesses(current.filter((b) => b.id !== id));
}