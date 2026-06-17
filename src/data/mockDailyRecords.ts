/**
 * Mock data for Daily Records screens
 * Delete this file once backend is integrated
 */

import type { Business, DriverRecord, TripDetail } from "../types/dailyRecords";
import { colors } from "../theme";

const AVATAR_COLORS = [
  colors.avatarBlue,
  colors.avatarPurple,
  colors.avatarGreen,
  colors.avatarOrange,
  colors.avatarVividPurple,
];

export const mockBusinesses: Business[] = [
  { id: "biz-1", name: "City Taxi" },
  { id: "biz-2", name: "Yalini Minerals" },
];

const createTrips = (count: number, baseIncome: number, baseExpense: number): TripDetail[] => {
  const trips: TripDetail[] = [];
  const destinations = [
    "Airport to MG Road",
    "Railway Station to City Center",
    "City Center to Hospital",
    "Hotel Green to Market",
    "Airport to Hotel Blue",
    "Mall to Tech Park",
    "Station to Airport",
    "Bus Stand to University",
    "Hospital to Railway Station",
    "Downtown to Suburbs",
    "Tech Park to Airport",
    "University to Mall",
  ];
  
  for (let i = 0; i < count; i++) {
    const incomeVariation = Math.floor(Math.random() * 400) + 150;
    const expenseVariation = Math.floor(Math.random() * 120) + 60;
    const distance = (Math.random() * 15 + 5).toFixed(1);
    
    trips.push({
      id: `trip-${i + 1}`,
      tripNumber: i + 1,
      destination: destinations[i % destinations.length],
      distance: parseFloat(distance),
      income: incomeVariation,
      expense: expenseVariation,
    });
  }
  return trips;
};

export const mockDriverRecords: DriverRecord[] = [
  {
    id: "rec-1",
    driverName: "Ramesh Kumar",
    date: "2026-06-10",
    status: "submitted",
    avatarColor: AVATAR_COLORS[0],
    trips: 12,
    totalIncome: 5600,
    totalExpense: 1800,
    settledToAdmin: 4000,
    balanceShortage: 1600,
    totalProfit: 3800,
    perKmRate: 18,
    tripDetails: createTrips(12, 5600, 1800),
    fuelExpense: 1200,
  },
  {
    id: "rec-2",
    driverName: "Suresh Kumar",
    date: "2026-06-10",
    status: "submitted",
    avatarColor: AVATAR_COLORS[1],
    trips: 10,
    totalIncome: 4200,
    totalExpense: 1500,
    settledToAdmin: 3000,
    balanceShortage: 1200,
    totalProfit: 2700,
    perKmRate: 16,
    tripDetails: createTrips(10, 4200, 1500),
    fuelExpense: 950,
  },
  {
    id: "rec-3",
    driverName: "Amit Kumar",
    date: "2026-06-10",
    status: "submitted",
    avatarColor: AVATAR_COLORS[2],
    trips: 8,
    totalIncome: 3200,
    totalExpense: 1200,
    settledToAdmin: 2500,
    balanceShortage: 700,
    totalProfit: 2000,
    perKmRate: 15,
    tripDetails: createTrips(8, 3200, 1200),
    fuelExpense: 800,
  },
  {
    id: "rec-4",
    driverName: "Vijay Kumar",
    date: "2026-06-10",
    status: "submitted",
    avatarColor: AVATAR_COLORS[3],
    trips: 9,
    totalIncome: 3800,
    totalExpense: 1400,
    settledToAdmin: 3000,
    balanceShortage: 800,
    totalProfit: 2400,
    perKmRate: 17,
    tripDetails: createTrips(9, 3800, 1400),
    fuelExpense: 900,
  },
  {
    id: "rec-5",
    driverName: "Pawan Kumar",
    date: "2026-06-10",
    status: "pending",
    avatarColor: AVATAR_COLORS[4],
    trips: 7,
    totalIncome: 2800,
    totalExpense: 1100,
    settledToAdmin: 2000,
    balanceShortage: 700,
    totalProfit: 1700,
    perKmRate: 14,
    tripDetails: createTrips(7, 2800, 1100),
    fuelExpense: 700,
  },
  {
    id: "rec-6",
    driverName: "Mohan Singh",
    date: "2026-06-10",
    status: "submitted",
    avatarColor: AVATAR_COLORS[0],
    trips: 11,
    totalIncome: 4800,
    totalExpense: 1600,
    settledToAdmin: 3500,
    balanceShortage: 1300,
    totalProfit: 3200,
    perKmRate: 17,
    tripDetails: createTrips(11, 4800, 1600),
    fuelExpense: 1050,
  },
];

export function getMockDailyRecordsData(businessId: string, date: string): DriverRecord[] {
  // In real implementation, filter by business and date
  return mockDriverRecords;
}

export function getMockRecordById(recordId: string): DriverRecord | undefined {
  return mockDriverRecords.find(r => r.id === recordId);
}
