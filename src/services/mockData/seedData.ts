/**
 * Seed data for the Mock Service Layer.
 *
 * This file defines all the initial data with proper relationships:
 * - Businesses → Employees → Vehicles/Hotels → Records
 *
 * All IDs are stable and use a consistent naming convention:
 * - Businesses: biz_seed_
 * - Employees: emp_seed_
 * - Vehicles: veh_seed_
 * - Hotels: hotel_seed_
 */

import { colors } from '../../theme';
import type {
  MockBusiness,
  MockEmployee,
  MockVehicle,
  MockHotel,
  MockDriverRecord,
  MockWaterDeliveryRecord,
  TripDetail,
  HotelDelivery,
} from './types';

const AVATAR_COLORS = [
  colors.avatarBlue,
  colors.avatarPurple,
  colors.avatarGreen,
  colors.avatarOrange,
  colors.avatarVividPurple,
  colors.avatarTeal,
  colors.avatarCyan,
];

// ============================================================================
// SEED BUSINESSES
// ============================================================================
export const SEED_BUSINESSES: MockBusiness[] = [
  {
    id: 'biz_seed_city_taxi',
    name: "City Taxi",
    type: 'taxi',
    mode: 'auto',
    status: 'enabled',
    employees: 4,
    createdAt: '2026-06-10',
  },
  {
    id: 'biz_seed_yalini_minerals',
    name: 'Yalini Minerals',
    type: 'water_delivery',
    mode: 'manual',
    status: 'enabled',
    employees: 3,
    createdAt: '2026-06-05',
  },
];

// ============================================================================
// SEED EMPLOYEES
// ============================================================================
export const SEED_EMPLOYEES: MockEmployee[] = [
  // Taxi business employees
  {
    id: 'emp_seed_ramesh',
    fullName: 'Ramesh Kumar',
    mobile: '9876543210',
    businessId: 'biz_seed_city_taxi',
    businessName: "City Taxi",
    businessType: 'taxi',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-10',
  },
  {
    id: 'emp_seed_ajay',
    fullName: 'Ajay Verma',
    mobile: '9876543212',
    businessId: 'biz_seed_city_taxi',
    businessName: "City Taxi",
    businessType: 'taxi',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-08',
  },
  {
    id: 'emp_seed_deepak',
    fullName: 'Deepak Patel',
    mobile: '9876543214',
    businessId: 'biz_seed_city_taxi',
    businessName: "City Taxi",
    businessType: 'taxi',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-06',
  },
  {
    id: 'emp_seed_vijay',
    fullName: 'Vijay Kumar',
    mobile: '9876543216',
    businessId: 'biz_seed_city_taxi',
    businessName: "City Taxi",
    businessType: 'taxi',
    pin: '1234',
    status: 'disabled',
    createdAt: '2026-06-04',
  },
  // Water delivery business employees
  {
    id: 'emp_seed_suresh',
    fullName: 'Suresh Kumar',
    mobile: '9876543211',
    businessId: 'biz_seed_yalini_minerals',
    businessName: 'Yalini Minerals',
    businessType: 'water_delivery',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-09',
  },
  {
    id: 'emp_seed_mani',
    fullName: 'Mani Kumar',
    mobile: '9876543213',
    businessId: 'biz_seed_yalini_minerals',
    businessName: 'Yalini Minerals',
    businessType: 'water_delivery',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-07',
  },
  {
    id: 'emp_seed_pawan',
    fullName: 'Pawan Prasad',
    mobile: '9876543215',
    businessId: 'biz_seed_yalini_minerals',
    businessName: 'Yalini Minerals',
    businessType: 'water_delivery',
    pin: '1234',
    status: 'enabled',
    createdAt: '2026-06-05',
  },
];

