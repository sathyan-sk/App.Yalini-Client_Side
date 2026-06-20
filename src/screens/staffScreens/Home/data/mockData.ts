/**
 * Mock data for Staff Home Screen
 * Will be replaced with real API data later
 */

import type { StaffSessionData } from '../types';

export const MOCK_STAFF_SESSION: StaffSessionData = {
  staffId: 'staff_001',
  staffName: 'Mani',
  businessName: 'Yalini Water Delivery',
  sessionDate: new Date().toISOString().split('T')[0],
  sessionTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
  assignedHotels: [
    { hotelId: 'hotel_a', hotelName: 'Hotel A', location: 'MG Road' },
    { hotelId: 'hotel_c', hotelName: 'Hotel C', location: 'Anna Nagar' },
    { hotelId: 'hotel_e', hotelName: 'Hotel E', location: 'Velachery' },
    { hotelId: 'hotel_g', hotelName: 'Hotel G', location: 'T Nagar' },
    { hotelId: 'hotel_h', hotelName: 'Hotel H', location: 'Adyar' },
  ],
  overview: {
    assignedHotels: 5,
    deliveriesDone: 0,
    cashCollected: 0,
    creditSales: 0,
  },
};
