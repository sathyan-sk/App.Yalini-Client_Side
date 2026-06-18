import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RecordsHomeScreen from "../screens/adminScreens/Records/RecordsHomeScreen";
import TaxiRecordDetailsScreen from "../screens/adminScreens/Records/components/BusinessTypeRecords/TaxiRecordDetailsScreen";
import WaterDailyRecordsScreen from "../screens/adminScreens/Records/components/BusinessTypeRecords/WaterRecordsScreen";
import WaterRecordDetailsScreen from "../screens/adminScreens/Records/components/BusinessTypeRecords/WaterRecordDetailsScreen";


const Stack = createNativeStackNavigator();

export default function RecordsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      {/* Entry */}
      <Stack.Screen name="DailyRecords" component={RecordsHomeScreen} />

      {/* Taxi Records */}
      <Stack.Screen name="TaxiRecordDetailed" component={TaxiRecordDetailsScreen} />

      {/* Water Records */}
      <Stack.Screen name="WaterRecords" component={WaterDailyRecordsScreen} />
      <Stack.Screen name="WaterRecordDetailed" component={WaterRecordDetailsScreen} />
    </Stack.Navigator>
  );
}