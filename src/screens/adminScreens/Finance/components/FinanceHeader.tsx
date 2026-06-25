import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  periodLabel: string;
  onExport: () => void;
}

export default function FinanceHeader({ periodLabel, onExport }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]} testID="finance-header">
      <View style={styles.left}>
        <Text style={styles.title}>Finance Reports</Text>
        <Text style={styles.period}>{periodLabel}</Text>
      </View>
      <TouchableOpacity
        testID="export-button"
        style={styles.exportBtn}
        onPress={onExport}
        activeOpacity={0.7}
      >
        <Ionicons name="download-outline" size={20} color="#FFFFFF" />
        <Text style={styles.exportText}>Export</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3af32f9',
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  left: { flex: 1 },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 2,
  },
  period: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 75, 75, 0.62)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  exportText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
});
