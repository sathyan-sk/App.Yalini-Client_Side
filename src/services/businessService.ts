import { storage } from "../utils/storage";

import { DEFAULT_BUSINESS_TYPE } from "../screens/adminScreens/MyBusiness/data/businessTypes";
import type {
  BusinessRecord,
  CreateBusinessInput,
  UpdateBusinessInput,
} from "../screens/adminScreens/MyBusiness/types";

/**
 * Business persistence layer.
 *
 * Backed by AsyncStorage via the shared `storage` helper so it works on
 * both native and web (the same module re-exports a web-safe shim under
 * `index.web.ts`). The whole collection is serialised under a single
 * key — small footprint, atomic reads, no migrations needed.
 *
 * Swap the body of `read` / `write` for a real backend call when the
 * server is ready; the public API stays the same.
 */

const STORAGE_KEY = "yalini.businesses.v1";

/** Seeded once on first launch so the empty state isn't the first impression. */
const SEED: BusinessRecord[] = [
  {
    id: "biz-city-taxi-service",
    name: "City Taxi Service",
    type: "taxi",
    mode: "auto",
    description: "City-wide taxi fleet with employee-managed vehicles.",
    active: true,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "biz-yalini-delivery",
    name: "Yalini Delivery Service",
    type: "water",
    mode: "manual",
    description: "Mineral water delivery across the metro region.",
    active: true,
    createdAt: "2026-02-02T10:00:00.000Z",
    updatedAt: "2026-02-02T10:00:00.000Z",
  },
];

async function read(): Promise<BusinessRecord[]> {
  // storage helper only handles primitives — we serialise the array to a
  // single JSON string so the contract stays intact.
  const raw = await storage.getItem(STORAGE_KEY, "");
  if (!raw) {
    await write(SEED);
    return [...SEED];
  }
  try {
    const parsed = JSON.parse(raw) as BusinessRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function write(records: BusinessRecord[]): Promise<void> {
  await storage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function newId(): string {
  // Crypto.randomUUID isn't guaranteed across every JS runtime we target —
  // a timestamp + suffix is sufficient given storage is per-device.
  const stamp = Date.now().toString(36);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `biz-${stamp}-${suffix}`;
}

export const businessService = {
  async list(): Promise<BusinessRecord[]> {
    const records = await read();
    return [...records].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async getById(id: string): Promise<BusinessRecord | null> {
    const records = await read();
    return records.find((record) => record.id === id) ?? null;
  },

  async create(input: CreateBusinessInput): Promise<BusinessRecord> {
    const now = new Date().toISOString();
    const record: BusinessRecord = {
      id: newId(),
      name: input.name.trim(),
      type: input.type ?? DEFAULT_BUSINESS_TYPE,
      mode: input.mode,
      description: input.description.trim(),
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    const records = await read();
    await write([record, ...records]);
    return record;
  },

  async update(id: string, patch: UpdateBusinessInput): Promise<BusinessRecord | null> {
    const records = await read();
    const index = records.findIndex((record) => record.id === id);
    if (index === -1) return null;

    const next: BusinessRecord = {
      ...records[index],
      ...patch,
      name: patch.name !== undefined ? patch.name.trim() : records[index].name,
      description:
        patch.description !== undefined
          ? patch.description.trim()
          : records[index].description,
      updatedAt: new Date().toISOString(),
    };
    const copy = [...records];
    copy[index] = next;
    await write(copy);
    return next;
  },

  async remove(id: string): Promise<boolean> {
    const records = await read();
    const filtered = records.filter((record) => record.id !== id);
    if (filtered.length === records.length) return false;
    await write(filtered);
    return true;
  },

  /** Test / dev helper — wipes the seeded data so the empty state can be QA'd. */
  async _resetForTests(): Promise<void> {
    await storage.removeItem(STORAGE_KEY);
  },
};
