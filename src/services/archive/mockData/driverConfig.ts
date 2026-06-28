/**
 * Driver Module Configuration
 * 
 * Centralized configuration for driver module mock data.
 * This file imports from seedData and provides consistent IDs
 * and default values for the driver module.
 * 
 * Usage:
 * - Import DRIVER_CONFIG for session/driver info
 * - Import DEMO_TRIPS for initial trip data (if needed for demos)
 * - Import DEFAULT_EXPENSE for expense defaults
 * 
 * When migrating to real backend:
 * - These defaults become fallbacks only
 * - Real data comes from API responses
 */

import {
  SEED_EMPLOYEES,
  SEED_VEHICLES,
  SEED_BUSINESSES,
} from './seedData';

// ============================================================================
// DEMO DRIVER CONFIGURATION (Default driver for demo/development)
// ============================================================================

// Find demo entities from seed data
const demoEmployee = SEED_EMPLOYEES.find(e => e.id === 'emp_seed_ramesh');
const demoVehicle = SEED_VEHICLES.find(v => v.id === 'veh_seed_swift_dzire');
const demoBusiness = SEED_BUSINESSES.find(b => b.id === 'biz_seed_city_taxi');

/**
 * Default driver configuration using seed data
 * All IDs are stable and consistent with seedData
 */
export const DRIVER_CONFIG = {
  // Driver/Employee info
  driverId: demoEmployee?.id || 'emp_seed_ramesh',
  driverName: demoEmployee?.fullName || 'Ramesh Kumar',
  
  // Vehicle info
  vehicleId: demoVehicle?.id || 'veh_seed_swift_dzire',
  vehicleName: demoVehicle?.name || 'Swift Dzire',
  vehicleNumber: demoVehicle?.number || 'TN01AB1234',
  
  // Business info
  businessId: demoBusiness?.id || 'biz_seed_city_taxi',
  businessName: demoBusiness?.name || 'City Taxi',
  businessType: 'taxi' as const,
  
  // Default session time
  defaultSessionTime: '08:05 AM',
} as const;

// ============================================================================
// EXPENSE CONFIGURATION
// ============================================================================

/**
 * Default expense values for new expenses
 * Used when creating new expense entries
 */
export const DEFAULT_EXPENSE = {
  fuel: 0,
  toll: 0,
  food: 0,
  other: 0,
  notes: '',
  total: 0,
} as const;

/**
 * Expense category configuration (static, UI-related)
 * These define how expense categories are displayed
 */
export const EXPENSE_CATEGORIES = [
  {
    id: 'fuel',
    name: 'Fuel',
    subtitle: 'Petrol / Diesel',
    icon: 'local-gas-station',
    iconLibrary: 'MaterialIcons' as const,
    color: '#22C55E',
    backgroundColor: '#DCFCE7',
    defaultValue: 0,
  },
  {
    id: 'toll',
    name: 'Toll',
    subtitle: 'Toll charges',
    icon: 'toll',
    iconLibrary: 'MaterialIcons' as const,
    color: '#1E88E5',
    backgroundColor: '#E3F2FD',
    defaultValue: 0,
  },
  {
    id: 'food',
    name: 'Food',
    subtitle: 'Meals / Snacks',
    icon: 'restaurant',
    iconLibrary: 'MaterialIcons' as const,
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    defaultValue: 0,
  },
  {
    id: 'other',
    name: 'Other',
    subtitle: 'Parking, Tips, etc.',
    icon: 'more-horiz',
    iconLibrary: 'MaterialIcons' as const,
    color: '#6366F1',
    backgroundColor: '#E0E7FF',
    defaultValue: 0,
  },
] as const;

/**
 * Initial expense form state
 */
export const INITIAL_EXPENSE_FORM = {
  fuel: '0',
  toll: '0',
  food: '0',
  other: '0',
  notes: '',
} as const;

// ============================================================================
// DEMO TRIPS CONFIGURATION (for development/testing only)
// ============================================================================

/**
 * Sample trips for demo purposes
 * These use dynamic dates via getCurrentDate() in tripStore
 * Note: In production, trips come from API, not hardcoded
 */
export const DEMO_TRIP_TEMPLATES = [
  {
    tripType: 'vendor' as const,
    from: 'Coimbatore',
    to: 'Airport',
    amount: 650,
    paymentMode: 'cash' as const,
    time: '08:30 AM',
    hasExpense: true,
    totalExpense: 200,
    expense: {
      fuel: 110,
      toll: 40,
      food: 30,
      other: 20,
      notes: '',
      total: 200,
    },
  },
  {
    tripType: 'private' as const,
    from: 'Airport',
    to: 'Peelamedu',
    amount: 900,
    paymentMode: 'cash' as const,
    time: '10:45 AM',
    hasExpense: false,
    totalExpense: 0,
  },
  {
    tripType: 'vendor' as const,
    from: 'Peelamedu',
    to: 'RS Puram',
    amount: 900,
    paymentMode: 'online' as const,
    time: '01:15 PM',
    hasExpense: true,
    totalExpense: 120,
    expense: {
      fuel: 60,
      toll: 20,
      food: 25,
      other: 15,
      notes: '',
      total: 120,
    },
  },
] as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type DriverConfigType = typeof DRIVER_CONFIG;
export type DefaultExpenseType = typeof DEFAULT_EXPENSE;
export type ExpenseCategoryType = typeof EXPENSE_CATEGORIES[number];
