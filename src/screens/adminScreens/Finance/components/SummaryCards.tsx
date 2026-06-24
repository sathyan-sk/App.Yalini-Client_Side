import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FinanceSummary } from '../../../../types/finance';

interface Props {
  summary: FinanceSummary | null;
  loading: boolean;
}

function formatINR(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

const CARDS = [
  { key: 'income', label: 'Total Income', icon: 'trending-up' as const, color: '#059669', bg: '#ECFDF5', iconBg: '#D1FAE5' },
  { key: 'profit', label: 'Total Profit', icon: 'wallet-outline' as const, color: '#7C3AED', bg: '#F5F3FF', iconBg: '#EDE9FE' },
  { key: 'expense', label: 'Total Expense', icon: 'trending-down' as const, color: '#DC2626', bg: '#FEF2F2', iconBg: '#FEE2E2' },
];

export default function SummaryCards({ summary, loading }: Props) {
  return (
    <View style={styles.container} testID="summary-cards">
      {CARDS.map(card => {
        const value = summary
          ? card.key === 'income'
            ? summary.totalIncome
            : card.key === 'profit'
            ? summary.totalProfit
            : summary.totalExpense
          : 0;
        return (
          <View
            key={card.key}
            testID={`summary-card-${card.key}`}
            style={[styles.card, { backgroundColor: card.bg }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: card.iconBg }]}>
              <Ionicons name={card.icon} size={20} color={card.color} />
            </View>
            <Text style={styles.label}>{card.label}</Text>
            <Text style={[styles.value, { color: card.color }]}>
              {loading ? '...' : formatINR(value)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: '#757575',
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
});
