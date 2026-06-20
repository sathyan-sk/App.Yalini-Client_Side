/**
 * AssignedHotelsList - Shows list of hotels assigned to staff
 */
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';
import type { HotelInfo } from '../types';

interface AssignedHotelsListProps {
  hotels: HotelInfo[];
  onHotelPress?: (hotel: HotelInfo) => void;
}

function HotelItem({ hotel, onPress }: { hotel: HotelInfo; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.hotelItem,
        pressed && onPress && styles.hotelItemPressed,
      ]}
    >
      <View style={styles.hotelIconContainer}>
        <MaterialCommunityIcons name="office-building" size={20} color="#1976D2" />
      </View>
      <Text style={styles.hotelName}>{hotel.hotelName}</Text>
    </Pressable>
  );
}

export function AssignedHotelsList({ hotels, onHotelPress }: AssignedHotelsListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Assigned Hotels</Text>
      <View style={styles.card}>
        {hotels.map((hotel, index) => (
          <React.Fragment key={hotel.hotelId}>
            <HotelItem
              hotel={hotel}
              onPress={onHotelPress ? () => onHotelPress(hotel) : undefined}
            />
            {index < hotels.length - 1 && <View style={styles.separator} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...cardShadow,
    overflow: 'hidden',
  },
  hotelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  hotelItemPressed: {
    backgroundColor: colors.surfaceSecondary,
  },
  hotelIconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  hotelName: {
    fontSize: fontSize.base,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.lg + 36 + spacing.md, // Align with text
  },
});
