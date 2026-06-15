import { SafeAreaProvider } from "react-native-safe-area-context";

import RootNavigator from "../src/navigation/RootNavigator";

/**
 * expo-router owns the shell; the entire in-app navigation tree
 * (bottom tabs + nested native stacks) is delegated to React Navigation
 * via `RootNavigator`. SafeAreaProvider is mounted here so every nested
 * screen / header can call `useSafeAreaInsets`.
 *
 * IMPORTANT: only one `NavigationContainer` may exist in the tree.
 * `RootNavigator` owns it (wrapped in `NavigationIndependentTree` so
 * it boots independently of expo-router's internal navigator).
 */
export default function Index() {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
