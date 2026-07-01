/**
 * Types for Water Business Daily Records
 */

export type RecordStatus = "submitted" | "pending";

/**
 * Individual hotel delivery details within a water delivery record
 */
export interface HotelDelivery {
  id: string;
  hotelName: string;
  location: string;
  ratePerCan: number;
  totalCans: number;
  deliveredCans: number;
  returnedCans: number;
  outstandingCans: number;
  remainingCansAtDelivery: number; // Track remaining cans when this delivery was made
  income: number;
  expense: number;
  profit: number;
  settledCash: number;
  settledOnline: number;
  shortage: number;
}

/**
 * Water delivery record for a delivery person
 */
export interface WaterDeliveryRecord {
  id: string;
  deliveryPersonName: string;
  employeeId: string;
  date: string;
  status: RecordStatus;
  avatarColor: string;
  // Summary metrics
  totalHotels: number;
  totalCans: number;
  totalDelivered: number;
  totalReturned: number;
  totalOutstanding: number;
  totalSettled: number;
  totalCashSettled: number;
  totalOnlineSettled: number;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  // Hotel-wise details
  hotelDeliveries: HotelDelivery[];
}

/**
 * Business entity
 */
export interface Business {
  id: string;
  name: string;
  type: "taxi" | "water_delivery";
}

/**
 * Filters for water records
 */
export interface WaterRecordsFilters {
  businessId: string;
  date: string;
  status: RecordStatus | "all";
}
    