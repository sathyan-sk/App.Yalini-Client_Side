/**
 * Brand hero block at the top of the Login screen.
 *
 * Recreates the design's hero stack:
 *  - cityscape backdrop in pale lavender
 *  - \"Yalini App / Enterprises Business\" wordmark with the round car badge
 *  - stylised car-on-road illustration with rupee accent
 *  - \"Track. Control. Profit.\" tagline framed by short rules
 *
 * All visuals are composed from `@expo/vector-icons` + tinted shapes so no
 * raster asset is required — keeps the screen pixel-stable across devices.
 */
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const BrandLogo = require("../../../../../assets/BrandLogo.png");

import { authColors } from "../../theme";

export function LoginHero() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 16 }]} testID="login-hero">
      {/* Wordmark / Logo */}
      <View style={styles.wordmark}>
        <Image source={BrandLogo} style={styles.logoImage} resizeMode="contain" />
        <View style={styles.wordmarkText}>
          <Text style={styles.brandLine}>
            <Text style={styles.brandPrimary}>Yalini </Text>
            <Text style={styles.brandAccent}>Group</Text>
          </Text>
          <Text style={styles.brandSub}>Business Enterprise</Text>
        </View>
      </View>

      {/* Tagline with enhanced lines */}
      <View style={styles.tagRow}>
        <View style={styles.tagRule} />
        <Text style={styles.tagline}>Track. Control. Profit.</Text>
        <View style={styles.tagRule} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: authColors.heroBg,
    paddingHorizontal: 24,
    paddingBottom: 18,
  },

  // Wordmark / Logo
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginTop: 0,
    paddingTop: 24,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  wordmarkText: {
    alignItems: "flex-start",
    justifyContent: "center",
  },
  brandLine: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  brandPrimary: {
    color: authColors.yellow,
    fontWeight: "900",
  },
  brandAccent: {
    color: authColors.YALINI_COLOR2,
    fontWeight: "900",
  },
  brandSub: {
    fontSize: 14,
    color: authColors.heading,
    fontWeight: "500",
    marginTop: 2,
    lineHeight: 18,
  },

  // Tagline
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginTop: 24,
  },
  tagRule: {
    flex: 1,
    height: 2,
    backgroundColor: authColors.yellow,
    borderRadius: 1,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "700",
    color: authColors.heading,
    letterSpacing: 0.8,
  },

});
