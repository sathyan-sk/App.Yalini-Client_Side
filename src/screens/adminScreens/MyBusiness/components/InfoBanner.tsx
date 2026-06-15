import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, fontSize, radius, spacing } from "../../../../theme";

interface InfoBannerProps {
  title: string;
  body: string;
  testID?: string;
  /** Dashed border variant — used for the bottom \"About Business Types\" callout. */
  dashed?: boolean;
}

/**
 * Soft-blue informational callout.
 *
 * Two variants by `dashed`:
 *  - false (default) → solid filled card used inline within forms
 *    (e.g. \"How it works?\" tip on Add Business).
 *  - true            → dashed-border card used as the footer on the
 *    Businesses list (\"About Business Types\").
 */
export function InfoBanner({ title, body, testID, dashed = false }: InfoBannerProps) {
  return (
    <View
      style={[styles.container, dashed && styles.dashed]}
      testID={testID}
    >
      <View style={styles.iconWrap}>
        <Ionicons name="information-circle" size={20} color="#2563EB" />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#EEF2FF",
  },
  dashed: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#C7D2FE",
  },
  iconWrap: {
    marginTop: 1,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: "700",
    color: "#1E3A8A",
  },
  body: {
    fontSize: fontSize.sm,
    lineHeight: 18,
    color: colors.textSecondary,
  },
});
