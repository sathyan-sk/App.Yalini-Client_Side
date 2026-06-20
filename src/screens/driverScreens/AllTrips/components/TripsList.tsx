/**
 * TripsList - Container for trip cards with header showing count and info note
 */

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';
import { TripCard } from './TripCard';
import type { TripWithExpense } from '../../../../store/tripStore';

interface TripsListProps {
  trips: TripWithExpense[];
  onTripPress: (trip: TripWithExpense) => void;
  onAddExpense: (trip: TripWithExpense) => void;
}

export function TripsList({ trips, onTripPress, onAddExpense }: TripsListProps) {
  const tripCount = trips.length;

  if (tripCount === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather name="inbox" size={48} color={colors.textTertiary} />
        <Text style={styles.emptyText}>No trips added yet</Text>
        <Text style={styles.emptySubtext}>Add trips from the Add Trip tab</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Trips ({tripCount})</Text>
        <View style={styles.headerInfoRow}>
          <Feather name="info" size={14} color={colors.textSecondary} />
          <Text style={styles.headerInfoText}>
            Add expenses for all trips{" "}
            to proceed to checkout
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
