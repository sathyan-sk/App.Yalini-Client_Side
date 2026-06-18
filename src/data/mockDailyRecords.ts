/**
 * Mock data for Daily Records screens
 * Delete this file once backend is integrated
 */

import type { Business, DriverRecord, TripDetail } from "../types/taxiRecords";
import type { Business as WaterBusiness } from "../types/waterRecords";
import { colors } from "../theme";

const AVATAR_COLORS = [
  colors.avatarBlue,
  colors.avatarPurple,
  colors.avatarGreen,
  colors.avatarOrange,
  colors.avatarVividPurple,
];

export const mockBusinesses: (Business | WaterBusiness)[] = [
  { id: "bus-1", name: "Yalini Cab's", type: "taxi" },
  { id: "bus-2", name: "Yalini Mineral's", type: "water" },
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
    employeeId: "emp_seed_ramesh",
    vehicleId: "veh_seed_swift_dzire",
    vehicleName: "Swift Dzire",
    vehicleNumber: "TN01AB1234",
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
    employeeId: "emp_seed_suresh",
    vehicleId: "veh_seed_honda_city",
    vehicleName: "Honda City",
    vehicleNumber: "TN01CD5678",
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
    employeeId: "emp_seed_amit",
    vehicleId: "veh_seed_tata_indica",
    vehicleName: "Tata Indica",
    vehicleNumber: "TN01EF9012",
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
    employeeId: "emp_seed_vijay",
    vehicleId: "veh_seed_maruti_suzuki",
    vehicleName: "Maruti Suzuki",
    vehicleNumber: "TN01GH3456",
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
    employeeId: "emp_seed_pawan",
    vehicleId: "veh_seed_nissan_micra",
    vehicleName: "Nissan Micra",
    vehicleNumber: "TN01IJ7890",
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
    employeeId: "emp_seed_mohan",
    vehicleId: "veh_seed Toyota Camry",
    vehicleName: "Toyota Camry",
    vehicleNumber: "TN01KL1234",
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
