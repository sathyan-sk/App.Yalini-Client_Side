/**
 * Type contracts for the MyBusiness module.
 *
 * Pre-defined business catalogue (per product spec):
 *  - "taxi"  → Taxi service (assigns Vehicles)
 *  - "water_delivery" → Water Delivery service (assigns Hotels)
 *
 * A Business is the persisted record managed locally (AsyncStorage). The
 * backend wiring will swap the storage layer without changing this shape.
 */

export type BusinessTypeId = "taxi" | "water_delivery";

export type BusinessModeId = "auto" | "manual";

export type BusinessStatusId = "enabled" | "disabled";

export interface Business {
  id: string;
  name: string;
  type: BusinessTypeId;
  mode: BusinessModeId;
  status: BusinessStatusId;
  /** Optional human-readable location label rendered on the list card. */
  location?: string;
  /** Optional headcount surfaced on the list card. Defaults to 0. */
  employees: number;
  /** ISO-8601 date string (YYYY-MM-DD). */
  createdAt: string;
}

/** Shape used by add/edit forms (no id / createdAt / employees on create). */
export interface BusinessFormValues {
  name: string;
  type: BusinessTypeId;
  mode: BusinessModeId;
  status: BusinessStatusId;
}

export type BusinessStatusFilter = BusinessStatusId | "all";
