/**
 * Dashboard data service — Mock Service Layer implementation.
 *
 * Currently backed by the mock data store. To wire the real backend, replace
 * with a fetch call to the API endpoint.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import {
  getBusinesses,
  getEmployees,
  getDriverRecords,
  getWaterDeliveryRecords,
} from '../services/mockData';
import type { DashboardData, BusinessOverview, Submission } from '../types/dashboard';

const MOCK_LATENCY_MS = 200;

/**
 * Generate dashboard data from the mock store.
 * This provides real-time data based on the current state of the store.
 */
export async function fetchDashboardData(isoDate: string): Promise<DashboardData> {
  // Delegate to Supabase implementation when mock mode is off
  if (!USE_MOCK) {
    const { fetchDashboardData: fetchFromSupabase } = await import('./dashboardService.supabase');
    return fetchFromSupabase(isoDate);
  }

  await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));

  const [businesses, employees, driverRecords, waterRecords] = await Promise.all([
    getBusinesses(),
    getEmployees(),
    getDriverRecords(),
    getWaterDeliveryRecords(),
  ]);

  // Calculate stats
  const activeEmployees = employees.filter(e => e.status === 'enabled').length;
  const enabledBusinesses = businesses.filter(b => b.status === 'enabled').length;

  // Filter records for the selected date
  const dateDriverRecords = driverRecords.filter(r => r.date === isoDate);
  const dateWaterRecords = waterRecords.filter(r => r.date === isoDate);
  const allRecords = [...dateDriverRecords, ...dateWaterRecords];

  const submittedToday = allRecords.filter(r => r.status === 'submitted').length;
  const pendingToday = allRecords.filter(r => r.status === 'pending').length;

  // Build business overviews
  const businessOverviews: BusinessOverview[] = [];

  // Taxi business overview
  const taxiBusiness = businesses.find(b => b.type === 'taxi');
  if (taxiBusiness) {
    const taxiTotalIncome = dateDriverRecords.reduce((sum, r) => sum + r.totalIncome, 0);
    const taxiTotalExpense = dateDriverRecords.reduce((sum, r) => sum + r.totalExpense, 0);
    const taxiNetProfit = taxiTotalIncome - taxiTotalExpense;

    businessOverviews.push({
      id: taxiBusiness.id,
      name: taxiBusiness.name,
      category: 'Taxi',
      tone: 'purple',
      icon: { family: 'ion', name: 'car-outline' },
      metrics: [
        { label: 'Total Income', amount: taxiTotalIncome, color: 'info' },
        { label: "Total Expense's", amount: taxiTotalExpense, color: 'error' },
        { label: 'Net Profit', amount: taxiNetProfit, color: 'success' },
      ],
    });
  }

  // Water business overview
  const waterBusiness = businesses.find(b => b.type === 'water_delivery');
  if (waterBusiness) {
    const waterTotalIncome = dateWaterRecords.reduce((sum, r) => sum + r.totalIncome, 0);
    const waterTotalExpense = dateWaterRecords.reduce((sum, r) => sum + r.totalExpense, 0);
    const waterNetProfit = waterTotalIncome - waterTotalExpense;

    businessOverviews.push({
      id: waterBusiness.id,
      name: waterBusiness.name,
      category: 'Delivery',
      tone: 'blue',
      icon: { family: 'feather', name: 'droplet' },
      metrics: [
        { label: 'Total Income', amount: waterTotalIncome, color: 'info' },
        { label: "Total Expense's", amount: waterTotalExpense, color: 'error' },
        { label: 'Net Profit', amount: waterNetProfit, color: 'success' },
      ],
    });
  }

  // Build submissions list
  const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#F97316', '#EC4899'];
  const submissions: Submission[] = [];

  dateDriverRecords.forEach((record, index) => {
    submissions.push({
      id: record.id,
      employeeName: record.driverName,
      businessName: taxiBusiness?.name || 'City Taxi',
      date: record.date,
      time: `${8 + index}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
      status: record.status,
      avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
    });
  });

  dateWaterRecords.forEach((record, index) => {
    submissions.push({
      id: record.id,
      employeeName: record.deliveryPersonName,
      businessName: waterBusiness?.name || 'Yalini Minerals',
      date: record.date,
      time: `${8 + index}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
      status: record.status,
      avatarColor: AVATAR_COLORS[(index + 3) % AVATAR_COLORS.length],
    });
  });

  return {
    stats: {
      activeEmployees,
      submittedToday,
      pendingToday,
      businesses: enabledBusinesses,
    },
    businesses: businessOverviews,
    submissions,
  };
}