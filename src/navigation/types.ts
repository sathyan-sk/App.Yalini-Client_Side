export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Finance: undefined;
  Employees: undefined;
  Settings: undefined;
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
 * (list → add → edit) and `Vehicles` mounts the Vehicles module stack.
 */
export type SettingsStackParamList = {
  Settings: undefined;
  MyBusiness: undefined;
  AddBusiness: undefined;
  EditBusiness: { businessId: string };
  Vehicles: undefined;
};
