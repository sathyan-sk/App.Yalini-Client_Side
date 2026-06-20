/**
 * QuickActions - List of quick action cards with icons
 * Actions: Add Delivery, All Deliveries, Checkout
 */
import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import { colors, fontSize, spacing, radius, cardShadow } from '../../../../theme';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  onPress: () => void;
}

interface QuickActionsProps {
  onAddDelivery: () => void;
  onAllDeliveries: () => void;
  onCheckout: () => void;
}

function ActionCard({ action }: { action: QuickAction }) {
  return (
    <Pressable
      onPress={action.onPress}
      style={({ pressed }) => [
        styles.actionCard,
        pressed && styles.actionCardPressed,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: action.iconBgColor }]}>
        {action.icon}
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{action.title}</Text>
        <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      </View>
      <Feather name="chevron-right" size={20} color={colors.textTertiary} />
    </Pressable>
  );
}

export function QuickActions({
  onAddDelivery,
  onAllDeliveries,
  onCheckout,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      id: 'add_delivery',
      title: 'Add Delivery',
      subtitle: 'Select hotel and add delivery details',
      icon: <MaterialCommunityIcons name="package-variant" size={24} color="#1976D2" />,
      iconBgColor: '#E3F2FD',
      onPress: onAddDelivery,
    },
    {
      id: 'all_deliveries',
      title: 'All Deliveries',
      subtitle: "View and edit today's deliveries",
      icon: <Feather name="list" size={24} color="#388E3C" />,
      iconBgColor: '#E8F5E9',
      onPress: onAllDeliveries,
    },
    {
      id: 'checkout',
      title: 'Checkout',
      subtitle: 'Review summary, add expenses and submit day',
      icon: <MaterialCommunityIcons name="clipboard-check-outline" size={24} color="#F57C00" />,
      iconBgColor: '#FFF3E0',
      onPress: onCheckout,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...cardShadow,
  },
  actionCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
});
