/**
 * Static metadata that drives the Employees module.
 */

/** Deep navy used by the form-screen sticky headers (Add / Edit). Matches design ref. */
export const FORM_HEADER_BG = "#0F1F4D";

/** 
 * Key identifier for employee data (kept for potential future persistence).
 * Note: The app now uses the Mock Service Layer for data management.
 */
export const EMPLOYEE_STORAGE_KEY = "@yalini/employees/v1";

/** Generate initials from full name for avatar display */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Format mobile number for display (e.g., "98765 43210") */
export function formatMobileDisplay(mobile: string): string {
  const cleaned = mobile.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return mobile;
}
