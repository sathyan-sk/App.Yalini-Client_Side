/**
 * Type contracts for the Employees module.
 *
 * An Employee belongs to a Business and has a 4-digit PIN for login.
 * Status tracks whether their login access is enabled.
 */

import type { BusinessTypeId } from "../MyBusiness/types";

export type EmployeeStatusId = "enabled" | "disabled";

export interface Employee {
  id: string;
  fullName: string;
  mobile: string;
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  pin: string;
  status: EmployeeStatusId;
  /** ISO-8601 date string (YYYY-MM-DD). */
  createdAt: string;
}

/** Shape used by add/edit forms (no id / createdAt on create). */
export interface EmployeeFormValues {
  fullName: string;
  mobile: string;
  businessId: string;
  pin: string;
  confirmPin: string;
  status: EmployeeStatusId;
}

export type EmployeeStatusFilter = EmployeeStatusId | "all";

export type EmployeeBusinessFilter = string | "all";
