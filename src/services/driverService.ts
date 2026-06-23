/**
 * Driver Service Layer
 * Handles data fetching for driver module
 *
 * Uses central mock store for data consistency with admin module.
 * When driver submits their day, it creates a record visible to admin.
 *
 * INTEGRATION: When USE_MOCK=false, delegates to Supabase implementation.
 */
import { USE_MOCK } from "./featureFlags";
import {
  getEmployeeById,
  getVehicleById,
  getVehicles,
  getDriverRecordByEmployeeAndDate,
  createDriverRecord,
  updateDriverRecord,
  todayISODate,
  generateId,
  type MockDriverRecord,
  type TripDetail,
} from "./mockData";
import type {
  DriverHomeData,
  SessionSubmissionData,
  SessionSubmissionResponse,
  Trip,
  StartDayData,
} from "../types/driver";

/** Simulates network latency for realistic async behavior */
const MOCK_LATENCY_MS = 150;

async function simulateLatency(): Promise<void> {
  if (MOCK_LATENCY_MS > 0) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));
  }
}

// Avatar colors for driver records
const AVATAR_COLORS = [
  '#1E88E5', // Blue
  '#7C3AED', // Purple
  '#059669', // Green
  '#EA580C', // Orange
  '#8B5CF6', // Vivid Purple
  '#0D9488', // Teal
  '#0891B2', // Cyan
];

function getRandomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}

/**
 * Get driver info by employee ID
 * Pulls from central employee/vehicle store for consistency
 */
export async function getDriverInfo(employeeId: string): Promise<DriverHomeData | null> {
  if (!USE_MOCK) {
    const { getDriverInfo: getFromSupabase } = await import('./driverService.supabase');
    return getFromSupabase(employeeId);
  }

  await simulateLatency();

  const employee = await getEmployeeById(employeeId);
  if (!employee || employee.businessType !== 'taxi') {
    return null;
  }

  // Find assigned vehicle for this driver
  const vehicles = await getVehicles();
  const assignedVehicle = vehicles.find(v => v.assignedEmployeeId === employeeId);

  // Check for existing record today
  const today = todayISODate();
  const todayRecord = await getDriverRecordByEmployeeAndDate(employeeId, today);

  return {
    driver: {
      id: employee.id,
      name: employee.fullName,
      businessName: employee.businessName,
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
      totalIncome: todayRecord?.totalIncome || 0,
      totalExpenses: todayRecord?.totalExpense || 0,
    },
    recentActivity: [],
    notificationCount: 0,
  };
}

/**
 * Fetch driver home screen data using default demo driver
 */
export async function getDriverHomeData(employeeId?: string): Promise<DriverHomeData> {
  if (!USE_MOCK) {
    const { getDriverHomeData: getFromSupabase } = await import('./driverService.supabase');
    return getFromSupabase(employeeId);
  }

  await simulateLatency();

  // Use provided employeeId or fall back to first available driver
  const targetEmployeeId = employeeId || 'emp_seed_ramesh';
  const employee = await getEmployeeById(targetEmployeeId);
  if (!employee) {
    throw new Error('No driver found');
  }

  const vehicles = await getVehicles();
  const assignedVehicle = vehicles.find(v => v.assignedEmployeeId === employee.id);

  return {
    driver: {
      id: employee.id,
      name: employee.fullName,
      businessName: employee.businessName,
      businessType: 'taxi',
      role: 'Driver',
    },
    assignment: assignedVehicle ? {
      vehicleId: assignedVehicle.id,
      vehicleName: assignedVehicle.name,
      vehicleNumber: assignedVehicle.number,
      isAssigned: true,
    } : null,
    sessionStatus: 'OPEN',
    sessionDate: formatDisplayDate(todayISODate()),
    sessionStartTime: '08:00 AM',
    todayOverview: {
      totalTrips: 0,
      totalIncome: 0,
      totalExpenses: 0,
    },
    recentActivity: [],
    notificationCount: 0,
  };
}

/**
 * Fetch driver home screen data with trips (for demo)
 */
export async function getDriverHomeDataWithTrips(): Promise<DriverHomeData> {
  if (!USE_MOCK) {
    const { getDriverHomeDataWithTrips: getFromSupabase } = await import('./driverService.supabase');
    return getFromSupabase();
  }

  await simulateLatency();

  // Get first available driver from mock data
  const employee = await getEmployeeById('emp_seed_ramesh');
  if (!employee) {
    throw new Error('No driver found');
  }

  const vehicles = await getVehicles();
  const assignedVehicle = vehicles.find(v => v.assignedEmployeeId === employee.id);

  return {
    driver: {
      id: employee.id,
      name: employee.fullName,
      businessName: employee.businessName,
      businessType: 'taxi',
      role: 'Driver',
    },
    assignment: assignedVehicle ? {
      vehicleId: assignedVehicle.id,
      vehicleName: assignedVehicle.name,
      vehicleNumber: assignedVehicle.number,
      isAssigned: true,
    } : null,
    sessionStatus: 'OPEN',
    sessionDate: formatDisplayDate(todayISODate()),
    sessionStartTime: '08:00 AM',
    todayOverview: {
      totalTrips: 0,
      totalIncome: 0,
      totalExpenses: 0,
    },
    recentActivity: [],
    notificationCount: 0,
  };
}

