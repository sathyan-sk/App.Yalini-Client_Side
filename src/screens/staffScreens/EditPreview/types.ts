/**
 * Type definitions for EditPreview Screen
 * Types for editing saved delivery records.
 */

import type { ExpenseCategory } from '../AddDelivery/types';

/**
 * Form data for editing a delivery.
 * Uses settlement split (cash/online) instead of single paymentMode.
 */
export interface EditDeliveryFormData {
  /** Number of cans loaded */
  loadedCans: number;
  /** Number of cans delivered */
  cansDelivered: number;
  /** Number of cans returned */
  cansReturned: number;
  /** Outstanding cans (auto-calculated) */
  outstandingCans: number;
  /** Estimated amount (auto-calculated) */
  estAmount: number;
  /** Income received */
  receivedIncome: number;
  /** Amount settled via CASH */
  settledCash: number;
  /** Amount settled via ONLINE */
  settledOnline: number;
  /** Auto-calculated shortage */
  shortage: number;
  /** Optional expense category */
  expenseCategory?: ExpenseCategory;
  /** Optional expense amount */
  expenseAmount?: number;
}

/**
 * Form errors for edit delivery form.
 */
export interface EditDeliveryFormErrors {
  loadedCans?: string;
  cansDelivered?: string;
  cansReturned?: string;
  receivedIncome?: string;
  settledCash?: string;
  settledOnline?: string;
  expenseAmount?: string;
}
