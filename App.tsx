import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  const [loaded, error] = useFonts({
    // Example:
    // Inter: require("./assets/fonts/Inter.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        if (loaded || error) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        console.warn("Splash error:", e);
      }
    }

    prepare();
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}