/**
 * DriverNavigator — root navigator for DRIVER role.
 *
 * Flow:
 *   StartDay (Stack) → shown when no active session
 *   Main (Bottom Tabs) → shown when session is active
 *
 * Stack:
 *   DriverStartDay → StartDayScreen
 *   DriverMain     → DriverTabNavigator (bottom tabs)
 *
 * Navigation:
 *   After starting session → navigate to DriverMain
 *   Session submitted      → stays on tabs (locked)
 */
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import DriverStartDayScreen from "../../../../src/screens/driverScreens/StartDay/StartDayScreen"
import DriverTabBar from "./DriverTabBar"

export type DriverStackParamList = {
  DriverStartDay: undefined
  DriverMain:     undefined
}

const Stack = createNativeStackNavigator<DriverStackParamList>()

export default function DriverNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DriverStartDay"
        component={DriverStartDayScreen}
      />
      <Stack.Screen
        name="DriverMain"
        component={DriverTabBar}
      />
    </Stack.Navigator>
  )
}