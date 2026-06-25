/**
 * Delivery Service — Supabase implementation.
 *
 * Handles delivery record operations using Supabase.
 * When staff submits their day, it creates a water_delivery_record
 * + hotel_deliveries entries visible to Admin.
 *
 * Keeps the same function signatures as the mock deliveryService.ts
 * so the store layer (deliveryStore) doesn't need to change.
 */
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import { generateId } from '../services/mockData';
import type { Database } from '../config/database.types';
import type {
  HotelOption,
  DeliveryRecord,
  DeliveryFormValues,
  DeliverySessionData,
  SessionStatus,
} from '../screens/staffScreens/AddDelivery/types';

type WaterRecordInsert = Database['public']['Tables']['water_delivery_records']['Insert'];
type HotelDeliveryInsert = Database['public']['Tables']['hotel_deliveries']['Insert'];
type HotelRow = Database['public']['Tables']['hotels']['Row'];

const AVATAR_COLORS = [
  '#1E88E5', '#7C3AED', '#059669', '#EA580C',
  '#8B5CF6', '#0D9488', '#0891B2',
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

function toHotelOption(hotel: HotelRow): HotelOption {
  return {
    id: hotel.id,
    name: hotel.name,
    ratePerCan: hotel.rate_per_can,
    location: hotel.location ?? undefined,
    status: hotel.status,
  };
}

/** In-memory store for delivery records during a session */
let deliveryRecords: DeliveryRecord[] = [];

/** Current session data */
let currentSession: DeliverySessionData | null = null;

/**
 * Loads all enabled hotels from Supabase.
 * If employeeId provided, filters by assigned employee.
 */
export async function loadHotelsForDelivery(employeeId?: string): Promise<HotelOption[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  let query = supabase
    .from('hotels')
    .select('*')
    .eq('status', 'enabled');

  // Filter by assigned employee if provided
  if (employeeId) {
    query = query.eq('assigned_employee_id', employeeId);
  }

  const { data, error } = await query.order('name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error loading hotels:', error);
    throw new Error(`Failed to load hotels: ${error.message}`);
  }

  return (data || []).map(toHotelOption);
}

/**
 * Gets the current delivery session data.
 * Creates a new session if none exists.
 * Uses employeeId to fetch real staff name from Supabase.
 */
