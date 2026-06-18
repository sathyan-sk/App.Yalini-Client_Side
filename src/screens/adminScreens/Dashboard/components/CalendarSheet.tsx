import React from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Calendar, DateData } from "react-native-calendars";

import { colors, fontSize, radius, spacing } from "../../../../theme";
import { todayISO } from "../../../../utils/format";

interface CalendarSheetProps {
  visible: boolean;
  selectedDate: string;
  onSelect: (isoDate: string) => void;
  onClose: () => void;
}

/**
 * Bottom-sheet style calendar picker. Only past dates up to today are
 * selectable (maxDate = today).
 */
export function CalendarSheet({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: CalendarSheetProps) {
  const insets = useSafeAreaInsets();
  const maxDate = todayISO();

  const handleDayPress = (day: DateData) => {
    onSelect(day.dateString);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
    <View style={styles.overlay}>
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        testID="calendar-sheet-backdrop"
      />
      <View
        style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}
        testID="calendar-sheet"
      >
        <View style={styles.handle} />
        <View style={styles.headerRow}>
          <Text style={styles.title}>Select date</Text>
          <Pressable
            testID="calendar-sheet-close-button"
            onPress={onClose}
            hitSlop={8}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>

        <Calendar
          testID="calendar-picker"
          current={selectedDate}
          maxDate={maxDate}
          onDayPress={handleDayPress}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.brand },
          }}
          theme={{
            todayTextColor: colors.brand,
            arrowColor: colors.brand,
            textDayFontSize: fontSize.base,
            textMonthFontWeight: "700",
            textDayHeaderFontSize: fontSize.sm,
            textSectionTitleColor: colors.textTertiary,
            dayTextColor: colors.textPrimary,
            monthTextColor: colors.textPrimary,
            textDisabledColor: "#D2D5DB",
          }}
        />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
      overlay: {
    flex: 1,
    justifyContent: "flex-end",
        // react-native-web renders Modal children in document flow; pin to window.
    ...(Platform.OS === "web"
      ? ({ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 } as object)
      : null),
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  closeText: {
    fontSize: fontSize.base,
    fontWeight: "500",
    color: colors.brand,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.6,
  },
});
