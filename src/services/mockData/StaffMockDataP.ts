/**
 * Mock Data - Seed data for the mock service layer.
 * Contains initial hotels and helper functions.
 */
import type { HotelOption } from '../../screens/staffScreens/AddDelivery/types';

/**
 * Seed hotels for the mock data store.
 */
export const SEED_HOTELS: HotelOption[] = [
  {
    id: 'hotel_1',
    name: 'Grand Hyatt',
    ratePerCan: 50,
    location: 'Anna Nagar',
    status: 'enabled',
  },
  {
    id: 'hotel_2',
    name: 'Taj Coromandel',
    ratePerCan: 55,
    location: 'Nungambakkam',
    status: 'enabled',
  },
  {
    id: 'hotel_3',
    name: 'ITC Grand Chola',
    ratePerCan: 60,
    location: 'Guindy',
    status: 'enabled',
  },
  {
    id: 'hotel_4',
    name: 'Leela Palace',
    ratePerCan: 55,
    location: 'Adyar',
    status: 'enabled',
  },
  {
    id: 'hotel_5',
    name: 'Park Hyatt',
    ratePerCan: 50,
    location: 'Velachery',
    status: 'enabled',
  },
  {
    id: 'hotel_6',
    name: 'Radisson Blu',
    ratePerCan: 45,
    location: 'OMR',
    status: 'enabled',
  },
  {
    id: 'hotel_7',
    name: 'Crowne Plaza',
    ratePerCan: 48,
    location: 'Adyar',
    status: 'enabled',
  },
  {
    id: 'hotel_8',
    name: 'Sheraton',
    ratePerCan: 52,
    location: 'Perungudi',
    status: 'disabled',
  },
];

/**
 * RN-safe unique id generator (no crypto.randomUUID polyfill required).
 * @param prefix - Prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Strict ISO date (YYYY-MM-DD) for timestamps.
 * @returns Today's date in ISO format
 */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}
