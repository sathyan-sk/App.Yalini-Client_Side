import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  useEffect(() => {
    async function prepare() {
      console.log("APP STARTED 🔥");
      try {
        await SplashScreen.preventAutoHideAsync();
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Splash error:", e);
      }
    }

    prepare();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}