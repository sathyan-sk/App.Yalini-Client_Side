/**
 * Type definitions for Staff Home Screen
 */

export interface HotelInfo {
  hotelId: string;
  hotelName: string;
  location?: string;
}

export interface TodayOverviewData {
  assignedHotels: number;
  deliveriesDone: number;
  cashCollected: number;
  creditSales: number;
}

export interface StaffSessionData {
  staffId: string;
  staffName: string;
  businessName: string;
  sessionDate: string;
  sessionTime: string;
  assignedHotels: HotelInfo[];
  overview: TodayOverviewData;
}
