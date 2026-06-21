/**
 * ExpenseSection - Optional section for expense tracking.
 *
 * Displays when a hotel is selected. Allows staff to log expenses
 * like fuel or other costs during delivery.
 */
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';
import type { ExpenseCategory } from '../types';

/**
 * Props for ExpenseSection component.
 */
interface ExpenseSectionProps {
  /** Selected expense category */
  category?: ExpenseCategory;
  /** Expense amount */
  amount: number;
  /** Callback when category changes */
  onCategoryChange: (category: ExpenseCategory | undefined) => void;
  /** Callback when amount changes */
  onAmountChange: (value: string) => void;
  /** Error message for amount */
  amountError?: string;
  /** Whether the section is disabled */
  disabled?: boolean;
  /** Optional test ID */
  testID?: string;
}

/** Expense category options */
const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; icon: string }[] = [
  { value: 'FUEL', label: 'Fuel', icon: 'droplet' },
  { value: 'OTHERS', label: 'Others', icon: 'more-horizontal' },
];

/**
 * Expense section component with category selector and amount input.
 * @param props - Component props
 * @returns JSX element
 */
export function ExpenseSection({
  category,
  amount,
  onCategoryChange,
  onAmountChange,
  amountError,
  disabled = false,
  testID = 'expense-section',
}: ExpenseSectionProps): React.JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Gets label for selected category.
   */
  const getCategoryLabel = useCallback(() => {
    if (!category) return 'Select category';
    const found = EXPENSE_CATEGORIES.find((c) => c.value === category);
    return found?.label || 'Select category';
  }, [category]);

  /**
   * Handles category selection.
   */
  const handleCategorySelect = useCallback(
    (value: ExpenseCategory) => {
      onCategoryChange(value);
      setIsModalOpen(false);
    },
    [onCategoryChange]
  );

  /**
   * Clears the selected category.
   */
  const handleClearCategory = useCallback(() => {
    onCategoryChange(undefined);
    onAmountChange('0');
  }, [onCategoryChange, onAmountChange]);

  return (
    <View style={styles.container} testID={testID}>
      {/* Section Header */}
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Feather name="credit-card" size={20} color={colors.warning} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Expense (Optional)</Text>
          <Text style={styles.subtitle}>Log any delivery-related expenses</Text>
        </View>
      </View>

      {/* Category Selector */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Expense Category</Text>
        <Pressable
          style={[
            styles.selectorButton,
            disabled && styles.selectorDisabled,
          ]}
          onPress={() => !disabled && setIsModalOpen(true)}
          disabled={disabled}
          testID={`${testID}-category-button`}
        >
          <Text
            style={[
              styles.selectorText,
              !category && styles.selectorPlaceholder,
            ]}
          >
            {getCategoryLabel()}
          </Text>
          <Feather
            name="chevron-down"
            size={20}
            color={colors.textTertiary}
          />
        </Pressable>
      </View>

      {/* Amount Input - Only show if category is selected */}
      {category && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Expense Amount</Text>
          <View
            style={[
              styles.inputContainer,
              amountError && styles.inputError,
              disabled && styles.inputDisabled,
            ]}
          >
            <Text style={styles.rupeeSymbol}>₹</Text>
            <TextInput
              value={amount > 0 ? amount.toString() : ''}
              onChangeText={onAmountChange}
              placeholder="0"
              placeholderTextColor={colors.textTertiary}
              style={styles.input}
              keyboardType="numeric"
              editable={!disabled}
              maxLength={6}
              testID={`${testID}-amount-input`}
            />
            <Pressable
              style={styles.clearButton}
              onPress={handleClearCategory}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x-circle" size={20} color={colors.textTertiary} />
            </Pressable>
          </View>
          {amountError ? (
            <Text style={styles.errorText} testID={`${testID}-amount-error`}>
              {amountError}
            </Text>
          ) : null}
        </View>
      )}

      {/* Category Selection Modal */}
      <Modal
        visible={isModalOpen}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Expense Category</Text>
            {EXPENSE_CATEGORIES.map((item) => {
              const isSelected = category === item.value;
              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.categoryItem,
                    isSelected && styles.categoryItemSelected,
                  ]}
                  onPress={() => handleCategorySelect(item.value)}
                  testID={`${testID}-category-${item.value}`}
                >
                  <View
                    style={[
                      styles.categoryIconBg,
                      isSelected && styles.categoryIconBgSelected,
                    ]}
                  >
                    <Feather
                      name={item.icon as keyof typeof Feather.glyphMap}
                      size={20}
                      color={isSelected ? colors.surface : colors.warning}
                    />
                  </View>
                  <Text
                    style={[
                      styles.categoryLabel,
                      isSelected && styles.categoryLabelSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Feather
                      name="check"
                      size={20}
                      color={colors.surface}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  fieldGroup: {
    marginBottom: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  selectorDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  selectorText: {
    fontSize: fontSize.base,
    color: colors.textPrimary,
  },
  selectorPlaceholder: {
    color: colors.textTertiary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    minHeight: 52,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.surfaceTertiary,
    opacity: 0.7,
  },
  rupeeSymbol: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    paddingVertical: spacing.md,
  },
  clearButton: {
    padding: spacing.xs,
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 320,
    ...cardShadow,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    gap: spacing.md,
  },
  categoryItemSelected: {
    backgroundColor: colors.warning,
  },
  categoryIconBg: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconBgSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryLabel: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  categoryLabelSelected: {
    color: colors.surface,
  },
});
