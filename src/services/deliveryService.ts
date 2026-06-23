/**
 * Delivery Service - Mock Service Layer implementation.
 *
 * This service handles delivery record operations using the mock data store.
 * To wire a real backend, replace the mock store calls with API calls.
 * 
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */

import { USE_MOCK } from './featureFlags';
import { 
  getHotels, 
  generateId, 
  todayISODate,
  createWaterDeliveryRecord,
  getEmployeeById,
} from './mockData';
import type { MockHotel, MockWaterDeliveryRecord, HotelDelivery } from './mockData/types';
import type {
  HotelOption,
  DeliveryRecord,
  DeliveryFormValues,
  DeliverySessionData,
  SessionStatus,
} from '../screens/staffScreens/AddDelivery/types';

// Staff configuration - populated from Supabase on login
const STAFF_CONFIG = {
  staffId: '',
  staffName: '',
  businessName: 'Yalini Minerals',
};

function toHotelOption(hotel: MockHotel): HotelOption {
  return {
    id: hotel.id,
    name: hotel.name,
    ratePerCan: hotel.ratePerCan,
    location: hotel.location,
    status: hotel.status,
  };
}

/** In-memory store for delivery records during a session */
let deliveryRecords: DeliveryRecord[] = [];

/** Current session data */
let currentSession: DeliverySessionData | null = null;

/**
 * Simulates network latency for realistic async behavior.
 */
async function simulateLatency(): Promise<void> {
  if (USE_MOCK) {
    await new Promise(resolve => setTimeout(resolve, 150));
  }
}

/**
 * Loads all enabled hotels from the admin master list.
 */
export async function loadHotelsForDelivery(employeeId?: string): Promise<HotelOption[]> {
  if (!USE_MOCK) {
    const { loadHotelsForDelivery: loadFromSupabase } = await import('./deliveryService.supabase');
    return loadFromSupabase(employeeId);
  }

  const allHotels = await getHotels();
  const filtered = employeeId
    ? allHotels.filter(h => h.status === 'enabled' && h.assignedEmployeeId === employeeId)
    : allHotels.filter(h => h.status === 'enabled');
  return filtered.map(toHotelOption);
}

/**
 * Gets the current delivery session data.
 */
export async function getDeliverySession(employeeId?: string): Promise<DeliverySessionData> {
  if (!USE_MOCK) {
    const { getDeliverySession: getFromSupabase } = await import('./deliveryService.supabase');
    return getFromSupabase(employeeId);
  }

  await simulateLatency();
  
  if (!currentSession) {
    const now = new Date();
    currentSession = {
      id: generateId('session'),
      staffName: STAFF_CONFIG.staffName || 'Staff',
      serviceName: STAFF_CONFIG.businessName,
      staffId: employeeId || STAFF_CONFIG.staffId,
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
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  if (!USE_MOCK) {
    const { updateSessionStatus: updateInSupabase } = await import('./deliveryService.supabase');
    return updateInSupabase(status);
  }

  await simulateLatency();
  if (currentSession) {
    currentSession = { ...currentSession, sessionStatus: status };
  }
}

/**
 * Saves a new delivery record.
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  if (!USE_MOCK) {
    const { saveDeliveryRecord: saveInSupabase } = await import('./deliveryService.supabase');
    return saveInSupabase(formValues);
  }

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
 * Updates an existing delivery record.
 */
export async function updateDeliveryRecord(
  id: string,
  updates: Partial<DeliveryRecord>
): Promise<DeliveryRecord> {
  if (!USE_MOCK) {
    const { updateDeliveryRecord: updateInSupabase } = await import('./deliveryService.supabase');
    return updateInSupabase(id, updates);
  }

  await simulateLatency();
  
  const index = deliveryRecords.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Delivery record not found');
  }
  
  const updated = { ...deliveryRecords[index], ...updates };
  deliveryRecords = deliveryRecords.map(r => r.id === id ? updated : r);
  return updated;
}

/**
 * Gets all delivery records for the current session.
 */
export async function getDeliveryRecords(): Promise<DeliveryRecord[]> {
  if (!USE_MOCK) {
    const { getDeliveryRecords: getFromSupabase } = await import('./deliveryService.supabase');
    return getFromSupabase();
  }

  await simulateLatency();
  return [...deliveryRecords];
}

/**
 * Gets a delivery record by ID.
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  if (!USE_MOCK) {
    const { getDeliveryRecordById: getFromSupabase } = await import('./deliveryService.supabase');
    return getFromSupabase(id);
  }

  await simulateLatency();
  return deliveryRecords.find(r => r.id === id);
}

/**
 * Deletes a delivery record by ID.
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
  if (!USE_MOCK) {
    const { deleteDeliveryRecord: deleteInSupabase } = await import('./deliveryService.supabase');
    return deleteInSupabase(id);
  }

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

/**
 * Submission data for staff session
 */
export interface StaffSessionSubmissionData {
  staffId: string;
  staffName: string;
  deliveries: DeliveryRecord[];
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
}

/**
 * Response from session submission
 */
export interface StaffSessionSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
  submittedAt?: string;
}

