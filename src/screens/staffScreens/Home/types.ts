/**
 * Type definitions for Staff Home Screen
 */
export interface HotelInfo {
  hotelId: string;
  hotelName: string;
  location?: string;
  outstandingCans?: number;
}

export interface TodayOverviewData {
  assignedHotels: number;
  deliveriesDone: number;
  cashCollected: number;
  creditSales: number;
  totalOutstandingCans?: number;
}

export interface StaffSessionData {
  staffId: string;
  staffName: string;
  businessName: string;
  sessionDate: string;
  sessionTime: string;
  assignedHotels: HotelInfo[];
  totalOutstandingCans?: number;
  overview: TodayOverviewData & { totalOutstandingCans?: number };
}