// ============================================================================
// SEED VEHICLES (linked to taxi employees)
// ============================================================================
export const SEED_VEHICLES: MockVehicle[] = [
  {
    id: 'veh_seed_swift_dzire',
    name: 'Swift Dzire',
    number: 'TN01AB1234',
    status: 'enabled',
    assignedDriver: 'Ramesh Kumar',
    assignedEmployeeId: 'emp_seed_ramesh',
    notes: 'Regular maintenance completed last week',
    createdAt: '2026-06-10',
    updatedAt: '2026-06-15',
  },
  {
    id: 'veh_seed_innova_crysta',
    name: 'Innova Crysta',
    number: 'TN01CD5678',
    status: 'enabled',
    assignedDriver: 'Ajay Verma',
    assignedEmployeeId: 'emp_seed_ajay',
    notes: 'Premium vehicle for airport transfers',
    createdAt: '2026-06-05',
    updatedAt: '2026-07-01',
  },
  {
    id: 'veh_seed_wagon_r',
    name: 'Wagon R',
    number: 'TN01EF9012',
    status: 'enabled',
    assignedDriver: 'Deepak Patel',
    assignedEmployeeId: 'emp_seed_deepak',
    notes: '',
    createdAt: '2026-06-01',
    updatedAt: '2026-06-01',
  },
  {
    id: 'veh_seed_honda_city',
    name: 'Honda City',
    number: 'TN01GH3456',
    status: 'disabled',
    assignedDriver: undefined,
    assignedEmployeeId: undefined,
    notes: 'Under maintenance',
    createdAt: '2026-05-20',
    updatedAt: '2026-06-10',
  },
];

// ============================================================================
// SEED HOTELS (linked to water delivery employees)
// ============================================================================
export const SEED_HOTELS: MockHotel[] = [
  {
    id: 'hotel_seed_golden_palace',
    name: 'Hotel Golden Palace',
    ratePerCan: 25,
    status: 'enabled',
    location: 'MG Road, Sector 5',
    assignedEmployeeId: 'emp_seed_suresh',
    assignedEmployeeName: 'Suresh Kumar',
    createdAt: '2026-06-10',
  },
  {
    id: 'hotel_seed_royal_inn',
    name: 'Royal Inn',
    ratePerCan: 28,
    status: 'enabled',
    location: 'Anna Nagar, Block B',
    assignedEmployeeId: 'emp_seed_suresh',
    assignedEmployeeName: 'Suresh Kumar',
    createdAt: '2026-06-08',
  },
  {
    id: 'hotel_seed_green_valley',
    name: 'Green Valley Resort',
    ratePerCan: 30,
    status: 'enabled',
    location: 'Velachery Main Road',
    assignedEmployeeId: 'emp_seed_mani',
    assignedEmployeeName: 'Mani Kumar',
    createdAt: '2026-06-06',
  },
  {
    id: 'hotel_seed_sunrise',
    name: 'Sunrise Hotel',
    ratePerCan: 22,
    status: 'enabled',
    location: 'T Nagar, North Street',
    assignedEmployeeId: 'emp_seed_mani',
    assignedEmployeeName: 'Mani Kumar',
    createdAt: '2026-06-04',
  },
  {
    id: 'hotel_seed_blue_ocean',
    name: 'Hotel Blue Ocean',
    ratePerCan: 26,
    status: 'enabled',
    location: 'Adyar, 2nd Cross',
    assignedEmployeeId: 'emp_seed_pawan',
    assignedEmployeeName: 'Pawan Prasad',
    createdAt: '2026-06-02',
  },
  {
    id: 'hotel_seed_mountain_view',
    name: 'Mountain View Hotel',
    ratePerCan: 24,
    status: 'disabled',
    location: 'Guindy Industrial Estate',
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
    createdAt: '2026-05-28',
  },
];

// ============================================================================
// HELPER FUNCTIONS FOR GENERATING RECORDS
// ============================================================================

const TRIP_DESTINATIONS = [
  'Airport to MG Road',
  'Railway Station to City Center',
  'City Center to Hospital',
  'Hotel Green to Market',
  'Airport to Hotel Blue',
  'Mall to Tech Park',
  'Station to Airport',
  'Bus Stand to University',
  'Hospital to Railway Station',
  'Downtown to Suburbs',
  'Tech Park to Airport',
  'University to Mall',
];

