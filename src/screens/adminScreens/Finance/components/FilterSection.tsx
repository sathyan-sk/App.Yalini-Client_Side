import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { FinanceBusiness, FinanceFilters, DateRangeMode } from '../../../../types/finance';

interface Props {
  filters: FinanceFilters;
  businesses: FinanceBusiness[];
  onFiltersChange: (f: FinanceFilters) => void;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function getMonthLabel(monthStr: string) {
  const [y, m] = monthStr.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

function formatDate(d: string) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

export default function FilterSection({ filters, businesses, onFiltersChange }: Props) {
  const [showBizSheet, setShowBizSheet] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState<'from' | 'to' | null>(null);
  const [tempYear, setTempYear] = useState(() => parseInt(filters.month.split('-')[0]));
  const [tempDay, setTempDay] = useState('');

  const selectedBiz = businesses.find(b => b.id === filters.businessId);
  const bizLabel = filters.businessId === 'all' ? 'All Business' : (selectedBiz?.name ?? 'All Business');

  const shiftMonth = (delta: number) => {
    const [y, m] = filters.month.split('-').map(Number);
    let newM = m + delta;
    let newY = y;
    if (newM > 12) { newM = 1; newY++; }
    if (newM < 1) { newM = 12; newY--; }
    const month = `${newY}-${String(newM).padStart(2, '0')}`;
    onFiltersChange({ ...filters, month, mode: 'month' });
  };

  const selectMonth = (m: number) => {
    const month = `${tempYear}-${String(m).padStart(2, '0')}`;
    onFiltersChange({ ...filters, month, mode: 'month' });
    setShowMonthPicker(false);
  };

  const toggleMode = (mode: DateRangeMode) => {
    onFiltersChange({ ...filters, mode });
  };

  const setDateField = (field: 'fromDate' | 'toDate', value: string) => {
    onFiltersChange({ ...filters, [field]: value, mode: 'custom' });
  };

  // Simple date input with year-month-day
  const generateDateOptions = () => {
    const dates: string[] = [];
    const now = new Date();
    for (let i = 90; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <View style={styles.container} testID="filter-section">
      {/* Mode Toggle */}
      <View style={styles.modeRow}>
        <TouchableOpacity
          testID="mode-month-btn"
          style={[styles.modeBtn, filters.mode === 'month' && styles.modeBtnActive]}
          onPress={() => toggleMode('month')}
        >
          <Text style={[styles.modeBtnText, filters.mode === 'month' && styles.modeBtnTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="mode-custom-btn"
          style={[styles.modeBtn, filters.mode === 'custom' && styles.modeBtnActive]}
          onPress={() => toggleMode('custom')}
        >
          <Text style={[styles.modeBtnText, filters.mode === 'custom' && styles.modeBtnTextActive]}>
            Custom Range
          </Text>
        </TouchableOpacity>

        {/* Business filter */}
        <TouchableOpacity
          testID="business-filter-btn"
          style={styles.bizBtn}
          onPress={() => setShowBizSheet(true)}
        >
          <Ionicons name="business-outline" size={16} color="#4527A0" />
          <Text style={styles.bizBtnText} numberOfLines={1}>{bizLabel}</Text>
          <Ionicons name="chevron-down" size={14} color="#757575" />
        </TouchableOpacity>
      </View>

      {/* Month Selector */}
      {filters.mode === 'month' && (
        <View style={styles.monthRow}>
          <TouchableOpacity testID="month-prev-btn" onPress={() => shiftMonth(-1)} style={styles.arrowBtn}>
            <Ionicons name="chevron-back" size={20} color="#4527A0" />
          </TouchableOpacity>
          <TouchableOpacity testID="month-selector" onPress={() => setShowMonthPicker(true)} style={styles.monthLabel}>
            <Ionicons name="calendar-outline" size={16} color="#4527A0" />
            <Text style={styles.monthText}>{getMonthLabel(filters.month)}</Text>
          </TouchableOpacity>
          <TouchableOpacity testID="month-next-btn" onPress={() => shiftMonth(1)} style={styles.arrowBtn}>
            <Ionicons name="chevron-forward" size={20} color="#4527A0" />
          </TouchableOpacity>
        </View>
      )}

      {/* Custom date range */}
      {filters.mode === 'custom' && (
        <View style={styles.dateRow}>
          <TouchableOpacity
            testID="from-date-btn"
            style={styles.dateBtn}
            onPress={() => setShowDatePicker('from')}
          >
            <Ionicons name="calendar-outline" size={14} color="#4527A0" />
            <Text style={styles.dateLabel}>From</Text>
            <Text style={styles.dateValue}>{formatDate(filters.fromDate)}</Text>
          </TouchableOpacity>
          <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
          <TouchableOpacity
            testID="to-date-btn"
            style={styles.dateBtn}
            onPress={() => setShowDatePicker('to')}
          >
            <Ionicons name="calendar-outline" size={14} color="#4527A0" />
            <Text style={styles.dateLabel}>To</Text>
            <Text style={styles.dateValue}>{formatDate(filters.toDate)}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Business Filter Modal */}
      <Modal visible={showBizSheet} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowBizSheet(false)}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Business</Text>
            <TouchableOpacity
              testID="biz-filter-all"
              style={[styles.sheetItem, filters.businessId === 'all' && styles.sheetItemActive]}
              onPress={() => { onFiltersChange({ ...filters, businessId: 'all' }); setShowBizSheet(false); }}
            >
              <Ionicons name="globe-outline" size={20} color={filters.businessId === 'all' ? '#4527A0' : '#757575'} />
              <Text style={[styles.sheetItemText, filters.businessId === 'all' && styles.sheetItemTextActive]}>
                All Businesses
              </Text>
              {filters.businessId === 'all' && <Ionicons name="checkmark" size={20} color="#4527A0" />}
            </TouchableOpacity>
            {businesses.map(biz => (
              <TouchableOpacity
                key={biz.id}
                testID={`biz-filter-${biz.id}`}
                style={[styles.sheetItem, filters.businessId === biz.id && styles.sheetItemActive]}
                onPress={() => { onFiltersChange({ ...filters, businessId: biz.id }); setShowBizSheet(false); }}
              >
                <Ionicons name="business-outline" size={20} color={filters.businessId === biz.id ? '#4527A0' : '#757575'} />
                <Text style={[styles.sheetItemText, filters.businessId === biz.id && styles.sheetItemTextActive]}>
                  {biz.name}
                </Text>
                {filters.businessId === biz.id && <Ionicons name="checkmark" size={20} color="#4527A0" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View style={styles.monthSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.yearRow}>
              <TouchableOpacity onPress={() => setTempYear(y => y - 1)}>
                <Ionicons name="chevron-back" size={24} color="#4527A0" />
              </TouchableOpacity>
              <Text style={styles.yearText}>{tempYear}</Text>
              <TouchableOpacity onPress={() => setTempYear(y => y + 1)}>
                <Ionicons name="chevron-forward" size={24} color="#4527A0" />
              </TouchableOpacity>
            </View>
            <View style={styles.monthGrid}>
              {MONTHS.map((label, idx) => {
                const isSelected = filters.month === `${tempYear}-${String(idx + 1).padStart(2, '0')}`;
                return (
                  <TouchableOpacity
                    key={label}
                    testID={`month-pick-${idx + 1}`}
                    style={[styles.monthCell, isSelected && styles.monthCellActive]}
                    onPress={() => selectMonth(idx + 1)}
                  >
                    <Text style={[styles.monthCellText, isSelected && styles.monthCellTextActive]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker !== null} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowDatePicker(null)}
        >
          <View style={styles.dateSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              Select {showDatePicker === 'from' ? 'Start' : 'End'} Date
            </Text>
            <ScrollView style={styles.dateList} showsVerticalScrollIndicator={false}>
              {generateDateOptions().map(d => {
                const isSelected = showDatePicker === 'from'
                  ? filters.fromDate === d
                  : filters.toDate === d;
                return (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dateOption, isSelected && styles.dateOptionActive]}
                    onPress={() => {
                      setDateField(showDatePicker === 'from' ? 'fromDate' : 'toDate', d);
                      setShowDatePicker(null);
                    }}
                  >
                    <Text style={[styles.dateOptionText, isSelected && styles.dateOptionTextActive]}>
                      {formatDate(d)}
                    </Text>
                    {isSelected && <Ionicons name="checkmark" size={18} color="#4527A0" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F1F4',
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  modeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modeBtnActive: {
    backgroundColor: '#4527A0',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#757575',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },
  bizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F5F3FF',
    marginLeft: 'auto',
    gap: 4,
    maxWidth: 140,
  },
  bizBtnText: {
    fontSize: 12,
    color: '#4527A0',
    fontWeight: '500',
    flexShrink: 1,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F5F3FF',
    borderRadius: 20,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4527A0',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F3FF',
    borderRadius: 10,
  },
  dateLabel: {
    fontSize: 11,
    color: '#757575',
  },
  dateValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4527A0',
  },
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
    paddingBottom: 32,
    maxHeight: '60%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 16,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 12,
    marginBottom: 4,
  },
  sheetItemActive: {
    backgroundColor: '#F5F3FF',
  },
  sheetItemText: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
  },
  sheetItemTextActive: {
    fontWeight: '600',
    color: '#4527A0',
  },
  monthSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 16,
  },
  yearText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  monthCell: {
    width: '30%',
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#F7F8FA',
  },
  monthCellActive: {
    backgroundColor: '#4527A0',
  },
  monthCellText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212121',
  },
  monthCellTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dateSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 32,
    maxHeight: '50%',
  },
  dateList: {
    maxHeight: 300,
  },
  dateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  dateOptionActive: {
    backgroundColor: '#F5F3FF',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#212121',
  },
  dateOptionTextActive: {
    fontWeight: '600',
    color: '#4527A0',
  },
});
