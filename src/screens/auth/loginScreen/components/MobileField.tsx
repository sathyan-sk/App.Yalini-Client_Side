/**
 * Mobile number field — pixel match for the design.
 *
 * Leading phone icon in yellow, yellow rounded border, light card shadow,
 * numeric keypad, max 10 digits (Indian mobile format). Pure controlled
 * component, no internal state.
 */
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { authColors } from "../../theme";

interface Props {
  value: string;
  onChangeText: (v: string) => void;
  editable?: boolean;
  onSubmitEditing?: () => void;
}

export function MobileField({ value, onChangeText, editable = true, onSubmitEditing }: Props) {
  return (
    <View testID="login-mobile-field">
      <Text style={styles.label}>Login Id (Mobile No)</Text>
      <View style={styles.box}>
        <View style={styles.iconWrap}>
          <Ionicons name="call" size={22} color={authColors.yellow} />
        </View>
        <TextInput
          testID="login-mobile-input"
          value={value}
          onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, "").slice(0, 10))}
          placeholder="Enter mobile number"
          placeholderTextColor={authColors.muted}
          keyboardType="number-pad"
          maxLength={10}
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
          onSubmitEditing={onSubmitEditing}
          editable={editable}
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    fontWeight: "800",
    color: authColors.heading,
    marginBottom: 10,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: authColors.fieldBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: authColors.fieldBorder,
    paddingHorizontal: 12,
    shadowColor: authColors.fieldShadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconWrap: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: authColors.heading,
    fontWeight: "500",
    paddingVertical: 0,
  },
});
