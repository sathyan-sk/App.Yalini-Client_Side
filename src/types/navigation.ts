/**
 * Navigation type definitions for the app
 * Unified navigation types to ensure consistency across the app
 */

export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Employees: undefined;
  Settings: undefined;
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