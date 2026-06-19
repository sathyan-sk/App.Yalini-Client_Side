/**
 * Type contracts for the Hotels module.
 *
 * A Hotel is the persisted record managed via the Mock Service Layer. The
 * backend wiring will swap the storage layer without changing this shape.
 * backend wiring will swap the storage layer without changing this shape.
 */

export type HotelStatusId = "enabled" | "disabled";

export interface Hotel {
  id: string;
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  /** Hotel location for display purposes */
  location?: string;
  /** Assigned employee ID (for proper tracking) */
  assignedEmployeeId?: string;
  /** Assigned employee name (for display) */
  assignedEmployeeName?: string;
  /** ISO-8601 date string (YYYY-MM-DD). */
  createdAt: string;
}

/** Shape used by add/edit forms (no id / createdAt on create). */
export interface HotelFormValues {
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  location?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
}

export type HotelStatusFilter = HotelStatusId | "all";
