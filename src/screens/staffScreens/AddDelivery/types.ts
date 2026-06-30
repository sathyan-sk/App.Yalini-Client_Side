/**
 * Type definitions for Add Delivery Screen
 * Defines all types used in the delivery recording flow.
 */

/**
 * Hotel status options.
 */
export type HotelStatusId = 'enabled' | 'disabled';

/**
 * Payment mode is now replaced by settlement split (cash/online per delivery).
 * Kept as type for backward compat with trips but not used in staff forms.
 */
export type PaymentMode = 'CASH' | 'ONLINE';

/**
 * Expense category options for optional expense tracking.
 */
export type ExpenseCategory = 'FUEL' | 'OTHERS';

/**
 * Session status indicating if the day's work has been submitted.
 */
export type SessionStatus = 'PENDING' | 'ACTIVE' | 'SUBMITTED';

/**
 * Hotel item from the master list for dropdown selection.
 */
export interface HotelOption {
  id: string;
  name: string;
  ratePerCan: number;
  location?: string;
  status: HotelStatusId;
}

/**
 * Form values for recording a delivery.
 * Settlement is split into cash/online per delivery instead of single paymentMode.
 */
export interface DeliveryFormValues {
  /** Selected hotel ID */
  hotelId: string;
  /** Selected hotel name for display */
  hotelName: string;
  /** Rate per can for the selected hotel */
  ratePerCan: number;
  /** Number of cans delivered to hotel */
  cansDelivered: number;
  /** Number of empty cans returned from hotel */
  cansReturned: number;
  /** Auto-calculated: cansDelivered - cansReturned */
  outstandingCans: number;
  /** Auto-calculated: cansDelivered * ratePerCan */
  estAmount: number;
  /** Money received from hotel (Income Received) */
  receivedIncome: number;
  /** Amount settled via CASH (new - replaces paymentMode) */
  settledCash: number;
  /** Amount settled via ONLINE (new - replaces paymentMode) */
  settledOnline: number;
  /** Auto-calculated: estAmount - (settledCash + settledOnline) */
  shortage: number;
  /** Optional expense category */
  expenseCategory?: ExpenseCategory;
  /** Optional expense amount */
  expenseAmount?: number;
}

/**
 * Validation errors for the delivery form.
 */
export interface DeliveryFormErrors {
  hotelId?: string;
  loadedCans?: string;
  cansDelivered?: string;
  cansReturned?: string;
  receivedIncome?: string;
  settledCash?: string;
  settledOnline?: string;
  expenseAmount?: string;
}

/**
 * Session data for the current delivery session.
 */
export interface DeliverySessionData {
  id: string;
  staffName: string;
  serviceName: string;
  staffId: string;
  sessionDate: string;
  sessionTime: string;
  sessionStatus: SessionStatus;
}

/**
 * A single saved delivery record.
 */
export interface DeliveryRecord {
  id: string;
  hotelId: string;
  hotelName: string;
  ratePerCan: number;
  loadedCans: number;
  cansDelivered: number;
  cansReturned: number;
  outstandingCans: number;
  estAmount: number;
  receivedIncome: number;
  /** Amount settled via CASH */
  settledCash: number;
  /** Amount settled via ONLINE */
  settledOnline: number;
  /** Auto-calculated: estAmount - (settledCash + settledOnline) */
  shortage: number;
  expenseCategory?: ExpenseCategory;
  expenseAmount?: number;
  createdAt: string;
  notes?: string;
}