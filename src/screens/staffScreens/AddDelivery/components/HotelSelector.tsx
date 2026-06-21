/**
 * HotelSelector - Searchable dropdown for hotel selection.
 *
 * Provides a searchable list of hotels from the admin master list.
 * Shows hotel name, location, and rate per can.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';
import type { HotelOption } from '../types';

/**
 * Props for HotelSelector component.
 */
interface HotelSelectorProps {
  /** List of available hotels */
  hotels: HotelOption[];
  /** Currently selected hotel ID */
  selectedHotelId: string;
  /** Callback when hotel is selected */
  onSelectHotel: (hotel: HotelOption) => void;
  /** Error message to display */
  error?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

/**
 * Searchable hotel dropdown selector component.
 * @param props - Component props
 * @returns JSX element
 */
export function HotelSelector({
  hotels,
  selectedHotelId,
  onSelectHotel,
  error,
  disabled = false,
  testID = 'hotel-selector',
}: HotelSelectorProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Find the selected hotel for display
  const selectedHotel = useMemo(
    () => hotels.find((h) => h.id === selectedHotelId),
    [hotels, selectedHotelId]
  );

  // Filter hotels based on search query
  const filteredHotels = useMemo(() => {
    if (!searchQuery.trim()) return hotels;
    const query = searchQuery.toLowerCase();
    return hotels.filter(
      (h) =>
        h.name.toLowerCase().includes(query) ||
        h.location?.toLowerCase().includes(query)
    );
  }, [hotels, searchQuery]);

  /**
   * Opens the hotel selection modal.
   */
  const handleOpen = useCallback(() => {
    if (!disabled) {
      setIsOpen(true);
      setSearchQuery('');
    }
  }, [disabled]);

  /**
   * Closes the modal.
   */
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  /**
   * Handles hotel selection.
   * @param hotel - Selected hotel
   */
  const handleSelect = useCallback(
    (hotel: HotelOption) => {
      onSelectHotel(hotel);
      handleClose();
    },
    [onSelectHotel, handleClose]
  );

  /**
   * Renders a single hotel item in the list.
   * @param item - Hotel option
   * @returns JSX element
   */
  const renderHotelItem = useCallback(
    ({ item }: { item: HotelOption }) => {
      const isSelected = item.id === selectedHotelId;
      return (
        <Pressable
          style={[
            styles.hotelItem,
            isSelected && styles.hotelItemSelected,
          ]}
          onPress={() => handleSelect(item)}
          testID={`${testID}-item-${item.id}`}
        >
          <View style={styles.hotelIconBg}>
            <Ionicons
              name="business"
              size={20}
              color={isSelected ? colors.surface : colors.primaryBlue}
            />
          </View>
          <View style={styles.hotelInfo}>
            <Text
              style={[
                styles.hotelName,
                isSelected && styles.hotelNameSelected,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
            {item.location ? (
              <Text
                style={[
                  styles.hotelLocation,
                  isSelected && styles.hotelLocationSelected,
                ]}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            ) : null}
          </View>
          <View style={styles.rateContainer}>
            <Text
              style={[
                styles.rateLabel,
                isSelected && styles.rateLabelSelected,
              ]}
            >
              Rate
            </Text>
            <Text
              style={[
                styles.rateValue,
                isSelected && styles.rateValueSelected,
              ]}
            >
              ₹{item.ratePerCan}
            </Text>
          </View>
          {isSelected && (
            <Feather
              name="check-circle"
              size={20}
              color={colors.surface}
              style={styles.checkIcon}
            />
          )}
        </Pressable>
      );
    },
    [selectedHotelId, handleSelect, testID]
  );

  return (
    <View style={styles.container} testID={testID}>
      {/* Selector Button */}
      <Text style={styles.label}>
        Select Hotel <Text style={styles.required}>*</Text>
      </Text>
      <Pressable
        style={[
          styles.selectorButton,
          error && styles.selectorButtonError,
          disabled && styles.selectorButtonDisabled,
        ]}
        onPress={handleOpen}
        disabled={disabled}
        testID={`${testID}-button`}
      >
        <Ionicons
          name="business-outline"
          size={20}
          color={selectedHotel ? colors.textPrimary : colors.textTertiary}
        />
        <Text
          style={[
            styles.selectorText,
            !selectedHotel && styles.selectorPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedHotel ? selectedHotel.name : 'Search and select hotel'}
        </Text>
        <Feather
          name="chevron-down"
          size={20}
          color={colors.textTertiary}
        />
      </Pressable>
      {selectedHotel && (
        <View style={styles.selectedInfo}>
          <Text style={styles.selectedInfoText}>
            Rate: ₹{selectedHotel.ratePerCan}/can
            {selectedHotel.location ? ` • ${selectedHotel.location}` : ''}
          </Text>
        </View>
      )}
      {error ? (
        <Text style={styles.errorText} testID={`${testID}-error`}>
          {error}
        </Text>
      ) : null}

      {/* Selection Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Hotel</Text>
              <Pressable
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <Feather
                name="search"
                size={18}
                color={colors.textTertiary}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search hotels..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                testID={`${testID}-search`}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Feather
                    name="x-circle"
                    size={18}
                    color={colors.textTertiary}
                  />
                </Pressable>
              )}
            </View>

            {/* Hotel List */}
            {filteredHotels.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="search-outline"
                  size={48}
                  color={colors.textTertiary}
                />
                <Text style={styles.emptyText}>
                  {searchQuery
                    ? 'No hotels found matching your search'
                    : 'No hotels available'}
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredHotels}
                keyExtractor={(item) => item.id}
                renderItem={renderHotelItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    minHeight: 52,
  },
  selectorButtonError: {
    borderColor: colors.error,
  },
  selectorButtonDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  selectorText: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  selectorPlaceholder: {
    color: colors.textTertiary,
  },
  selectedInfo: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  selectedInfoText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '80%',
    ...cardShadow,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  hotelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  hotelItemSelected: {
    backgroundColor: colors.primaryBlue,
  },
  hotelIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
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
  hotelNameSelected: {
    color: colors.surface,
  },
  hotelLocation: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hotelLocationSelected: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rateLabel: {
    fontSize: fontSize.xs,
    color: colors.textTertiary,
  },
  rateLabelSelected: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  rateValue: {
    fontSize: fontSize.base,
    fontWeight: '700',
    color: colors.successDark,
  },
  rateValueSelected: {
    color: colors.surface,
  },
  checkIcon: {
    marginLeft: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    fontSize: fontSize.base,
    color: colors.textTertiary,
    marginTop: spacing.md,
    textAlign: 'center',
  },
});
