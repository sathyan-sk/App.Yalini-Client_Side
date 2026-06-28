/**
 * AssignedHotelsList - List of hotels assigned to the staff
 * Shows all hotels the staff needs to deliver to today
 */
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius, cardShadow, lightShadow } from '../../../../theme';
import type { HotelInfo } from '../types';

interface AssignedHotelsListProps {
  hotels: HotelInfo[];
  onHotelPress: (hotel: HotelInfo) => void;
}

export function AssignedHotelsList({ hotels, onHotelPress }: AssignedHotelsListProps) {
  const renderHotel = ({ item, index }: { item: HotelInfo; index: number }) => (
    <TouchableOpacity
      style={[styles.hotelCard, lightShadow]}
      onPress={() => onHotelPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.hotelIcon}>
        <Feather name="home" size={20} color={colors.primaryBlue} />
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.hotelName}</Text>
        {item.location && (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={12} color={colors.textSecondary} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
        {item.outstandingCans !== undefined && item.outstandingCans > 0 && (
          <View style={styles.outstandingRow}>
            <Feather name="alert-circle" size={12} color={colors.warning} />
            <Text style={styles.outstandingText}>
              {item.outstandingCans} outstanding can{item.outstandingCans !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      <Feather name="chevron-right" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Feather name="list" size={18} color={colors.primaryBlue} />
          <Text style={styles.title}>Assigned Hotels</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{hotels.length}</Text>
        </View>
      </View>

      {hotels.length > 0 ? (
        <FlatList
          data={hotels}
          renderItem={renderHotel}
          keyExtractor={(item) => item.hotelId}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <View style={styles.emptyState}>
          <Feather name="inbox" size={48} color={colors.textTertiary} />
          <Text style={styles.emptyText}>No hotels assigned</Text>
          <Text style={styles.emptySubtext}>Hotels will appear here once assigned</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    ...cardShadow,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primaryBlueSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.primaryBlue,
  },
  hotelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  hotelIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryBlueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hotelInfo: {
    flex: 1,
  },
  hotelName: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  outstandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  outstandingText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: '500',
  },
  separator: {
    height: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    fontSize: fontSize.base,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textTertiary,
    marginTop: spacing.xs,
  },
});
