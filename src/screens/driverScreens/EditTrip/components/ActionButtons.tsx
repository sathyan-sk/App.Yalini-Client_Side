/**
 * ActionButtons - Save and Delete buttons for EditTrip screen
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, spacing, fontSize, radius } from '../../../../theme';

interface ActionButtonsProps {
  onSave: () => void;
  onDelete: () => void;
  isSubmitting: boolean;
}

export function ActionButtons({ onSave, onDelete, isSubmitting }: ActionButtonsProps) {
  return (
    <View style={styles.container}>
      {/* Save Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={onSave}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color={colors.surface} />
        ) : (
          <>
            <Feather name="save" size={20} color={colors.surface} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={18} color="#D32F2F" />
        <Text style={styles.deleteButtonText}>Delete Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  saveButton: {
    backgroundColor: '#1B5E20',
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  saveButtonText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: colors.surface,
    marginLeft: spacing.md,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  deleteButtonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: '#D32F2F',
    marginLeft: spacing.sm,
  },
});
