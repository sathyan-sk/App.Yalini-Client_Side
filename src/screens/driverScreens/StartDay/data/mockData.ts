/**
 * StartDay Mock Data - Uses centralized mock service for consistency
 * 
 * This file provides data interfaces for the StartDay screen.
 * In production, this will be fetched from the driverService.
 * 
 * All IDs reference the centralized seed data:
 * - Employee: emp_seed_ramesh (Ramesh Kumar)
 * - Vehicle: veh_seed_swift_dzire (Swift Dzire - TN01AB1234)
 * - Business: biz_seed_city_taxi (City Taxi)
 */

import type { StartDayData } from '../types';
import { SEED_EMPLOYEES, SEED_VEHICLES, SEED_BUSINESSES } from '../../../../services/mockData/seedData';

// Get seed data references
const ramesh = SEED_EMPLOYEES.find(e => e.id === 'emp_seed_ramesh');
const swiftDzire = SEED_VEHICLES.find(v => v.id === 'veh_seed_swift_dzire');
const cityTaxi = SEED_BUSINESSES.find(b => b.id === 'biz_seed_city_taxi');

/**
 * Driver with assigned vehicle - using centralized seed data
 */
export const DRIVER_WITH_VEHICLE: StartDayData = {
  driver: {
    id: ramesh?.id || 'emp_seed_ramesh',
    name: ramesh?.fullName || 'Ramesh Kumar',
    businessName: cityTaxi?.name || 'City Taxi',
    businessType: 'taxi',
    role: 'Driver',
  },
  assignment: {
    vehicleId: swiftDzire?.id || 'veh_seed_swift_dzire',
    vehicleName: swiftDzire?.name || 'Swift Dzire',
    vehicleNumber: swiftDzire?.number || 'TN01AB1234',
    isAssigned: true,
  },
};

/**
 * Driver without assigned vehicle - for demo purposes
 */
export const DRIVER_WITHOUT_VEHICLE: StartDayData = {
  driver: {
    id: ramesh?.id || 'emp_seed_ramesh',
    name: ramesh?.fullName || 'Ramesh Kumar',
    businessName: cityTaxi?.name || 'City Taxi',
    businessType: 'taxi',
    role: 'Driver',
  },
  assignment: null,
};

/**
 * Default mock data (with vehicle assigned)
 */
export const DEFAULT_DRIVER_DATA = DRIVER_WITH_VEHICLE;