export async function getDeliverySession(employeeId?: string): Promise<DeliverySessionData> {
  if (currentSession) {
    return currentSession;
  }

  const now = new Date();

  // Try to fetch real staff name from Supabase
  let staffName = 'Staff';
  let businessName = 'Yalini Minerals';

  if (employeeId) {
    try {
      const { data: employee } = await supabase
        .from('employees')
        .select('full_name, business_name')
        .eq('id', employeeId)
        .single();

      if (employee) {
        staffName = employee.full_name;
        businessName = employee.business_name;
      }
    } catch (err) {
      console.log('[Delivery] Could not fetch employee name, using default');
    }
  }

  currentSession = {
    id: `session_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    staffName,
    serviceName: businessName,
    staffId: employeeId || '',
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

  return currentSession;
}

/**
 * Updates the session status.
 */
export async function updateSessionStatus(status: SessionStatus): Promise<void> {
  if (currentSession) {
    currentSession = { ...currentSession, sessionStatus: status };
  }
}

/**
 * Saves a new delivery record (in-memory until session submission).
 * In Supabase mode, individual deliveries are accumulated locally
 * and batch-submitted when the staff checks out.
 */
export async function saveDeliveryRecord(
  formValues: DeliveryFormValues
): Promise<DeliveryRecord> {
  const newRecord: DeliveryRecord = {
    id: `delivery_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
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
  return [...deliveryRecords];
}

/**
 * Gets a delivery record by ID.
 */
export async function getDeliveryRecordById(
  id: string
): Promise<DeliveryRecord | undefined> {
  return deliveryRecords.find(r => r.id === id);
}

/**
 * Deletes a delivery record by ID.
 */
export async function deleteDeliveryRecord(id: string): Promise<void> {
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
 * Submit staff delivery session to Supabase.
 * Creates a water_delivery_record + hotel_deliveries entries.
 * This makes the submission visible to Admin's Records screen.
 */
export async function submitStaffSession(
  data: StaffSessionSubmissionData
): Promise<StaffSessionSubmissionResponse> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  try {
    // Get staff/employee information
    let staffName = data.staffName;
    if (data.staffId) {
      const { data: employee } = await supabase
        .from('employees')
        .select('full_name')
        .eq('id', data.staffId)
        .single();
      if (employee) {
        staffName = employee.full_name;
      }
    }

    const today = getTodayDate();
    const avatarColor = getRandomAvatarColor();


    // FIX 3: Compute dominant payment mode from individual deliveries so that
    // water_delivery_records stores the real payment mode instead of always 'cash'.
    const paymentModes = data.deliveries.map(d => (d.paymentMode ?? 'CASH').toUpperCase());
    const cashCount = paymentModes.filter(m => m === 'CASH').length;
    const onlineCount = paymentModes.filter(m => m === 'ONLINE').length;
    const dominantPaymentMode =
      cashCount > 0 && onlineCount === 0 ? 'cash'
      : onlineCount > 0 && cashCount === 0 ? 'online'
      : 'mixed';


    // Group deliveries by hotel and aggregate
    const hotelMap = new Map<string, {
      totalCans: number;
      deliveredCans: number;
      returnedCans: number;
      outstandingCans: number;
      income: number;
      expense: number;
    }>();

    data.deliveries.forEach((delivery) => {
      const existing = hotelMap.get(delivery.hotelId);
      if (existing) {
        existing.totalCans += delivery.loadedCans;
        existing.deliveredCans += delivery.cansDelivered;
        existing.returnedCans += delivery.cansReturned;
        existing.outstandingCans += delivery.outstandingCans;
        existing.income += delivery.receivedIncome;
        existing.expense += delivery.expenseAmount || 0;
      } else {
        hotelMap.set(delivery.hotelId, {
          totalCans: delivery.loadedCans,
          deliveredCans: delivery.cansDelivered,
          returnedCans: delivery.cansReturned,
          outstandingCans: delivery.outstandingCans,
          income: delivery.receivedIncome,
          expense: delivery.expenseAmount || 0,
        });
      }
    });

    // Calculate totals
    let totalHotels = 0;
    let totalCans = 0;
    let totalDelivered = 0;
    let totalReturned = 0;
    let totalOutstanding = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    hotelMap.forEach((hotel) => {
      totalHotels++;
      totalCans += hotel.totalCans;
      totalDelivered += hotel.deliveredCans;
      totalReturned += hotel.returnedCans;
      totalOutstanding += hotel.outstandingCans;
      totalIncome += hotel.income;
      totalExpense += hotel.expense;
    });

    const totalProfit = totalIncome - totalExpense;

    // Check if a record already exists for this employee on this date
    const { data: existingRecord } = await supabase
      .from('water_delivery_records')
      .select('id')
      .eq('employee_id', data.staffId)
      .eq('date', today)
      .single();

    let waterRecordId: string;

    if (existingRecord) {
      // Update existing record
      waterRecordId = existingRecord.id;
      const { error: updateError } = await supabase
        .from('water_delivery_records')
        .update({
          delivery_person_name: staffName,
          status: 'submitted',
          avatar_color: avatarColor,
          total_hotels: totalHotels,
          total_cans: totalCans,
          total_delivered: totalDelivered,
          total_returned: totalReturned,
          total_outstanding: totalOutstanding,
          total_income: totalIncome,
          total_expense: totalExpense,
          total_profit: totalProfit,
          payment_mode: dominantPaymentMode,
        })
        .eq('id', waterRecordId);

      if (updateError) throw updateError;

      // Delete old hotel deliveries and re-insert
      await supabase
        .from('hotel_deliveries')
        .delete()
        .eq('water_delivery_record_id', waterRecordId);
    } else {
      // Create new water delivery record
      const insertData: WaterRecordInsert = {
        id: generateId('wd'),
        delivery_person_name: staffName,
        employee_id: data.staffId,
        date: today,
        status: 'submitted',
        avatar_color: avatarColor,
        total_hotels: totalHotels,
        total_cans: totalCans,
        total_delivered: totalDelivered,
        total_returned: totalReturned,
        total_outstanding: totalOutstanding,
        total_income: totalIncome,
        total_expense: totalExpense,
        total_profit: totalProfit,
        payment_mode: dominantPaymentMode,
      };

      const { data: newRecord, error: insertError } = await supabase
        .from('water_delivery_records')
        .insert(insertData)
        .select()
        .single();

      if (insertError || !newRecord) throw insertError || new Error('Failed to create record');
      waterRecordId = newRecord.id;
    }

    // Insert hotel deliveries with real location from hotels table
    const hotelDeliveries: HotelDeliveryInsert[] = [];
    
    // Fetch all hotel locations in one query
    const hotelIds = Array.from(hotelMap.keys());
    const { data: hotelsData } = await supabase
      .from('hotels')
      .select('id, location')
      .in('id', hotelIds);
    
    const hotelLocationMap = new Map((hotelsData || []).map(h => [h.id, h.location || '']));
    
    hotelMap.forEach((hotel, hotelId) => {
      const hotelName = data.deliveries.find(d => d.hotelId === hotelId)?.hotelName || 'Unknown Hotel';
      const location = hotelLocationMap.get(hotelId) || '';
      hotelDeliveries.push({
        id: generateId('hd'),
        water_delivery_record_id: waterRecordId,
        hotel_name: hotelName,
        location,
        total_cans: hotel.totalCans,
        delivered_cans: hotel.deliveredCans,
        returned_cans: hotel.returnedCans,
        outstanding_cans: hotel.outstandingCans,
        income: hotel.income,
        expense: hotel.expense,
        profit: hotel.income - hotel.expense,
      });
    });

    if (hotelDeliveries.length > 0) {
      const { error: hotelError } = await supabase
        .from('hotel_deliveries')
        .insert(hotelDeliveries);

      if (hotelError) throw hotelError;
    }

    // Clear local session data after successful submission
    deliveryRecords = [];

    return {
      success: true,
      message: 'Session submitted successfully',
      submissionId: waterRecordId,
      submittedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Supabase] Error submitting staff session:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit session',
    };
  }
}

