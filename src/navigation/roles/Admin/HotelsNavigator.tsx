/**
 * Stack navigator for the Hotels module.
 *
 * Provides navigation between:
 * - AllHotels (list view with stats, search, filters)
 * - AddHotel (form to add new hotel)
 * - EditHotel (form to edit existing hotel)
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AllHotelsScreen from "../../../screens/adminScreens/Hotels/AllHotelsScreen";
import AddHotelScreen from "../../../screens/adminScreens/Hotels/AddHotelScreen";
import EditHotelScreen from "../../../screens/adminScreens/Hotels/EditHotelScreen";

export type HotelsStackParamList = {
  AllHotels: undefined;
  AddHotel: undefined;
  EditHotel: { hotelId: string };
};

const Stack = createNativeStackNavigator<HotelsStackParamList>();

export default function HotelsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllHotels" component={AllHotelsScreen} />
      <Stack.Screen
        name="AddHotel"
        component={AddHotelScreen}
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="EditHotel"
        component={EditHotelScreen}
        options={{ animation: "slide_from_right" }}
      />
    </Stack.Navigator>
  );
}
