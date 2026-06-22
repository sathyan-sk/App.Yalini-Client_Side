/**
 * ServiceInfoCard - Shows business name, type tag, welcome message, and role tag
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { BusinessType } from '../../../../types/driver';

interface ServiceInfoCardProps {
  businessName: string;
  businessType: BusinessType;
  userName: string;
  role: string;
}

const TAXI_ICON_COLOR = '#FF9800';
const TAXI_ICON_BG = '#FFF3E0';
const DELIVERY_ICON_COLOR = '#1976D2';
const DELIVERY_ICON_BG = '#E3F2FD';

export function ServiceInfoCard({
  businessName,
  businessType,
  userName,
  role,
}: ServiceInfoCardProps) {
  const isTaxi = businessType === 'taxi';
  const iconColor = isTaxi ? TAXI_ICON_COLOR : DELIVERY_ICON_COLOR;
  const iconBg = isTaxi ? TAXI_ICON_BG : DELIVERY_ICON_BG;
  const typeLabel = isTaxi ? 'Taxi' : 'Delivery';
  const typeTagBg = isTaxi ? '#FFEBEE' : DELIVERY_ICON_BG;
  const typeTagColor = isTaxi ? '#D32F2F' : '#0D47A1';
  const roleTagBg = '#E8EAF6';
  const roleTagColor = '#1A237E';

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
        {isTaxi ? (
          <MaterialCommunityIcons name="taxi" size={24} color={iconColor} />
        ) : (
          <MaterialCommunityIcons name="truck-delivery" size={24} color={iconColor} />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={[styles.tag, { backgroundColor: typeTagBg }]}>
            <Text style={[styles.tagText, { color: typeTagColor }]}>{typeLabel}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.welcomeText}>Welcome, {userName}</Text>
          <View style={[styles.tag, { backgroundColor: roleTagBg }]}>
            <Text style={[styles.tagText, { color: roleTagColor }]}>{role}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  businessName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  welcomeText: {
    fontSize: 14,
    color: '#616161',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