/**
 * Submit driver session/day
 * Creates a driver record in the central store that admin can see immediately
 */
export async function submitDriverSession(
  data: SessionSubmissionData
): Promise<SessionSubmissionResponse> {
  if (!USE_MOCK) {
    const { submitDriverSession: submitToSupabase } = await import('./driverService.supabase');
    return submitToSupabase(data);
  }

  await simulateLatency();

  // Convert session data to driver record format
  const tripDetails: TripDetail[] = data.trips.map((trip: Trip, index: number) => ({
    id: trip.id || generateId('trip'),
    tripNumber: index + 1,
    destination: `${trip.from} to ${trip.to}`,
    distance: 10 + Math.random() * 20, // Simulated distance
    income: trip.amount,
    expense: trip.totalExpense || 0,
  }));

  // Get vehicle info if available
  let vehicleName = 'Unknown Vehicle';
  let vehicleNumber = 'Unknown';
  let vehicleId = data.vehicleId;

  if (data.vehicleId) {
    const vehicle = await getVehicleById(data.vehicleId);
    if (vehicle) {
      vehicleName = vehicle.name;
      vehicleNumber = vehicle.number;
    }
  }

  // Get employee/driver name
  let driverName = 'Unknown Driver';
  if (data.driverId) {
    const employee = await getEmployeeById(data.driverId);
    if (employee) {
      driverName = employee.fullName;
    }
  }

  // Create the driver record
  const recordData: Omit<MockDriverRecord, 'id'> = {
    driverName,
    employeeId: data.driverId,
    vehicleId: vehicleId || '',
    vehicleName,
    vehicleNumber,
    date: todayISODate(),
    status: 'submitted',
    avatarColor: getRandomAvatarColor(),
    trips: data.totalTrips,
    totalIncome: data.totalIncome,
    totalExpense: data.totalExpenses,
    settledToAdmin: Math.floor(data.totalIncome * 0.7),
    balanceShortage: Math.floor(data.totalIncome * 0.3) - data.totalExpenses,
    totalProfit: data.netAmount,
    perKmRate: 16,
    tripDetails,
    fuelExpense: Math.floor(data.totalExpenses * 0.6),
  };

  // Save to central store - admin will see this immediately
  const createdRecord = await createDriverRecord(recordData);

  return {
    success: true,
    message: 'Session submitted successfully',
    submissionId: createdRecord.id,
    submittedAt: new Date().toISOString(),
  };
}

/**
 * Start a new driver session
 */
export async function startDriverSession(
  driverId: string,
  vehicleId: string
): Promise<{ success: boolean; sessionId: string }> {
  if (!USE_MOCK) {
    const { startDriverSession: startInSupabase } = await import('./driverService.supabase');
    return startInSupabase(driverId, vehicleId);
  }

  await simulateLatency();
  return {
    success: true,
    sessionId: generateId('SESSION'),
  };
}

/**
 * End driver session without full submission
 */
export async function endDriverSession(
  sessionId: string
): Promise<{ success: boolean }> {
  if (!USE_MOCK) {
    const { endDriverSession: endInSupabase } = await import('./driverService.supabase');
    return endInSupabase(sessionId);
  }

  await simulateLatency();
  return { success: true };
}

/**
 * Get greeting based on time of day
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Validate session before submission
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
 * Get driver's submission history
 */
export async function getDriverSubmissionHistory(
  driverId: string
): Promise<MockDriverRecord[]> {
  if (!USE_MOCK) {
    const { getDriverSubmissionHistory: getFromSupabase } = await import('./driverService.supabase');
    return getFromSupabase(driverId) as unknown as Promise<MockDriverRecord[]>;
  }

  await simulateLatency();
  const { getDriverRecordsByEmployeeId } = await import('./mockData');
  return getDriverRecordsByEmployeeId(driverId);
}

/**
 * Get start day screen data.
 * Returns driver info + vehicle assignment status.
 * Called by DriverStartDayScreen on mount.
 */
export async function getStartDayData(employeeId?: string): Promise<StartDayData> {
  if (!USE_MOCK) {
    const { getStartDayData: getFromSupabase } = await import('./driverService.supabase');
    return getFromSupabase(employeeId);
  }

  await simulateLatency();

  // Use provided employeeId or fall back to first available taxi driver
  const targetEmployeeId = employeeId || 'emp_seed_ramesh';
  const employee = await getEmployeeById(targetEmployeeId);
  const vehicles = await getVehicles();
  const assignedVehicle = vehicles.find(
    (v) => v.assignedEmployeeId === employee?.id
  ) ?? null;

  if (employee) {
    return {
      driver: {
        id: employee.id,
        name: employee.fullName,
        businessName: employee.businessName,
        businessType: "taxi" as const,
        role: "Driver",
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

  throw new Error('No driver found');
}
