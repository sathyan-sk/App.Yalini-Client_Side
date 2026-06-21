/**
 * Type definitions for EditPreview Screen
 * Types for editing saved delivery records.
 */

import type { PaymentMode, ExpenseCategory } from '../AddDelivery/types';

/**
 * Form data for editing a delivery.
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
  /** Payment mode */
  paymentMode: PaymentMode;
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
  expenseAmount?: string;
}
