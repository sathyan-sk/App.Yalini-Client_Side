/**
 * Mock data for Driver Home Screen
 * Realistic INR amounts and Indian context
 */

import type { DriverHomeData } from "../types/driver";

// Mock data for driver with active day session
export const DRIVER_HOME_DATA_ACTIVE: DriverHomeData = {
  driver: {
    id: "emp_seed_ramesh",
    name: "Ramesh Kumar",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: {
    vehicleId: "veh_seed_swift_dzire",
    vehicleName: "Swift Dzire",
    vehicleNumber: "TN 01 AB 1234",
    isAssigned: true,
  },
  sessionStatus: "OPEN",
  sessionDate: "10 May 2024",
  sessionStartTime: "08:05 AM",
  todayOverview: {
    totalTrips: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
  recentActivity: [],
  notificationCount: 2,
};

// Mock data with trips
export const DRIVER_HOME_DATA_WITH_TRIPS: DriverHomeData = {
  driver: {
    id: "emp_seed_ramesh",
    name: "Ramesh Kumar",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: {
    vehicleId: "veh_seed_swift_dzire",
    vehicleName: "Swift Dzire",
    vehicleNumber: "TN 01 AB 1234",
    isAssigned: true,
  },
  sessionStatus: "OPEN",
  sessionDate: "10 May 2024",
  sessionStartTime: "08:05 AM",
  todayOverview: {
    totalTrips: 5,
    totalIncome: 2350,
    totalExpenses: 450,
  },
  recentActivity: [
    {
      id: "act_1",
      type: "trip",
      description: "Trip to Airport",
      amount: 850,
      time: "11:30 AM",
    },
    {
      id: "act_2",
      type: "expense",
      description: "Fuel (5L Petrol)",
      amount: 550,
      time: "10:45 AM",
    },
    {
      id: "act_3",
      type: "trip",
      description: "Trip to Central Station",
      amount: 350,
      time: "09:15 AM",
    },
  ],
  notificationCount: 2,
};

// Mock data for no assignment
export const DRIVER_HOME_DATA_NO_ASSIGNMENT: DriverHomeData = {
  driver: {
    id: "emp_seed_ramesh",
    name: "Ramesh Kumar",
    businessName: "City Taxi Service",
    businessType: "taxi",
    role: "Driver",
  },
  assignment: null,
  sessionStatus: "OPEN",
  sessionDate: "10 May 2024",
  sessionStartTime: "",
  todayOverview: {
    totalTrips: 0,
    totalIncome: 0,
    totalExpenses: 0,
  },
  recentActivity: [],
  notificationCount: 1,
};

// Default mock data
export const DEFAULT_DRIVER_HOME_DATA = DRIVER_HOME_DATA_ACTIVE;
