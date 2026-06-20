import React from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontSize, radius, spacing } from "../theme";

// ─────────────────────────────────────
// TAB CONFIG TYPE
// exported so each navigator can define its own
// ─────────────────────────────────────
export interface TabItemConfig {
  label: string
  icon:  keyof typeof Feather.glyphMap
}

export type TabBarConfig = Record<string, TabItemConfig>

// ─────────────────────────────────────
// PROPS
// ─────────────────────────────────────
interface AppTabBarProps extends BottomTabBarProps {
  tabConfig: TabBarConfig   // ← each navigator passes its own
}

/**
 * AppTabBar — shared custom bottom tab bar.
 *
 * Frosted glass on iOS, solid on Android.
 * Dot indicator on active tab.
 *
 * Knows nothing about roles — each navigator
 * passes its own tabConfig so this component
 * stays pure and reusable across all roles.
 */
export function AppTabBar({
  state,
  navigation,
  tabConfig,       // ← received from navigator
}: AppTabBarProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={styles.row}>
      {state.routes.map((route, index) => {
        const config  = tabConfig[route.name]
        const focused = state.index === index

        // skip if route not in config
        if (!config) return null

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <Pressable
            key={route.key}
            testID={`tab-${route.name.toLowerCase()}`}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
          >
            <Feather
              name={config.icon}
              size={22}
              color={focused ? colors.brand : colors.textTertiary}
            />
            <Text
              style={[styles.label, focused && styles.labelActive]}
              numberOfLines={1}
            >
              {config.label}
            </Text>
            <View style={[styles.dot, focused && styles.dotActive]} />
          </Pressable>
        )
      })}
    </View>
  )

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, spacing.sm) }
      ]}
      testID="bottom-tab-bar"
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={80}
          tint="light"
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.solidBg]} />
      )}
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    overflow: "hidden",
  },
  solidBg: {
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: "row",
    paddingTop: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    minHeight: 48,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  labelActive: {
    color: colors.brand,
    fontWeight: "500",
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: "transparent",
  },
  dotActive: {
    backgroundColor: colors.brand,
  },
});
