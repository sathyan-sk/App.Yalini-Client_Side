import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FinanceScreen from "../../../screens/adminScreens/Finance/FinanceScreen";

export type FinanceStackParamList = {
  FinanceHome: undefined;
  FinanceDetails: { recordId: string };
};

const Stack = createNativeStackNavigator<FinanceStackParamList>();

export default function FinanceNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FinanceHome" component={FinanceScreen} />
    </Stack.Navigator>
  );
}