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
import { generateId } from '../utils/idGenerator';
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
 * If employeeId provided, fetches hotels assigned to that employee
 * via the staff_hotel_assignments junction table (multi-hotel support).
 * In auto mode, also includes unassigned hotels for self-assignment.
 */
export async function loadHotelsForDelivery(employeeId?: string): Promise<HotelOption[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // If employeeId provided, fetch assigned hotels via junction table
  if (employeeId) {
    // Step 1: Get assigned hotel IDs from junction table
    const { data: junctionRows } = await supabase
      .from('staff_hotel_assignments')
      .select('hotel_id')
      .eq('staff_id', employeeId)
      .eq('is_active', true);

    const assignedHotelIds = (junctionRows || []).map(row => row.hotel_id);

    if (assignedHotelIds.length > 0) {
      // Step 2: Fetch full hotel details for assigned IDs
      const { data, error } = await supabase
        .from('hotels')
        .select('*')
        .in('id', assignedHotelIds)
        .eq('status', 'enabled')
        .order('name', { ascending: true });

      if (error) {
        console.error('[Supabase] Error loading assigned hotels:', error);
        throw new Error(`Failed to load hotels: ${error.message}`);
      }

      const hotels = (data || []).map(toHotelOption);
      console.log(`[Delivery] Loaded ${hotels.length} assigned hotels for employee ${employeeId}`);
      return hotels;
    }

    // No assigned hotels found
    return [];
  }

  // No employeeId - return all enabled hotels
  const { data, error } = await supabase
    .from('hotels')
    .select('*')
    .eq('status', 'enabled')
    .order('name', { ascending: true });

  if (error) {
    console.error('[Supabase] Error loading hotels:', error);
    throw new Error(`Failed to load hotels: ${error.message}`);
  }

  const hotels = (data || []).map(toHotelOption);
  console.log(`[Delivery] Loaded ${hotels.length} hotels`);
  return hotels;
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
  formValues: DeliveryFormValues & { loadedCans?: number }
): Promise<DeliveryRecord> {
  const newRecord: DeliveryRecord = {
    id: `delivery_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    hotelId: formValues.hotelId,
    hotelName: formValues.hotelName,
    ratePerCan: formValues.ratePerCan,
    loadedCans: formValues.loadedCans || 0,
    cansDelivered: formValues.cansDelivered,
    cansReturned: formValues.cansReturned,
    outstandingCans: formValues.outstandingCans,
    estAmount: formValues.estAmount,
    receivedIncome: formValues.receivedIncome,
    settledCash: formValues.settledCash || 0,
    settledOnline: formValues.settledOnline || 0,
    shortage: formValues.shortage || 0,
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
  profit: number;
  totalSettlement?: number;
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


    // Group deliveries by hotel and track remaining cans at each delivery point
    const hotelMap = new Map<string, {
      totalCans: number;
      deliveredCans: number;
      returnedCans: number;
      outstandingCans: number;
      income: number;
      expense: number;
      remainingCansAtDelivery: number; // Track remaining cans for each delivery
    }>();

    // Sort deliveries by creation time to process in order
    const sortedDeliveries = [...data.deliveries].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Track remaining cans per hotel as we process deliveries
    const hotelRemainingCans = new Map<string, number>();

    sortedDeliveries.forEach((delivery) => {
      const existing = hotelMap.get(delivery.hotelId);
      
      // Calculate remaining cans before this delivery
      const previousRemaining = hotelRemainingCans.get(delivery.hotelId) || delivery.loadedCans;
      const remainingAfterDelivery = Math.max(0, previousRemaining - delivery.cansDelivered);
      
      // Update the remaining cans tracker
      hotelRemainingCans.set(delivery.hotelId, remainingAfterDelivery);
      
      if (existing) {
        existing.totalCans += delivery.loadedCans;
        existing.deliveredCans += delivery.cansDelivered;
        existing.returnedCans += delivery.cansReturned;
        existing.outstandingCans += delivery.outstandingCans;
        existing.income += delivery.receivedIncome;
        existing.expense += delivery.expenseAmount || 0;
        // For aggregated view, use the last remaining cans value
        existing.remainingCansAtDelivery = remainingAfterDelivery;
      } else {
        hotelMap.set(delivery.hotelId, {
          totalCans: delivery.loadedCans,
          deliveredCans: delivery.cansDelivered,
          returnedCans: delivery.cansReturned,
          outstandingCans: delivery.outstandingCans,
          income: delivery.receivedIncome,
          expense: delivery.expenseAmount || 0,
          remainingCansAtDelivery: remainingAfterDelivery,
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
    const totalSettled = data.deliveries.reduce((sum, d) => sum + (d.settledCash || 0) + (d.settledOnline || 0), 0);
    const totalCashSettled = data.deliveries.reduce((sum, d) => sum + (d.settledCash || 0), 0);
    const totalOnlineSettled = data.deliveries.reduce((sum, d) => sum + (d.settledOnline || 0), 0);

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
          total_settled: totalSettled,
          total_cash_settled: totalCashSettled,
          total_online_settled: totalOnlineSettled,
          total_income: totalIncome,
          total_expense: totalExpense,
          total_profit: totalProfit,
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
        total_settled: totalSettled,
        total_cash_settled: totalCashSettled,
        total_online_settled: totalOnlineSettled,
        total_income: totalIncome,
        total_expense: totalExpense,
        total_profit: totalProfit,
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
      const ratePerCan = data.deliveries.find(d => d.hotelId === hotelId)?.ratePerCan || 0;
      const hotelSettledCash = data.deliveries
        .filter(d => d.hotelId === hotelId)
        .reduce((sum, d) => sum + (d.settledCash || 0), 0);
      const hotelSettledOnline = data.deliveries
        .filter(d => d.hotelId === hotelId)
        .reduce((sum, d) => sum + (d.settledOnline || 0), 0);
      const hotelProfit = hotel.income - hotel.expense;
      const hotelShortage = hotelProfit - (hotelSettledCash + hotelSettledOnline);
      
      hotelDeliveries.push({
        id: generateId('hd'),
        water_delivery_record_id: waterRecordId,
        hotel_name: hotelName,
        location,
        rate_per_can: ratePerCan,
        total_cans: hotel.totalCans,
        delivered_cans: hotel.deliveredCans,
        returned_cans: hotel.returnedCans,
        outstanding_cans: hotel.outstandingCans,
        remaining_cans_at_delivery: hotel.remainingCansAtDelivery,
        income: hotel.income,
        expense: hotel.expense,
        profit: hotelProfit,
        settled_cash: hotelSettledCash,
        settled_online: hotelSettledOnline,
        shortage: hotelShortage,
      });
    });

    if (hotelDeliveries.length > 0) {
      const { error: hotelError } = await supabase
        .from('hotel_deliveries')
        .insert(hotelDeliveries);

      if (hotelError) throw hotelError;
    }

    // Update outstanding_cans for each hotel
    // The outstanding_cans in hotels table should reflect the latest outstanding amount
    hotelMap.forEach((hotelData, hotelId) => {
      supabase
        .from('hotels')
        .update({ outstanding_cans: hotelData.outstandingCans })
        .eq('id', hotelId)
        .then(({ error }) => {
          if (error) {
            console.error('[Supabase] Error updating hotel outstanding cans:', error);
          } else {
            console.log(`[Supabase] Updated hotel ${hotelId} outstanding_cans to ${hotelData.outstandingCans}`);
          }
        });
    });

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
    businessMode?: 'auto' | 'manual';
  };
  assignedHotels: Array<{
    hotelId: string;
    hotelName: string;
    location: string;
    outstandingCans?: number;
  }>;
  availableHotels?: Array<{
    hotelId: string;
    hotelName: string;
    location: string;
  }>;
  totalOutstandingCans?: number;
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

  // Fetch staff data with business mode from Supabase
  const { data: employee } = await supabase
    .from('employees')
    .select('*, businesses!inner(mode)')
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

  // Get business mode
  const businessMode = (employee.businesses as any)?.mode || 'manual';

  // ======================================================================
  // MULTI-HOTEL: Fetch assigned hotels via staff_hotel_assignments junction
  // ======================================================================
  // Step 1: Get assigned hotel IDs from junction table
  const { data: junctionRows } = await supabase
    .from('staff_hotel_assignments')
    .select('hotel_id')
    .eq('staff_id', employeeId)
    .eq('is_active', true);

  const assignedHotelIds = (junctionRows || []).map(row => row.hotel_id);

  // Step 2: Fetch full hotel details for assigned IDs
  let assignedHotels: Array<{
    hotelId: string;
    hotelName: string;
    location: string;
    outstandingCans?: number;
  }> = [];

  if (assignedHotelIds.length > 0) {
    const { data: hotels } = await supabase
      .from('hotels')
      .select('*')
      .in('id', assignedHotelIds)
      .eq('status', 'enabled');

    assignedHotels = (hotels || []).map(hotel => ({
      hotelId: hotel.id,
      hotelName: hotel.name,
      location: hotel.location || '',
      outstandingCans: hotel.outstanding_cans || 0,
    }));
  }

  // Calculate total outstanding cans
  const totalOutstandingCans = assignedHotels.reduce(
    (sum, hotel) => sum + (hotel.outstandingCans || 0), 
    0
  );

  // In auto mode, also fetch available hotels for self-assignment
  let availableHotels: any[] = [];
  if (businessMode === 'auto') {
    let query = supabase
      .from('hotels')
      .select('id, name, location')
      .eq('status', 'enabled');

    // Exclude already assigned hotels
    if (assignedHotelIds.length > 0) {
      query = query.not('id', 'in', `(${assignedHotelIds.map(id => `'${id}'`).join(',')})`);
    }

    const { data: availHotels } = await query;
    availableHotels = availHotels || [];
  }

  return {
    staff: {
      id: employee.id,
      name: employee.full_name,
      businessName: employee.business_name,
      businessType: employee.business_type,
      role: 'Staff',
      businessMode,
    },
    assignedHotels,
    availableHotels: businessMode === 'auto' ? availableHotels : undefined,
    totalOutstandingCans,
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