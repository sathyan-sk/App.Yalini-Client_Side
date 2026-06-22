/**
 * Driver Service Layer
 * Handles data fetching for driver module
 * 
 * Uses central mock store for data consistency with admin module.
 * When driver submits their day, it creates a record visible to admin.
 * 
 * To migrate to real backend:
 * - Set USE_MOCK to false
 * - Replace mock operations with fetch() calls to EXPO_PUBLIC_BACKEND_URL
 */

import { USE_MOCK, API_CONFIG } from "./featureFlags";
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
} from "../types/driver"

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
  if (USE_MOCK) {
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

  // Real API call
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/${employeeId}/home`);
  if (!response.ok) throw new Error('Failed to fetch driver info');
  return response.json();
}

/**
 * Fetch driver home screen data using default demo driver
 */
export async function getDriverHomeData(): Promise<DriverHomeData> {
  if (USE_MOCK) {
    await simulateLatency();
    
    // Default demo driver (Ramesh Kumar from seed data)
    const demoDriverId = 'emp_seed_ramesh';
    const driverInfo = await getDriverInfo(demoDriverId);
    
    if (driverInfo) {
      return driverInfo;
    }
    
    // Fallback if demo driver not found
    return {
      driver: {
        id: 'emp_seed_ramesh',
        name: 'Ramesh Kumar',
        businessName: 'City Taxi',
        businessType: 'taxi',
        role: 'Driver',
      },
      assignment: {
        vehicleId: 'veh_seed_swift_dzire',
        vehicleName: 'Swift Dzire',
        vehicleNumber: 'TN01AB1234',
        isAssigned: true,
      },
      sessionStatus: 'OPEN',
      sessionDate: formatDisplayDate(todayISODate()),
      sessionStartTime: '08:05 AM',
      todayOverview: {
        totalTrips: 0,
        totalIncome: 0,
        totalExpenses: 0,
      },
      recentActivity: [],
      notificationCount: 2,
    };
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/home`);
  if (!response.ok) throw new Error('Failed to fetch driver home data');
  return response.json();
}

/**
 * Fetch driver home screen data with trips (for demo)
 */
export async function getDriverHomeDataWithTrips(): Promise<DriverHomeData> {
  if (USE_MOCK) {
    await simulateLatency();
    
    return {
      driver: {
        id: 'emp_seed_ramesh',
        name: 'Ramesh Kumar',
        businessName: 'City Taxi',
        businessType: 'taxi',
        role: 'Driver',
      },
      assignment: {
        vehicleId: 'veh_seed_swift_dzire',
        vehicleName: 'Swift Dzire',
        vehicleNumber: 'TNN01AB1234',
        isAssigned: true,
      },
      sessionStatus: 'OPEN',
      sessionDate: formatDisplayDate(todayISODate()),
      sessionStartTime: '08:05 AM',
      todayOverview: {
        totalTrips: 5,
        totalIncome: 3250,
        totalExpenses: 520,
      },
      recentActivity: [
        {
          id: 'activity_1',
          type: 'trip',
          description: 'Trip to RS Puram',
          amount: 900,
          time: '01:15 PM',
        },
        {
          id: 'activity_2',
          type: 'expense',
          description: 'Fuel expense added',
          amount: 120,
          time: '01:20 PM',
        },
      ],
      notificationCount: 3,
    };
  }

  throw new Error('API not implemented');
}

/**
 * Submit driver session/day
 * Creates a driver record in the central store that admin can see immediately
 */
export async function submitDriverSession(
  data: SessionSubmissionData
): Promise<SessionSubmissionResponse> {
  if (USE_MOCK) {
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

  // Real API call
  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/session/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Submission failed' }));
    return {
      success: false,
      message: error.message || 'Failed to submit session',
    };
  }
  
  return response.json();
}

/**
 * Start a new driver session
 */
export async function startDriverSession(
  driverId: string, 
  vehicleId: string
): Promise<{ success: boolean; sessionId: string }> {
  if (USE_MOCK) {
    await simulateLatency();
    return {
      success: true,
      sessionId: generateId('SESSION'),
    };
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driverId, vehicleId }),
  });
  
  if (!response.ok) throw new Error('Failed to start session');
  return response.json();
}

/**
 * End driver session without full submission
 */
export async function endDriverSession(
  sessionId: string
): Promise<{ success: boolean }> {
  if (USE_MOCK) {
    await simulateLatency();
    return { success: true };
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/session/${sessionId}/end`, {
    method: 'POST',
  });
  
  if (!response.ok) throw new Error('Failed to end session');
  return response.json();
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
 * Format date for display (e.g., \"19 Jun 2026\")
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
  if (USE_MOCK) {
    await simulateLatency();
    const { getDriverRecordsByEmployeeId } = await import('./mockData');
    return getDriverRecordsByEmployeeId(driverId);
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}/api/driver/${driverId}/history`);
  if (!response.ok) throw new Error('Failed to fetch submission history');
  return response.json();
}
/**
 * Get start day screen data.
 * Returns driver info + vehicle assignment status.
 * Called by DriverStartDayScreen on mount.
 */
export async function getStartDayData(): Promise<StartDayData> {
  if (USE_MOCK) {
    await simulateLatency()

    const demoDriverId    = "emp_seed_ramesh"
    const employee        = await getEmployeeById(demoDriverId)
    const vehicles        = await getVehicles()
    const assignedVehicle = vehicles.find(
      (v) => v.assignedEmployeeId === demoDriverId
    ) ?? null

    if (employee) {
      return {
        driver: {
          id:           employee.id,
          name:         employee.fullName,
          businessName: employee.businessName,
          businessType: "taxi" as const,
          role:         "Driver",
        },
        assignment: assignedVehicle
          ? {
              vehicleId:     assignedVehicle.id,
              vehicleName:   assignedVehicle.name,
              vehicleNumber: assignedVehicle.number,
              isAssigned:    true,
            }
          : null,
      }
    }

    // fallback
    return {
      driver: {
        id:           "emp_seed_ramesh",
        name:         "Ramesh Kumar",
        businessName: "City Taxi",
        businessType: "taxi" as const,
        role:         "Driver",
      },
      assignment: {
        vehicleId:     "veh_seed_swift_dzire",
        vehicleName:   "Swift Dzire",
        vehicleNumber: "TN01AB1234",
        isAssigned:    true,
      },
    }
  }

  const response = await fetch(
    `${API_CONFIG.BASE_URL}/api/driver/start-day`
  )
  if (!response.ok) throw new Error("Failed to fetch start day data")
  return response.json()
}
