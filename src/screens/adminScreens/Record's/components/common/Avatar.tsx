import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fontSize, radius } from "../../../../../theme";

interface AvatarProps {
  name: string;
  color: string;
  size?: number;
  testID?: string;
}

export function Avatar({ name, color, size = 40, testID }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <View 
      style={[
        styles.avatar, 
        { 
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        }
      ]} 
      testID={testID}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  initial: {
    color: colors.surface,
    fontWeight: "700",
  },
});
