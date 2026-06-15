import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "../src/navigation/RootNavigator";

// expo-router owns the shell; the entire in-app navigation tree (bottom tabs
// + nested stacks) is delegated to React Navigation via RootNavigator.
// SafeAreaProvider is mounted here so every nested screen / header can use
// `useSafeAreaInsets`.
export default function Index() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}