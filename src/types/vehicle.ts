/**
 * Type contracts for the Vehicles module.
 *
 * A Vehicle represents a taxi in the fleet with its current operational status.
 * The status can be "running" (active and available) or "maintenance" (under repair).
 */

export type VehicleStatusId = "enabled" | "disabled";

export interface Vehicle {
  id: string;
  name: string;
  number: string;
  status: VehicleStatusId;
  /** Optional notes about the vehicle */
  notes?: string;
  /** Assigned driver name (for display) */
  assignedDriver?: string;
  /** Assigned employee ID (for proper tracking) */
  assignedEmployeeId?: string;
  /** ISO-8601 date string (YYYY-MM-DD). */
  createdAt: string;
  /** ISO-8601 date string (YYYY-MM-DD). */
  updatedAt: string;
}

/** Shape used by add/edit forms (no id / createdAt / updatedAt on create). */
export interface VehicleFormValues {
  name: string;
  number: string;
  status: VehicleStatusId;
  notes?: string;
  assignedDriver?: string;
  assignedEmployeeId?: string;
}

export type VehicleStatusFilter = VehicleStatusId | "all";
