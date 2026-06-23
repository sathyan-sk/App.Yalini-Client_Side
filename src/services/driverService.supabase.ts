/**
 * Driver Service Layer — Supabase implementation.
 *
 * Handles data fetching for the driver module using Supabase.
 * When a driver submits their day, it creates a record visible to admin.
 *
 * Keeps the same function signatures as the mock driverService.ts
 * so the store layer (tripStore) doesn't need to change.
 */
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import { generateId } from '../services/mockData';
import type { Database } from '../config/database.types';
import type {
  DriverHomeData,
  SessionSubmissionData,
  SessionSubmissionResponse,
  Trip,
  StartDayData,
} from '../types/driver';

type DriverRecordRow = Database['public']['Tables']['driver_records']['Row'];
type DriverRecordInsert = Database['public']['Tables']['driver_records']['Insert'];
type TripDetailInsert = Database['public']['Tables']['trip_details']['Insert'];

/** Simulates network latency for realistic async behavior */
const MOCK_LATENCY_MS = 150;

async function simulateLatency(): Promise<void> {
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  }
}

const AVATAR_COLORS = [
  '#1E88E5', '#7C3AED', '#059669', '#EA580C',
  '#8B5CF6', '#0D9488', '#0891B2',
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Format date for display (e.g., "19 Jun 2026")
 */
function formatDisplayDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Get driver info by employee ID.
 * Pulls from Supabase employees/vehicles tables.
 */
export async function getDriverInfo(employeeId: string): Promise<DriverHomeData | null> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // Fetch employee
  const { data: employee, error: empError } = await supabase
    .from('employees')
    .select('*')
    .eq('id', employeeId)
    .single();

  if (empError || !employee || employee.business_type !== 'taxi') {
    return null;
  }

  // Find assigned vehicle
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('assigned_employee_id', employeeId)
    .limit(1);

  const assignedVehicle = vehicles?.[0] || null;

  // Check for existing record today
  const today = getTodayDate();
  const { data: todayRecord } = await supabase
    .from('driver_records')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('date', today)
    .single();

  return {
    driver: {
      id: employee.id,
      name: employee.full_name,
      businessName: employee.business_name,
      businessType: 'taxi',
      role: 'Driver',
    },
    assignment: assignedVehicle ? {
      vehicleId: assignedVehicle.id,
      vehicleName: assignedVehicle.name,
      vehicleNumber: assignedVehicle.number,
      isAssigned: true,
    } : null,
    sessionStatus: todayRecord?.status === 'submitted' ? 'SUBMITTED' : 'OPEN',
    sessionDate: formatDisplayDate(today),
    sessionStartTime: '08:00 AM',
    todayOverview: {
      totalTrips: todayRecord?.trips || 0,
      totalIncome: todayRecord?.total_income || 0,
      totalExpenses: todayRecord?.total_expense || 0,
    },
    recentActivity: [],
    notificationCount: 0,
  };
}

/**
 * Fetch driver home screen data using default demo driver.
 * In production, the employee ID would come from the auth store.
 */
export async function getDriverHomeData(): Promise<DriverHomeData> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // In production, get the employee ID from the authenticated user
  // For now, we query the first taxi employee as a fallback
  const { data: employees } = await supabase
    .from('employees')
    .select('id')
    .eq('business_type', 'taxi')
    .eq('status', 'enabled')
    .limit(1);

  const employeeId = employees?.[0]?.id;
  if (!employeeId) {
    throw new Error('No taxi employee found');
  }

  return getDriverInfo(employeeId) as Promise<DriverHomeData>;
}

/**
 * Fetch driver home screen data with trips (for demo).
 */
export async function getDriverHomeDataWithTrips(): Promise<DriverHomeData> {
  // Same as getDriverHomeData for now; trips are managed client-side via tripStore
  return getDriverHomeData();
}

/**
 * Submit driver session/day to Supabase.
 * Creates a driver_record + trip_details entries.
 */
