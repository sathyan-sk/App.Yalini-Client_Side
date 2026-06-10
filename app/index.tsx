import RootNavigator from "../src/navigation/RootNavigator";

// The project boots through the expo-router shell (protected entry point),
// but all in-app navigation is owned by React Navigation — see
// src/navigation/RootNavigator.tsx.
export default function Index() {
  return <RootNavigator />;
}
