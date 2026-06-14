export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  More: undefined;
};
/**
 * Native-stack screens reachable from the \"More\" tab.
 * `Settings` is the entry point; the rest are placeholder destinations
 * surfaced by the settings rows until each feature lands.
 */
export type MoreStackParamList = {
  Settings: undefined;
  MyBusiness: undefined;
  EmployeesAdmin: undefined;
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
};