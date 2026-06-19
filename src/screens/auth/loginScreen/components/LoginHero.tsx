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
import { StyleSheet, Text, View } from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import { authColors } from "../../theme";

function CityscapeBackdrop() {
  // Hand-tuned silhouette using flex blocks — keeps the file dependency-free.
  const BUILDINGS = [
    { w: 22, h: 38 },
    { w: 32, h: 56 },
    { w: 18, h: 30 },
    { w: 28, h: 64 },
    { w: 26, h: 46 },
    { w: 36, h: 72 },
    { w: 20, h: 34 },
    { w: 30, h: 58 },
    { w: 24, h: 42 },
    { w: 34, h: 60 },
    { w: 22, h: 32 },
    { w: 28, h: 50 },
  ];
  return (
    <View pointerEvents="none" style={styles.cityRow}>
      {BUILDINGS.map((b, i) => (
        <View
          key={i}
          style={[
            styles.building,
            { width: b.w, height: b.h, marginRight: i % 2 === 0 ? 2 : 6 },
          ]}
        />
      ))}
    </View>
  );
}

export function LoginHero() {
  return (
    <View style={styles.wrap} testID="login-hero">
      <CityscapeBackdrop />

      {/* Wordmark */}
      <View style={styles.wordmark}>
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Ionicons name="car" size={26} color="#0B1F3F" />
            <View style={styles.pin}>
              <Ionicons name="location-sharp" size={10} color="#0B1F3F" />
            </View>
          </View>
        </View>
        <View style={styles.wordmarkText}>
          <Text style={styles.brandLine}>
            <Text style={styles.brandDark}>Yalini </Text>
            <Text style={styles.brandYellow}>App</Text>
          </Text>
          <Text style={styles.brandSub}>Enterprises Business</Text>
        </View>
      </View>

      {/* Car illustration */}
      <View style={styles.carRow}>
        <View style={styles.trailLeft} />
        <View style={styles.carWrap}>
          <FontAwesome5 name="car-side" size={64} color="#0B1F3F" />
          <View style={styles.rupeeWrap}>
            <FontAwesome5 name="rupee-sign" size={20} color="#0B1F3F" />
          </View>
        </View>
        <View style={styles.trailRight} />
      </View>

      {/* Tagline */}
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
    paddingTop: 8,
    paddingBottom: 18,
  },

  // Cityscape
  cityRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 80,
    height: 80,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    opacity: 0.5,
  },
  building: {
    backgroundColor: authColors.cityTint,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  // Wordmark
  wordmark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 6,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: authColors.yellow,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  badgeInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  pin: {
    position: "absolute",
    right: -6,
    bottom: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: authColors.yellow,
    alignItems: "center",
    justifyContent: "center",
  },
  wordmarkText: {
    alignItems: "flex-start",
  },
  brandLine: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  brandDark: {
    color: authColors.heading,
  },
  brandYellow: {
    color: authColors.yellow,
  },
  brandSub: {
    fontSize: 13,
    color: authColors.heading,
    fontWeight: "500",
    marginTop: -2,
  },

  // Car
  carRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  carWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  rupeeWrap: {
    position: "absolute",
    right: -14,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: authColors.yellowSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  trailLeft: {
    flex: 1,
    height: 6,
    backgroundColor: authColors.yellow,
    borderRadius: 3,
    opacity: 0.85,
  },
  trailRight: {
    flex: 1,
    height: 6,
    backgroundColor: authColors.yellow,
    borderRadius: 3,
    opacity: 0.85,
  },

  // Tagline
  tagRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  tagRule: {
    width: 24,
    height: 2,
    backgroundColor: authColors.heading,
  },
  tagline: {
    fontSize: 15,
    fontWeight: "700",
    color: authColors.heading,
    letterSpacing: 0.4,
  },
});
