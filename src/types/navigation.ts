/**
 * Navigation type definitions for the app
 * Unified navigation types to ensure consistency across the app
 * Updated to support Staff and Driver modules
 */

import type { AllTripsTrip, TripExpense } from './driver';

// Admin Tab Navigation
export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Employees: undefined;
  Settings: undefined;
};

// Driver Tab Navigation
export type DriverTabParamList = {
  DriverHome: undefined;
  AddTrip: undefined;
  AllTripsStack: undefined;
  Checkout: undefined;
};

// Staff Tab Navigation
export type StaffTabParamList = {
  StaffHome: undefined;
  AddDelivery: undefined;
  AllDeliveries: undefined;
  StaffCheckout: undefined;
};

// Driver Stack Navigation (root navigator for DRIVER role)
export type DriverStackParamList = {
  DriverStartDay: undefined;
  DriverMain: undefined;
  SubmittedSuccessfully: undefined;
};

// Staff Stack Navigation (root navigator for STAFF role)
export type StaffStackParamList = {
  StaffStartDay: undefined;
  StaffMain: undefined;
  SubmittedSuccessfully: undefined;
};

// AllTrips Stack Navigation (stack within AllTrips tab)
export type AllTripsStackParamList = {
  AllTripsList: undefined;
  EditPreview: {
    tripId: string;
  };
  AddExpenseForTrip: {
    tripId: string;
    mode: 'add' | 'edit';
  };
};
// AllDeliveries Stack Navigation (stack within AllDeliveries tab for Staff)
export type AllDeliveriesStackParamList = {
  AllDeliveriesList: undefined;
  EditPreview: {
    deliveryId: string;
  };
};
/**
 * Native-stack screens for the Records tab (DailyRecords).
 * RecordsHome is the entry point showing both Taxi and Water business records.
 * RecordDetails screens show individual record details.
 */
export type RecordsStackParamList = {
  RecordsHome: undefined;
  TaxiRecordDetails: { recordId: string };
  WaterRecordDetails: { recordId: string };
};

/**
 * Native-stack screens for the Employees tab.
 * EmployeesList is the entry point; Add/Edit screens handle CRUD.
 */
export type EmployeesStackParamList = {
  EmployeesList: undefined;
  AddEmployee: undefined;
  EditEmployee: { employeeId: string };
};

/**
 * Native-stack screens reachable from the Settings tab.
 * `SettingsHome` is the entry point; `MyBusiness` mounts a full CRUD flow
 */
export type SettingsStackParamList = {
  SettingsHome: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
  AssignAsset: { employeeId?: string; assetType?: "vehicle" | "hotel" };
};
