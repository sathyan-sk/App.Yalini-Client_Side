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

export function formatINR(amount: number): string {
  try {
    return new Intl.NumberFormat("en-IN").format(amount);
  } catch {
    return String(amount);
  }
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

/**
 * Format number with suffix (e.g., 1.2K, 1.5M)
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Strict ISO date (YYYY-MM-DD) for timestamps.
 * @returns Today's date in ISO format
 */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}