function createTrips(count: number): TripDetail[] {
  const trips: TripDetail[] = [];
  for (let i = 0; i < count; i++) {
    const incomeVariation = Math.floor(Math.random() * 400) + 150;
    const expenseVariation = Math.floor(Math.random() * 120) + 60;
    const distance = parseFloat((Math.random() * 15 + 5).toFixed(1));

    trips.push({
      id: `trip-${Date.now()}-${i}`,
      tripNumber: i + 1,
      destination: TRIP_DESTINATIONS[i % TRIP_DESTINATIONS.length],
      distance,
      income: incomeVariation,
      expense: expenseVariation,
    });
  }
  return trips;
}

function createHotelDeliveries(hotels: MockHotel[], employeeId: string): HotelDelivery[] {
  const assignedHotels = hotels.filter(h => h.assignedEmployeeId === employeeId && h.status === 'enabled');

  return assignedHotels.map((hotel, index) => {
    const totalCans = Math.floor(Math.random() * 30) + 10;
    const deliveredCans = Math.floor(totalCans * (0.7 + Math.random() * 0.3));
    const returnedCans = Math.floor(Math.random() * 5);
    const outstandingCans = Math.max(0, totalCans - deliveredCans - returnedCans);
    const income = deliveredCans * hotel.ratePerCan;
    const expense = Math.floor(income * 0.15);
    const profit = income - expense;

    return {
      id: `delivery-${hotel.id}-${Date.now()}`,
      hotelName: hotel.name,
      location: hotel.location || '',
      totalCans,
      deliveredCans,
      returnedCans,
      outstandingCans,
      income,
      expense,
      profit,
    };
  });
}

// ============================================================================
// GENERATE SEED DRIVER RECORDS (from taxi employees + vehicles)
// ============================================================================
export function generateSeedDriverRecords(): MockDriverRecord[] {
  const taxiEmployees = SEED_EMPLOYEES.filter(
    e => e.businessType === 'taxi' && e.status === 'enabled'
  );

  const records: MockDriverRecord[] = [];
  const currentDate = '2026-06-10';

  taxiEmployees.forEach((employee, index) => {
    // Find assigned vehicle for this employee
    const vehicle = SEED_VEHICLES.find(v => v.assignedEmployeeId === employee.id);

    if (!vehicle) return; // Skip if no vehicle assigned

    const tripCount = Math.floor(Math.random() * 6) + 7; // 7-12 trips
    const tripDetails = createTrips(tripCount);
    const totalIncome = tripDetails.reduce((sum, t) => sum + t.income, 0);
    const totalExpense = tripDetails.reduce((sum, t) => sum + t.expense, 0);
    const fuelExpense = Math.floor(totalIncome * 0.2);
    const settledToAdmin = Math.floor(totalIncome * 0.7);
    const balanceShortage = totalIncome - settledToAdmin - totalExpense;
    const totalProfit = totalIncome - totalExpense;

    records.push({
      id: `rec_taxi_${employee.id}_${currentDate}`,
      driverName: employee.fullName,
      employeeId: employee.id,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleNumber: vehicle.number,
      date: currentDate,
      status: index < 2 ? 'submitted' : 'pending',
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      trips: tripCount,
      totalIncome,
      totalExpense,
      settledToAdmin,
      balanceShortage,
      totalProfit,
      perKmRate: Math.floor(Math.random() * 5) + 14,
      tripDetails,
      fuelExpense,
    });
  });

  return records;
}

// ============================================================================
// GENERATE SEED WATER DELIVERY RECORDS (from water employees + hotels)
// ============================================================================
export function generateSeedWaterDeliveryRecords(): MockWaterDeliveryRecord[] {
  const waterEmployees = SEED_EMPLOYEES.filter(
    e => e.businessType === 'water_delivery' && e.status === 'enabled'
  );

  const records: MockWaterDeliveryRecord[] = [];
  const currentDate = '2026-06-10';

  waterEmployees.forEach((employee, index) => {
    const hotelDeliveries = createHotelDeliveries(SEED_HOTELS, employee.id);

    if (hotelDeliveries.length === 0) return; // Skip if no hotels assigned

    const totals = hotelDeliveries.reduce(
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

    records.push({
      id: `rec_water_${employee.id}_${currentDate}`,
      deliveryPersonName: employee.fullName,
      employeeId: employee.id,
      date: currentDate,
      status: index < 2 ? 'submitted' : 'pending',
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      ...totals,
      hotelDeliveries,
    });
  });

  return records;
}
