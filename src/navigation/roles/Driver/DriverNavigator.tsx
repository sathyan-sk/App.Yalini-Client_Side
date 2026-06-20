/**
 * DriverNavigator — root navigator for DRIVER role.
 *
 * Flow:
 *   StartDay (Stack) → shown when no active session
 *   Main (Bottom Tabs) → shown when session is active
 *   SubmittedSuccessfully → shown after successful day submission
 *
 * Stack:
 *   DriverStartDay → StartDayScreen
 *   DriverMain     → DriverTabNavigator (bottom tabs)
 *   SubmittedSuccessfully → Success screen after submission
 *
 * Navigation:
 *   After starting session → navigate to DriverMain
 *   Session submitted      → navigate to SubmittedSuccessfully
 *   Start new day          → reset to DriverStartDay
 */
import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import DriverStartDayScreen from "../../../../src/screens/driverScreens/StartDay/StartDayScreen"
import DriverTabBar from "./DriverTabBar"
import SubmittedSuccessfullyScreen from "../../../../src/screens/driverScreens/SubmittedSuccessfully/SubmittedSuccessfullyScreen"

export type DriverStackParamList = {
  DriverStartDay: undefined
  DriverMain:     undefined
  SubmittedSuccessfully: undefined
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
      <Stack.Screen
        name="SubmittedSuccessfully"
        component={SubmittedSuccessfullyScreen}
        options={{
          gestureEnabled: false, // Prevent swipe back
        }}
      />
    </Stack.Navigator>
  )
}
