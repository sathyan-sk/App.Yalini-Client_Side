/**
 * Mock data for Driver module
 * Used when USE_MOCK is true in featureFlags
 */

import type { DriverHomeData } from "../types/driver";

/**
 * Default driver home data - no trips scenario
 */
export const DEFAULT_DRIVER_HOME_DATA: DriverHomeData = {
  driver: {
    id: "DRIVER_001",
    name: "Ramesh Kumar",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: {
    vehicleId: "VEHICLE_001",
    vehicleName: "Innova Crysta",
    vehicleNumber: "TN 01 AB 1234",
    isAssigned: true,
  },
  sessionStatus: "OPEN",
  sessionDate: "19 Jun 2026",
  sessionStartTime: "08:05 AM",
  todayOverview: {
    totalTrips: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
  recentActivity: [],
  notificationCount: 2,
};

/**
 * Driver home data with trips - active day scenario
 */
export const DRIVER_HOME_DATA_WITH_TRIPS: DriverHomeData = {
  driver: {
    id: "DRIVER_001",
    name: "Ramesh Kumar",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: {
    vehicleId: "VEHICLE_001",
    vehicleName: "Innova Crysta",
    vehicleNumber: "TN 01 AB 1234",
    isAssigned: true,
  },
  sessionStatus: "OPEN",
  sessionDate: "19 Jun 2026",
  sessionStartTime: "08:05 AM",
  todayOverview: {
    totalTrips: 5,
    totalIncome: 3250,
    totalExpenses: 520,
  },
  recentActivity: [
    {
      id: "activity_1",
      type: "trip",
      description: "Trip to RS Puram",
      amount: 900,
      time: "01:15 PM",
    },
    {
      id: "activity_2",
      type: "expense",
      description: "Fuel expense added",
      amount: 120,
      time: "01:20 PM",
    },
    {
      id: "activity_3",
      type: "trip",
      description: "Trip to Peelamedu",
      amount: 900,
      time: "10:45 AM",
    },
  ],
  notificationCount: 3,
};

/**
 * Driver without vehicle assignment scenario
 */
export const DRIVER_NO_ASSIGNMENT_DATA: DriverHomeData = {
  driver: {
    id: "DRIVER_002",
    name: "Suresh Babu",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: null,
  sessionStatus: "OPEN",
  sessionDate: "19 Jun 2026",
  sessionStartTime: "",
  todayOverview: {
    totalTrips: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
  recentActivity: [],
  notificationCount: 1,
};