export async function submitDriverSession(
  data: SessionSubmissionData
): Promise<SessionSubmissionResponse> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  try {
    // Get vehicle info
    let vehicleName = 'Unknown Vehicle';
    let vehicleNumber = 'Unknown';
    if (data.vehicleId) {
      const { data: vehicle } = await supabase
        .from('vehicles')
        .select('name, number')
        .eq('id', data.vehicleId)
        .single();
      if (vehicle) {
        vehicleName = vehicle.name;
        vehicleNumber = vehicle.number;
      }
    }

    // Get driver name
    let driverName = 'Unknown Driver';
    if (data.driverId) {
      const { data: employee } = await supabase
        .from('employees')
        .select('full_name')
        .eq('id', data.driverId)
        .single();
      if (employee) {
        driverName = employee.full_name;
      }
    }

    const today = getTodayDate();

    // Check if a record already exists for this employee on this date
    const { data: existingRecord } = await supabase
      .from('driver_records')
      .select('id')
      .eq('employee_id', data.driverId)
      .eq('date', today)
      .single();

    let driverRecordId: string;

    if (existingRecord) {
      // Update existing record
      driverRecordId = existingRecord.id;
      const { error: updateError } = await supabase
        .from('driver_records')
        .update({
          driver_name: driverName,
          vehicle_name: vehicleName,
          vehicle_number: vehicleNumber,
          status: 'submitted',
          avatar_color: getRandomAvatarColor(),
          trips: data.totalTrips,
          total_income: data.totalIncome,
          total_expense: data.totalExpenses,
          settled_to_admin: Math.floor(data.totalIncome * 0.7),
          balance_shortage: Math.floor(data.totalIncome * 0.3) - data.totalExpenses,
          total_profit: data.netAmount,
          per_km_rate: 16,
          fuel_expense: Math.floor(data.totalExpenses * 0.6),
        })
        .eq('id', driverRecordId);

      if (updateError) throw updateError;

      // Delete old trip details and re-insert
      await supabase
        .from('trip_details')
        .delete()
        .eq('driver_record_id', driverRecordId);
    } else {
      // Create new driver record
      const insertData: DriverRecordInsert = {
        id: generateId('dr'),
        driver_name: driverName,
        employee_id: data.driverId,
        vehicle_id: data.vehicleId,
        vehicle_name: vehicleName,
        vehicle_number: vehicleNumber,
        date: today,
        status: 'submitted',
        avatar_color: getRandomAvatarColor(),
        trips: data.totalTrips,
        total_income: data.totalIncome,
        total_expense: data.totalExpenses,
        settled_to_admin: Math.floor(data.totalIncome * 0.7),
        balance_shortage: Math.floor(data.totalIncome * 0.3) - data.totalExpenses,
        total_profit: data.netAmount,
        per_km_rate: 16,
        fuel_expense: Math.floor(data.totalExpenses * 0.6),
      };

      const { data: newRecord, error: insertError } = await supabase
        .from('driver_records')
        .insert(insertData)
        .select()
        .single();

      if (insertError || !newRecord) throw insertError || new Error('Failed to create record');
      driverRecordId = newRecord.id;
    }

    // Insert trip details
    const tripDetails: TripDetailInsert[] = data.trips.map((trip: Trip, index: number) => ({
      driver_record_id: driverRecordId,
      trip_number: index + 1,
      destination: `${trip.from} to ${trip.to}`,
      distance: 10 + Math.random() * 20, // Simulated distance
      income: trip.amount,
      expense: trip.totalExpense || 0,
    }));

    if (tripDetails.length > 0) {
      const { error: tripError } = await supabase
        .from('trip_details')
        .insert(tripDetails);

      if (tripError) throw tripError;
    }

    return {
      success: true,
      message: 'Session submitted successfully',
      submissionId: driverRecordId,
      submittedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Supabase] Error submitting driver session:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit session',
    };
  }
}

/**
 * Start a new driver session.
 */
export async function startDriverSession(
  driverId: string,
  vehicleId: string
): Promise<{ success: boolean; sessionId: string }> {
  // Session is managed client-side via tripStore; no server-side action needed
  return {
    success: true,
    sessionId: `SESSION_${Date.now()}`,
  };
}

/**
 * End driver session without full submission.
 */
export async function endDriverSession(
  sessionId: string
): Promise<{ success: boolean }> {
  // Session is managed client-side via tripStore
  return { success: true };
}

/**
 * Get greeting based on time of day.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Validate session before submission.
 */
export function validateSessionForSubmission(
  trips: Trip[],
  totalTrips: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (totalTrips === 0) {
    errors.push('No trips recorded for this session');
  }

  const tripsWithoutExpenses = trips.filter(trip => !trip.hasExpense);
  if (tripsWithoutExpenses.length > 0) {
    errors.push(`${tripsWithoutExpenses.length} trip(s) are missing expenses`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get driver's submission history from Supabase.
 */
export async function getDriverSubmissionHistory(
  driverId: string
): Promise<DriverRecordRow[]> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  const { data, error } = await supabase
    .from('driver_records')
    .select('*')
    .eq('employee_id', driverId)
    .order('date', { ascending: false });

  if (error) {
    console.error('[Supabase] Error fetching driver history:', error);
    throw new Error(`Failed to fetch submission history: ${error.message}`);
  }

  return data || [];
}

/**
 * Get start day screen data.
 * Returns driver info + vehicle assignment status from Supabase.
 */
export async function getStartDayData(): Promise<StartDayData> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured');
  }

  // Get the first enabled taxi employee (in production, use the authenticated user)
  const { data: employees } = await supabase
    .from('employees')
    .select('*')
    .eq('business_type', 'taxi')
    .eq('status', 'enabled')
    .limit(1);

  const employee = employees?.[0];
  if (!employee) {
    throw new Error('No taxi employee found');
  }

  // Find assigned vehicle
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('assigned_employee_id', employee.id)
    .limit(1);

  const assignedVehicle = vehicles?.[0] || null;

  return {
    driver: {
      id: employee.id,
      name: employee.full_name,
      businessName: employee.business_name,
      businessType: 'taxi',
      role: 'Driver',
    },
    assignment: assignedVehicle
      ? {
          vehicleId: assignedVehicle.id,
          vehicleName: assignedVehicle.name,
          vehicleNumber: assignedVehicle.number,
          isAssigned: true,
        }
      : null,
  };
}