export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  More: undefined;
};
/**
 * Native-stack screens reachable from the \"More\" tab.
 * `Settings` is the entry point; `MyBusiness` mounts a full CRUD flow
 * (list → add → edit); the remaining entries stay as placeholders until
 * the respective feature lands.
 */
export type MoreStackParamList = {
  Settings: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  EmployeesAdmin: undefined;
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
};