import React, { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";

import { colors, fontSize, radius, spacing } from "../../../../../theme";
import { formatDisplayDate, todayISO } from "../../../../../utils/format";

interface DateSelectorProps {
  selectedDate: string;
  onSelect: (date: string) => void;
}

export function DateSelector({ selectedDate, onSelect }: DateSelectorProps) {
  const [visible, setVisible] = useState(false);

  const handleSelect = (day: { dateString: string }) => {
    onSelect(day.dateString);
    setVisible(false);
  };

  return (
    <>
      <Pressable
        style={({ pressed }) => [styles.selector, pressed && styles.pressed]}
        onPress={() => setVisible(true)}
        testID="date-selector"
      >
        <View style={styles.iconContainer}>
          <Ionicons name="calendar-outline" size={16} color={colors.brand} />
        </View>
        <View style={styles.content}>
          <Text style={styles.label}>Date</Text>
          <View style={styles.valueRow}>
            <Text style={styles.value}>{formatDisplayDate(selectedDate)}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.textTertiary} />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Select Date</Text>
            <Calendar
              current={selectedDate}
              onDayPress={handleSelect}
              maxDate={todayISO()}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.brand,
                },
              }}
              theme={{
                todayTextColor: colors.brand,
                selectedDayBackgroundColor: colors.brand,
                arrowColor: colors.brand,
                textDayFontWeight: "500",
                textMonthFontWeight: "700",
                textDayHeaderFontWeight: "600",
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  pressed: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  value: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    width: "100%",
    maxWidth: 360,
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
});