/**
 * Get staff session for a specific employee ID (used by staff home and start day screens).
 */
export async function getStaffHomeData(employeeId?: string): Promise<{
  staff: {
    id: string;
    name: string;
    businessName: string;
    businessType: string;
    role: string;
  };
  assignedHotels: Array<{
    hotelId: string;
    hotelName: string;
    location: string;
  }>;
  sessionStatus: string;
  sessionDate: string;
}> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // Use provided employeeId or return empty state
  if (!employeeId) {
    return {
      staff: {
        id: '',
        name: 'Staff',
        businessName: 'Yalini Minerals',
        businessType: 'water_delivery',
        role: 'Staff',
      },
      assignedHotels: [],
      sessionStatus: 'OPEN',
      sessionDate: formatDisplayDate(getTodayDate()),
    };
  }

  // Fetch staff data from Supabase using the provided employee ID
  const { data: employee } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();
  
  if (!employee || employee.business_type !== 'water_delivery') {
    return {
      staff: {
        id: '',
        name: 'Staff',
        businessName: 'Yalini Minerals',
        businessType: 'water_delivery',
        role: 'Staff',
      },
      assignedHotels: [],
      sessionStatus: 'OPEN',
      sessionDate: formatDisplayDate(getTodayDate()),
    };
  }

  // Get assigned hotels for this employee
  const { data: hotels } = await supabase
    .from('hotels')
    .select('*')
    .eq('assigned_employee_id', employeeId)
    .eq('status', 'enabled');

  const assignedHotels = (hotels || []).map(hotel => ({
    hotelId: hotel.id,
    hotelName: hotel.name,
    location: hotel.location || '',
  }));

  return {
    staff: {
      id: employee.id,
      name: employee.full_name,
      businessName: employee.business_name,
      businessType: employee.business_type,
      role: 'Staff',
    },
    assignedHotels,
    sessionStatus: 'OPEN',
    sessionDate: formatDisplayDate(getTodayDate()),
  };
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