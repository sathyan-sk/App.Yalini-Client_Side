/**
 * Utility functions for formatting
 */

import dayjs from "dayjs";

/**
 * Returns today's date as an ISO string (YYYY-MM-DD)
 */
export function todayISO(): string {
  return dayjs().format("YYYY-MM-DD");
}

/**
 * Format date to display format (e.g., "10 Jun 2026")
 */
export function formatDisplayDate(isoDate: string): string {
  return dayjs(isoDate).format("DD MMM YYYY");
}

/**
 * Format currency amount with rupee symbol
 */
export function formatCurrency(amount: number): string {
  return `\u20B9 ${amount.toLocaleString("en-IN")}`;
}

/**
 * Format distance with km suffix
 */
export function formatDistance(distance: number): string {
  return `${distance} km`;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
