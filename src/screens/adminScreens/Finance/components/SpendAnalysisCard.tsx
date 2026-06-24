import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { BusinessBreakdown } from '../../../../types/finance';

interface Props {
  byBusiness: BusinessBreakdown[];
  loading: boolean;
}

const TONE_COLORS: Record<string, { accent: string; bg: string }> = {
  taxi: { accent: '#7C3AED', bg: '#F5F3FF' },
  water_delivery: { accent: '#2563EB', bg: '#EFF6FF' },
  hotel: { accent: '#EA580C', bg: '#FFF7ED' },
  logistics: { accent: '#059669', bg: '#ECFDF5' },
  default: { accent: '#0891B2', bg: '#ECFEFF' },
};

function formatINR(n: number): string {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toFixed(0)}`;
}

function getBarWidth(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(8, (value / max) * 100);
}

export default function SpendAnalysisCard({ byBusiness, loading }: Props) {
  const maxExpense = Math.max(...byBusiness.map(b => b.expense), 1);

  return (
    <View style={styles.container} testID="spend-analysis-card">
      <View style={styles.header}>
        <Ionicons name="pie-chart-outline" size={18} color="#4527A0" />
        <Text style={styles.title}>Business Spend Analysis</Text>
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : byBusiness.length === 0 ? (
        <Text style={styles.emptyText}>No data for selected period</Text>
      ) : (
        byBusiness.map(biz => {
          const tone = TONE_COLORS[biz.businessType] ?? TONE_COLORS.default;
          const barW = getBarWidth(biz.expense, maxExpense);
          return (
            <View key={biz.businessId} style={styles.bizRow} testID={`spend-biz-${biz.businessId}`}>
              <View style={styles.bizInfo}>
                <View style={[styles.dot, { backgroundColor: tone.accent }]} />
                <Text style={styles.bizName} numberOfLines={1}>{biz.businessName}</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { width: `${barW}%`, backgroundColor: tone.accent }]} />
              </View>
              <View style={styles.bizMetrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Income</Text>
                  <Text style={[styles.metricValue, { color: '#059669' }]}>{formatINR(biz.income)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Expense</Text>
                  <Text style={[styles.metricValue, { color: '#DC2626' }]}>{formatINR(biz.expense)}</Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Profit</Text>
                  <Text style={[styles.metricValue, { color: '#7C3AED' }]}>{formatINR(biz.profit)}</Text>
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#101828',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  loadingText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bizRow: {
    marginBottom: 14,
  },
  bizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  bizName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  barContainer: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  bar: {
    height: 6,
    borderRadius: 3,
  },
  bizMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginBottom: 1,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
  },
});
