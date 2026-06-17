/**
 * Navigation type definitions for the app
 */

export type RootTabParamList = {
  Dashboard: undefined;
  DailyRecords: undefined;
  Settings: undefined;
};

/**
 * Native-stack screens for the DailyRecords tab.
 * DailyRecordsList is the entry point; RecordDetails shows individual record.
 */
export type DailyRecordsStackParamList = {
  DailyRecordsList: undefined;
  RecordDetails: { recordId: string };
};

/**
 * Native-stack screens reachable from the Settings tab.
 */
export type SettingsStackParamList = {
  SettingsHome: undefined;
};
