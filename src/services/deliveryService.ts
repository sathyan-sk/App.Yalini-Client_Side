/**
 * Delivery Service - Mock Service Layer implementation.
 *
 * This service handles delivery record operations using the mock data store.
 * To wire a real backend, replace the mock store calls with API calls.
 */

import { USE_MOCK } from './featureFlags';
import { getHotels, generateId, todayISODate } from './mockData';
import type { MockHotel } from './mockData/types';
import type {
  HotelOption,
  DeliveryRecord,
  DeliveryFormValues,
  DeliverySessionData,
  SessionStatus,
} from '../screens/staffScreens/AddDelivery/types';

/** In-memory store for delivery records during a session */
let deliveryRecords: DeliveryRecord[] = [];

/** Current session data */
let currentSession: DeliverySessionData | null = null;

/**
 * Simulates network latency for realistic async behavior.
 * @returns Promise that resolves after delay
 */
async function simulateLatency(): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 150));
  }
}

/**
 * Converts MockHotel to HotelOption for dropdown.
 * @param hotel - The mock hotel data
 * @returns Hotel option for selector
 */
function toHotelOption(hotel: MockHotel): HotelOption {
  return {
    id: hotel.id,
    name: hotel.name,
    ratePerCan: hotel.ratePerCan,
    location: hotel.location,
    status: hotel.status,
  };
}

/**
 * Loads all enabled hotels from the admin master list.
 * Used to populate the hotel dropdown in AddDeliveryScreen.
 * @returns Promise resolving to array of hotel options
 */
export async function loadHotelsForDelivery(): Promise<HotelOption[]> {
  await simulateLatency();
  const hotels = await getHotels();
  return hotels
    .filter(h => h.status === 'enabled')
    .map(toHotelOption);
}

/**
 * Gets the current delivery session data.
 * Creates a mock session if none exists.
 * @returns Promise resolving to session data
 */
export async function getDeliverySession(): Promise<DeliverySessionData> {
  await simulateLatency();
  
  if (!currentSession) {
    // Create mock session data
    const now = new Date();
    currentSession = {
      id: generateId('session'),
      staffName: 'Mani Kumar',
      serviceName: 'Yalini Minerals',
      sessionDate: now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      sessionTime: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sessionStatus: 'ACTIVE',
    };
  }
  
  return currentSession;
}

/**
 * Updates the session status.
 * @param status - New session status
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  await simulateLatency();
  if (currentSession) {
    currentSession = { ...currentSession, sessionStatus: status };
  }
}

/**
 * Saves a new delivery record.
 * Includes all new fields: loadedCans, estAmount, receivedIncome, expense fields.
 * @param formValues - The delivery form data
 * @returns Promise resolving to the created delivery record
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  await simulateLatency();
  
  const newRecord: DeliveryRecord = {
    id: generateId('delivery'),
    hotelId: formValues.hotelId,
    hotelName: formValues.hotelName,
    ratePerCan: formValues.ratePerCan,
    loadedCans: formValues.loadedCans,
    cansDelivered: formValues.cansDelivered,
    cansReturned: formValues.cansReturned,
    outstandingCans: formValues.outstandingCans,
    estAmount: formValues.estAmount,
    receivedIncome: formValues.receivedIncome,
    paymentMode: formValues.paymentMode,
    expenseCategory: formValues.expenseCategory,
    expenseAmount: formValues.expenseAmount,
    createdAt: new Date().toISOString(),
  };
  
  deliveryRecords = [newRecord, ...deliveryRecords];
  return newRecord;
}

/**
 * Gets all delivery records for the current session.
 * @returns Promise resolving to array of delivery records
 */
export async function getDeliveryRecords(): Promise<DeliveryRecord[]> {
  await simulateLatency();
  return [...deliveryRecords];
}

/**
 * Gets a delivery record by ID.
 * @param id - The delivery record ID
 * @returns Promise resolving to delivery record or undefined
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  await simulateLatency();
  return deliveryRecords.find(r => r.id === id);
}

/**
 * Deletes a delivery record by ID.
 * @param id - The delivery record ID
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
  await simulateLatency();
  deliveryRecords = deliveryRecords.filter(r => r.id !== id);
}

/**
 * Resets the delivery session (for testing or new day).
 */
export function resetDeliverySession(): void {
  deliveryRecords = [];
  currentSession = null;
}
