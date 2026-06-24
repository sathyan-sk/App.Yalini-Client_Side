import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FinanceFilters } from '../../../../types/finance';

interface Props {
  visible: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'excel' | 'share') => void;
  filters: FinanceFilters;
  exporting: boolean;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getFilterLabel(filters: FinanceFilters): string {
  if (filters.mode === 'custom') {
    return `${filters.fromDate} to ${filters.toDate}`;
  }
  const [y, m] = filters.month.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

const OPTIONS = [
  {
    key: 'pdf' as const,
    label: 'Export as PDF',
    icon: 'document-text-outline' as const,
    color: '#DC2626',
    bg: '#FEF2F2',
  },
  {
    key: 'excel' as const,
    label: 'Export as Excel',
    icon: 'grid-outline' as const,
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    key: 'share' as const,
    label: 'Share Report',
    icon: 'share-social-outline' as const,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
];

export default function ExportSheet({ visible, onClose, onExport, filters, exporting }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Export Report</Text>
          <View style={styles.filterInfo}>
            <Ionicons name="funnel-outline" size={14} color="#757575" />
            <Text style={styles.filterText}>
              Filters: {getFilterLabel(filters)}
              {filters.businessId !== 'all' ? ` • Business filtered` : ' • All businesses'}
            </Text>
          </View>
          {OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.key}
              testID={`export-${opt.key}-btn`}
              style={styles.option}
              onPress={() => onExport(opt.key)}
              disabled={exporting}
              activeOpacity={0.7}
            >
              <View style={[styles.optIcon, { backgroundColor: opt.bg }]}>
                <Ionicons name={opt.icon} size={22} color={opt.color} />
              </View>
              <Text style={styles.optLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  filterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F7F8FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 12,
    color: '#757575',
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F1F4',
  },
  optIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#212121',
  },
});
