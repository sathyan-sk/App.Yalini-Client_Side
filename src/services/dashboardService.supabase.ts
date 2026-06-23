/**
 * Dashboard data service — Supabase implementation.
 *
 * Fetches and aggregates data from Supabase for the dashboard view.
 */

import { supabase } from '../config/supabase';
import type { DashboardData, BusinessOverview, Submission } from '../types/dashboard';

const AVATAR_COLORS = ['#7C3AED', '#2563EB', '#059669', '#F97316', '#EC4899'];

/**
 * Generate dashboard data from Supabase.
 */
export async function fetchDashboardData(isoDate: string): Promise<DashboardData> {
  // Fetch all required data in parallel
  const [
    businessesResult,
    employeesResult,
    driverRecordsResult,
    waterRecordsResult,
  ] = await Promise.all([
    supabase.from('businesses').select('*'),
    supabase.from('employees').select('*'),
    supabase.from('driver_records').select('*').eq('date', isoDate),
    supabase.from('water_delivery_records').select('*').eq('date', isoDate),
  ]);

  const businesses = businessesResult.data || [];
  const employees = employeesResult.data || [];
  const driverRecords = driverRecordsResult.data || [];
  const waterRecords = waterRecordsResult.data || [];

  // Calculate stats
  const activeEmployees = employees.filter(e => e.status === 'enabled').length;
  const enabledBusinesses = businesses.filter(b => b.status === 'enabled').length;

  const allRecords = [...driverRecords, ...waterRecords];
  const submittedToday = allRecords.filter(r => r.status === 'submitted').length;
  const pendingToday = allRecords.filter(r => r.status === 'pending').length;

  // Build business overviews
  const businessOverviews: BusinessOverview[] = [];

  // Taxi business overview
  const taxiBusiness = businesses.find(b => b.type === 'taxi');
  if (taxiBusiness) {
    const taxiTotalIncome = driverRecords.reduce((sum, r) => sum + r.total_income, 0);
    const taxiTotalExpense = driverRecords.reduce((sum, r) => sum + r.total_expense, 0);
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
    const waterTotalIncome = waterRecords.reduce((sum, r) => sum + r.total_income, 0);
    const waterTotalExpense = waterRecords.reduce((sum, r) => sum + r.total_expense, 0);
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
  const submissions: Submission[] = [];

  driverRecords.forEach((record, index) => {
    submissions.push({
      id: record.id,
      employeeName: record.driver_name,
      businessName: taxiBusiness?.name || 'City Taxi',
      date: record.date,
      time: `${8 + index}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} PM`,
      status: record.status,
      avatarColor: record.avatar_color || AVATAR_COLORS[index % AVATAR_COLORS.length],
    });
  });

  waterRecords.forEach((record, index) => {
    submissions.push({
      id: record.id,
      employeeName: record.delivery_person_name,
      businessName: waterBusiness?.name || 'Yalini Minerals',
      date: record.date,
      time: `${9 + index}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')} AM`,
      status: record.status,
      avatarColor: record.avatar_color || AVATAR_COLORS[(index + 2) % AVATAR_COLORS.length],
    });
  });

  // Sort submissions by time (most recent first)
  submissions.sort((a, b) => b.time.localeCompare(a.time));

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
