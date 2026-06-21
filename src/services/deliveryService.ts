/**
 * Delivery Service - Mock Service Layer implementation.
 *
 * This service handles delivery record operations using the mock data store.
 * To wire a real backend, replace the mock store calls with API calls.
 * 
 * STRUCTURE FOR BACKEND INTEGRATION:
 * - All functions return Promises for async compatibility
 * - Data shapes match backend API expectations
 * - Mock latency simulates real network behavior
 */

import { USE_MOCK, API_CONFIG } from './featureFlags';
import { SEED_HOTELS, generateId } from './mockData/StaffMockDataP';
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
 * Loads all enabled hotels from the admin master list.
 * Used to populate the hotel dropdown in AddDeliveryScreen.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/hotels?status=enabled
 * 
 * @returns Promise resolving to array of hotel options
 */
export async function loadHotelsForDelivery(): Promise<HotelOption[]> {
  if (USE_MOCK) {
    await simulateLatency();
    return SEED_HOTELS.filter(h => h.status === 'enabled');
  }
  
  // Real backend call (when USE_MOCK is false)
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/hotels?status=enabled`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to load hotels');
  }
  
  return response.json();
}

/**
 * Gets the current delivery session data.
 * Creates a mock session if none exists.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/sessions/current or POST /api/v1/sessions/start
 * 
 * @returns Promise resolving to session data
 */
export async function getDeliverySession(): Promise<DeliverySessionData> {
  if (USE_MOCK) {
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
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/sessions/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get session');
  }
  
  return response.json();
}

/**
 * Updates the session status.
 * 
 * BACKEND INTEGRATION:
 * Replace with: PATCH /api/v1/sessions/{sessionId}/status
 * 
 * @param status - New session status
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  if (USE_MOCK) {
    await simulateLatency();
    if (currentSession) {
      currentSession = { ...currentSession, sessionStatus: status };
    }
    return;
  }
  
  // Real backend call
  const sessionId = currentSession?.id;
  if (!sessionId) throw new Error('No active session');
  
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/sessions/${sessionId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update session status');
  }
}

/**
 * Saves a new delivery record.
 * Includes all new fields: loadedCans, estAmount, receivedIncome, expense fields.
 * 
 * BACKEND INTEGRATION:
 * Replace with: POST /api/v1/deliveries
 * 
 * @param formValues - The delivery form data
 * @returns Promise resolving to the created delivery record
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  if (USE_MOCK) {
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
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formValues),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save delivery');
  }
  
  return response.json();
}

/**
 * Updates an existing delivery record.
 * 
 * BACKEND INTEGRATION:
 * Replace with: PATCH /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 * @param updates - Partial delivery data to update
 * @returns Promise resolving to updated delivery record
 */
export async function updateDeliveryRecord(
  id: string,
  updates: Partial<DeliveryRecord>
): Promise<DeliveryRecord> {
  if (USE_MOCK) {
    await simulateLatency();
    
    const index = deliveryRecords.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('Delivery record not found');
    }
    
    const updated = { ...deliveryRecords[index], ...updates };
    deliveryRecords = deliveryRecords.map(r => r.id === id ? updated : r);
    return updated;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update delivery');
  }
  
  return response.json();
}

/**
 * Gets all delivery records for the current session.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/deliveries?sessionId={sessionId}
 * 
 * @returns Promise resolving to array of delivery records
 */
export async function getDeliveryRecords(): Promise<DeliveryRecord[]> {
  if (USE_MOCK) {
    await simulateLatency();
    return [...deliveryRecords];
  }
  
  // Real backend call
  const sessionId = currentSession?.id;
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries?sessionId=${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to get delivery records');
  }
  
  return response.json();
}

/**
 * Gets a delivery record by ID.
 * 
 * BACKEND INTEGRATION:
 * Replace with: GET /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 * @returns Promise resolving to delivery record or undefined
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  if (USE_MOCK) {
    await simulateLatency();
    return deliveryRecords.find(r => r.id === id);
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (response.status === 404) {
    return undefined;
  }
  
  if (!response.ok) {
    throw new Error('Failed to get delivery record');
  }
  
  return response.json();
}

/**
 * Deletes a delivery record by ID.
 * 
 * BACKEND INTEGRATION:
 * Replace with: DELETE /api/v1/deliveries/{deliveryId}
 * 
 * @param id - The delivery record ID
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
  if (USE_MOCK) {
    await simulateLatency();
    deliveryRecords = deliveryRecords.filter(r => r.id !== id);
    return;
  }
  
  // Real backend call
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.VERSION}/deliveries/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete delivery record');
  }
}

/**
 * Resets the delivery session (for testing or new day).
 * This clears all in-memory data.
 */
export function resetDeliverySession(): void {
  deliveryRecords = [];
  currentSession = null;
}
