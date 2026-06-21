/**
 * Type definitions for Add Delivery Screen
 * Defines all types used in the delivery recording flow.
 */

import type { HotelStatusId } from '../../adminScreens/Hotels/types';

/**
 * Payment mode options for delivery transactions.
 * Strictly limited to CASH or ONLINE per requirements.
 */
export type PaymentMode = 'CASH' | 'ONLINE';

/**
 * Session status indicating if the day's work has been submitted.
 * Used to control form editability.
 */
export type SessionStatus = 'ACTIVE' | 'SUBMITTED';

/**
 * Hotel item from the master list for dropdown selection.
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
  /** Money collected from hotel (Income) */
  income: number;
  /** Payment mode: CASH or ONLINE */
  paymentMode: PaymentMode;
}

/**
 * Validation errors for the delivery form.
 */
export interface DeliveryFormErrors {
  hotelId?: string;
  cansDelivered?: string;
  cansReturned?: string;
  income?: string;
}

/**
 * Session data for the current delivery session.
 */
export interface DeliverySessionData {
  /** Session ID */
  id: string;
  /** Staff member name */
  staffName: string;
  /** Business/service name */
  serviceName: string;
  /** Current session date */
  sessionDate: string;
  /** Session start time */
  sessionTime: string;
  /** Session status */
  sessionStatus: SessionStatus;
}

/**
 * A single saved delivery record.
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
  /** Cans delivered */
  cansDelivered: number;
  /** Cans returned */
  cansReturned: number;
  /** Outstanding cans */
  outstandingCans: number;
  /** Income collected */
  income: number;
  /** Payment mode */
  paymentMode: PaymentMode;
  /** Timestamp of delivery */
  createdAt: string;
}
