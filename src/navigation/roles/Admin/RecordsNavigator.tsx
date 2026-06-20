import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RecordsHomeScreen from "../../../screens/adminScreens/Records/RecordsHomeScreen";
import TaxiRecordDetailsScreen from "../../../screens/adminScreens/Records/components/BusinessTypeRecords/TaxiRecordDetailsScreen";
import WaterRecordDetailsScreen from "../../../screens/adminScreens/Records/components/BusinessTypeRecords/WaterRecordDetailsScreen";
import type { RecordsStackParamList } from "../../../types/navigation";

const Stack = createNativeStackNavigator<RecordsStackParamList>();

/**
 * Records Stack Navigator
 * One module = One Stack = Multiple screens inside it
 * 
 * Screens:
 * - RecordsHome: Entry point showing list of all records (Taxi + Water businesses)
 * - TaxiRecordDetails: Detailed view for taxi/cab driver records
 * - WaterRecordDetails: Detailed view for water delivery records
 */
export default function RecordsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Entry Point - Records List */}
      <Stack.Screen name="RecordsHome" component={RecordsHomeScreen} />

      {/* Detail Screens */}
      <Stack.Screen name="TaxiRecordDetails" component={TaxiRecordDetailsScreen} />
      <Stack.Screen name="WaterRecordDetails" component={WaterRecordDetailsScreen} />
    </Stack.Navigator>
  );
}