/**
 * Submit staff delivery session to the central store.
 * This is the KEY function that creates a MockWaterDeliveryRecord in the
 * central store, making the submission visible to Admin's Records screen.
 */
export async function submitStaffSession(
  data: StaffSessionSubmissionData
): Promise<StaffSessionSubmissionResponse> {
  if (!USE_MOCK) {
    const { submitStaffSession: submitInSupabase } = await import('./deliveryService.supabase');
    return submitInSupabase(data);
  }

  await simulateLatency();

  // Get staff/employee information
  let staffName = data.staffName || STAFF_CONFIG.staffName || 'Staff';
  const staffId = data.staffId || STAFF_CONFIG.staffId;

  // Try to get actual employee name from store
  const employee = await getEmployeeById(staffId);
  if (employee) {
    staffName = employee.fullName;
  }

  // Convert delivery records to HotelDelivery format
  // Group by hotel and aggregate
  const hotelMap = new Map<string, HotelDelivery>();

  data.deliveries.forEach((delivery, index) => {
    const existing = hotelMap.get(delivery.hotelId);
    if (existing) {
      existing.totalCans += delivery.loadedCans;
      existing.deliveredCans += delivery.cansDelivered;
      existing.returnedCans += delivery.cansReturned;
      existing.outstandingCans += delivery.outstandingCans;
      existing.income += delivery.receivedIncome;
      existing.expense += delivery.expenseAmount || 0;
      existing.profit = existing.income - existing.expense;
    } else {
      hotelMap.set(delivery.hotelId, {
        id: `hoteldelivery_${delivery.hotelId}_${Date.now()}_${index}`,
        hotelName: delivery.hotelName,
        location: '',
        totalCans: delivery.loadedCans,
        deliveredCans: delivery.cansDelivered,
        returnedCans: delivery.cansReturned,
        outstandingCans: delivery.outstandingCans,
        income: delivery.receivedIncome,
        expense: delivery.expenseAmount || 0,
        profit: delivery.receivedIncome - (delivery.expenseAmount || 0),
      });
    }
  });

  const hotelDeliveries = Array.from(hotelMap.values());

  // Calculate totals
  const totals = hotelDeliveries.reduce(
    (acc, hotel) => ({
      totalHotels: acc.totalHotels + 1,
      totalCans: acc.totalCans + hotel.totalCans,
      totalDelivered: acc.totalDelivered + hotel.deliveredCans,
      totalReturned: acc.totalReturned + hotel.returnedCans,
      totalOutstanding: acc.totalOutstanding + hotel.outstandingCans,
      totalIncome: acc.totalIncome + hotel.income,
      totalExpense: acc.totalExpense + hotel.expense,
      totalProfit: acc.totalProfit + hotel.profit,
    }),
    {
      totalHotels: 0,
      totalCans: 0,
      totalDelivered: 0,
      totalReturned: 0,
      totalOutstanding: 0,
      totalIncome: 0,
      totalExpense: 0,
      totalProfit: 0,
    }
  );

  // Create the water delivery record for central store
  const recordData: Omit<MockWaterDeliveryRecord, 'id'> = {
    deliveryPersonName: staffName,
    employeeId: staffId,
    date: todayISODate(),
    status: 'submitted',
    avatarColor: '#7C3AED',
    ...totals,
    hotelDeliveries,
  };

  // Save to central store - Admin will see this immediately!
  const createdRecord = await createWaterDeliveryRecord(recordData);

  // Clear local session data after successful submission
  deliveryRecords = [];

  return {
    success: true,
    message: 'Session submitted successfully',
    submissionId: createdRecord.id,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Get staff session for a specific employee ID (used by StartDay screen).
 * Uses centralized staff config.
 */
export async function getStaffHomeData(employeeId?: string) {
  if (!USE_MOCK) {
    const { getStaffHomeData: getFromSupabase } = await import('./deliveryService.supabase');
    return getFromSupabase(employeeId);
  }

  await simulateLatency();

  const staffId = employeeId || STAFF_CONFIG.staffId;
  if (staffId) {
    const employee = await getEmployeeById(staffId);
    if (employee) {
      // Get assigned hotels for this employee
      const hotels = await getHotels();
      const assignedHotels = hotels
        .filter(h => h.assignedEmployeeId === staffId && h.status === 'enabled')
        .map(h => ({
          hotelId: h.id,
          hotelName: h.name,
          location: h.location || '',
        }));

      return {
        staff: {
          id: employee.id,
          name: employee.fullName,
          businessName: employee.businessName,
          businessType: employee.businessType,
          role: 'Staff',
        },
        assignedHotels,
        sessionStatus: 'OPEN',
        sessionDate: formatDisplayDate(todayISODate()),
      };
    }
  }

  throw new Error('No staff employee configured. Please login first.');
}

/**
 * Format date for display (e.g., "22 Jun 2026")
 */
function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}