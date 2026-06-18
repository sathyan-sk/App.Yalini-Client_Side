/**
 * Mock data for Water Business Daily Records
 * Delete this file once backend is integrated
 */

import type { Business, WaterDeliveryRecord, HotelDelivery } from "../types/waterRecords";
import { colors } from "../theme";

const AVATAR_COLORS = [
  colors.avatarBlue,
  colors.avatarPurple,
  colors.avatarGreen,
  colors.avatarOrange,
  colors.avatarVividPurple,
  colors.avatarTeal,
  colors.avatarCyan,
];

export const mockBusinesses: Business[] = [
  { id: "biz-1", name: "City Taxi", type: "taxi" },
  { id: "biz-2", name: "Yalini Minerals", type: "water" },
];

/**
 * Create hotel deliveries for a record
 */
const createHotelDeliveries = (count: number): HotelDelivery[] => {
  const hotels = [
    { name: "Hotel Grand Palace", location: "MG Road, Sector 5" },
    { name: "Royal Inn", location: "Anna Nagar, Block B" },
    { name: "Green Valley Resort", location: "Velachery Main Road" },
    { name: "Sunrise Hotel", location: "T Nagar, North Street" },
    { name: "Blue Ocean Lodge", location: "Adyar, 2nd Cross" },
    { name: "Mountain View Hotel", location: "Guindy Industrial Estate" },
    { name: "City Center Inn", location: "Mylapore, Tank Street" },
    { name: "Paradise Resort", location: "Besant Nagar Beach Road" },
    { name: "Golden Star Hotel", location: "Nungambakkam High Road" },
    { name: "Silver Moon Lodge", location: "Kodambakkam, 3rd Lane" },
  ];

  const deliveries: HotelDelivery[] = [];

  for (let i = 0; i < count; i++) {
    const hotel = hotels[i % hotels.length];
    const totalCans = Math.floor(Math.random() * 30) + 10;
    const deliveredCans = Math.floor(totalCans * (0.7 + Math.random() * 0.3));
    const returnedCans = Math.floor(Math.random() * 5);
    const outstandingCans = totalCans - deliveredCans - returnedCans;
    const pricePerCan = 25 + Math.floor(Math.random() * 15);
    const income = deliveredCans * pricePerCan;
    const expense = Math.floor(income * 0.15);
    const profit = income - expense;

    deliveries.push({
      id: `hotel-${i + 1}`,
      hotelName: hotel.name,
      location: hotel.location,
      totalCans,
      deliveredCans,
      returnedCans,
      outstandingCans: Math.max(0, outstandingCans),
      income,
      expense,
      profit,
    });
  }

  return deliveries;
};

/**
 * Calculate totals from hotel deliveries
 */
const calculateTotals = (hotelDeliveries: HotelDelivery[]) => {
  return hotelDeliveries.reduce(
    (acc, hotel) => ({
      totalHotels: acc.totalHotels + 1,
      totalCans: acc.totalCans + hotel.totalCans,
      totalDelivered: acc.totalDelivered + hotel.deliveredCans,
      totalReturned: acc.totalReturned + hotel.returnedCans,
      totalOutstanding: acc.totalOutstanding + hotel.outstandingCans,
      totalIncome: acc.totalIncome + hotel.income,
      totalExpense: acc.totalExpense + hotel.expense,
      totalProfit: acc.totalProfit + hotel.profit,
    }),
    {
      totalHotels: 0,
      totalCans: 0,
      totalDelivered: 0,
      totalReturned: 0,
      totalOutstanding: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalProfit: 0,
    }
  );
};

export const mockWaterDeliveryRecords: WaterDeliveryRecord[] = [
  (() => {
    const hotelDeliveries = createHotelDeliveries(6);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-1",
      deliveryPersonName: "Rajan Kumar",
      employeeId: "emp_seed_rajan",
      date: "2025-07-10",
      status: "submitted" as const,
      avatarColor: AVATAR_COLORS[0],
      ...totals,
      hotelDeliveries,
    };
  })(),
  (() => {
    const hotelDeliveries = createHotelDeliveries(5);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-2",
      deliveryPersonName: "Senthil Murugan",
      employeeId: "emp_seed_senthil",
      date: "2025-07-10",
      status: "submitted" as const,
      avatarColor: AVATAR_COLORS[1],
      ...totals,
      hotelDeliveries,
    };
  })(),
  (() => {
    const hotelDeliveries = createHotelDeliveries(7);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-3",
      deliveryPersonName: "Vignesh Raja",
      employeeId: "emp_seed_vignesh",
      date: "2025-07-10",
      status: "submitted" as const,
      avatarColor: AVATAR_COLORS[2],
      ...totals,
      hotelDeliveries,
    };
  })(),
  (() => {
    const hotelDeliveries = createHotelDeliveries(4);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-4",
      deliveryPersonName: "Karthik Selvam",
      employeeId: "emp_seed_karthik",
      date: "2025-07-10",
      status: "submitted" as const,
      avatarColor: AVATAR_COLORS[3],
      ...totals,
      hotelDeliveries,
    };
  })(),
  (() => {
    const hotelDeliveries = createHotelDeliveries(5);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-5",
      deliveryPersonName: "Arun Prasad",
      employeeId: "emp_seed_arun",
      date: "2025-07-10",
      status: "pending" as const,
      avatarColor: AVATAR_COLORS[4],
      ...totals,
      hotelDeliveries,
    };
  })(),
  (() => {
    const hotelDeliveries = createHotelDeliveries(6);
    const totals = calculateTotals(hotelDeliveries);
    return {
      id: "water-rec-6",
      deliveryPersonName: "Manikandan S",
      employeeId: "emp_seed_manikandan",
      date: "2025-07-10",
      status: "pending" as const,
      avatarColor: AVATAR_COLORS[5],
      ...totals,
      hotelDeliveries,
    };
  })(),
];

export function getMockWaterRecordsData(
  businessId: string,
  date: string
): WaterDeliveryRecord[] {
  // In real implementation, filter by business and date
  return mockWaterDeliveryRecords;
}

export function getMockWaterRecordById(
  recordId: string
): WaterDeliveryRecord | undefined {
  return mockWaterDeliveryRecords.find((r) => r.id === recordId);
}
