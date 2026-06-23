/**
 * Staff Home Screen - Data will be loaded from Supabase
 * No mock data - production mode fetches real employee/hotel assignments
 */
import type { StaffSessionData } from '../types';

// Empty placeholder - real data comes from getStaffHomeData() service call
export const MOCK_STAFF_SESSION: StaffSessionData = {
  staffId: '',
  staffName: '',
  businessName: 'Yalini Minerals',
  sessionDate: '',
  sessionTime: '',
  assignedHotels: [],
  overview: {
    assignedHotels: 0,
    deliveriesDone: 0,
    cashCollected: 0,
    creditSales: 0,
  },
};
