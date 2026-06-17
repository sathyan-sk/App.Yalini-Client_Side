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
  totalCans: number;
  deliveredCans: number;
  returnedCans: number;
  outstandingCans: number;
  income: number;
  expense: number;
  profit: number;
}

/**
 * Water delivery record for a delivery person
 */
export interface WaterDeliveryRecord {
  id: string;
  deliveryPersonName: string;
  date: string; // ISO date string (YYYY-MM-DD)
  status: RecordStatus;
  avatarColor: string;
  // Summary metrics
  totalHotels: number;
  totalCans: number;
  totalDelivered: number;
  totalReturned: number;
  totalOutstanding: number;
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
  type: "taxi" | "water";
}

/**
 * Filters for water records
 */
export interface WaterRecordsFilters {
  businessId: string;
  date: string;
  status: RecordStatus | "all";
}
    