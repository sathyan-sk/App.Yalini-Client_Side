/**
 * Type definitions for Add Delivery Screen
 * Defines all types used in the delivery recording flow.
 * These types serve as the single source of truth for the staff module.
 */

/**
 * Hotel status options.
 */
export type HotelStatusId = 'enabled' | 'disabled';

/**
 * Payment mode options for delivery transactions.
 * Strictly limited to CASH or ONLINE per requirements.
 */
export type PaymentMode = 'CASH' | 'ONLINE';

/**
 * Expense category options for optional expense tracking.
 */
export type ExpenseCategory = 'FUEL' | 'OTHERS';

/**
 * Session status indicating if the day's work has been submitted.
 * Used to control form editability.
 */
export type SessionStatus = 'PENDING' | 'ACTIVE' | 'SUBMITTED';

/**
 * Hotel item from the master list for dropdown selection.
 * Used consistently across service and store layers.
 */
export interface HotelOption {
  /** Unique identifier */
  id: string;
  /** Hotel display name */
  name: string;
  /** Rate per water can in rupees */
  ratePerCan: number;
  /** Optional location for display */
  location?: string;
  /** Hotel status */
  status: HotelStatusId;
}

/**
 * Form values for recording a delivery.
 * loadedCans is now centralized at session level (set on first delivery).
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
  /** Payment mode: CASH or ONLINE */
  paymentMode: PaymentMode;
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
  expenseAmount?: string;
}

/**
 * Session data for the current delivery session.
 * Consistent session status types across the app.
 */
export interface DeliverySessionData {
  /** Session ID */
  id: string;
  /** Staff member name */
  staffName: string;
  /** Business/service name */
  serviceName: string;
  /** Staff employee ID for database operations */
  staffId: string;
  /** Current session date */
  sessionDate: string;
  /** Session start time */
  sessionTime: string;
  /** Session status - supports PENDING, ACTIVE, SUBMITTED */
  sessionStatus: SessionStatus;
}

/**
 * A single saved delivery record.
 * Uses createdAt consistently (not timestamp).
 */
export interface DeliveryRecord {
  /** Unique delivery ID */
  id: string;
  /** Hotel ID */
  hotelId: string;
  /** Hotel name */
  hotelName: string;
  /** Rate per can at time of delivery */
  ratePerCan: number;
  /** Cans loaded */
  loadedCans: number;
  /** Cans delivered */
  cansDelivered: number;
  /** Cans returned */
  cansReturned: number;
  /** Outstanding cans */
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
  /** Timestamp of delivery - ISO string */
  createdAt: string;
  /** Optional notes */
  notes?: string;
}
