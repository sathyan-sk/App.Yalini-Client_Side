/**
 * TripsList - Container for trip cards with header showing count and info note
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';
import { TripCard } from './TripCard';
import type { Trip } from '../../../../types/driver';

interface TripsListProps {
  trips: Trip[];
  onTripPress: (trip: Trip) => void;
  onAddExpense: (trip: Trip) => void;
}

export function TripsList({ trips, onTripPress, onAddExpense }: TripsListProps) {
  const tripCount = trips.length;

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Trips ({tripCount})</Text>
        <View style={styles.headerInfoRow}>
          <Feather name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.headerInfoText}>
            Add expenses for all trips{"\n"}to proceed to checkout
          </Text>
        </View>
      </View>

      {/* Trip Cards */}
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          onPress={() => onTripPress(trip)}
          onAddExpense={() => onAddExpense(trip)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    maxWidth: '60%',
  },
  headerInfoText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
    textAlign: 'right',
    lineHeight: 16,
  },
});
