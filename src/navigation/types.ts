export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  SettingsHome: undefined;
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
 * `Settings` is the entry point; `MyBusiness` mounts a full CRUD flow
 */
export type SettingsStackParamList = {
  SettingsHome: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  Vehicles: undefined;
  Hotels: undefined;
  AssignAssets: undefined;
};
