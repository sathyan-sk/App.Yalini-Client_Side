/**
 * Central Mock Data Store
 *
 * This is the single source of truth for all mock data in the application.
 * It replaces AsyncStorage with an in-memory store that:
 *
 * 1. Maintains coherent data relationships
 * 2. Simulates async behavior (for easy backend migration)
 * 3. Provides CRUD operations through service interfaces
 *
 * To migrate to a real backend:
 * - Replace the store read/write operations with API calls
 * - Keep the same function signatures
 * 
 * FIX APPLIED: Added createWaterDeliveryRecord(), updateWaterDeliveryRecord(),
 * deleteWaterDeliveryRecord(), and getWaterDeliveryRecordByEmployeeAndDate()
 * so that Staff module submissions flow to Admin Records.
 */

import {
  SEED_BUSINESSES,
  SEED_EMPLOYEES,
  SEED_VEHICLES,
  SEED_HOTELS,
  generateSeedDriverRecords,
  generateSeedWaterDeliveryRecords,
} from './seedData';
import type {
  MockDataStore,
  MockBusiness,
  MockEmployee,
  MockVehicle,
  MockHotel,
  MockDriverRecord,
  MockWaterDeliveryRecord,
} from './types';

// Re-export types
export * from './types';

// ============================================================================
// IN-MEMORY STORE
// ============================================================================

/**
 * The central in-memory data store.
 * This is mutable and all services read/write from here.
 */
let store: MockDataStore = {
  businesses: [...SEED_BUSINESSES],
  employees: [...SEED_EMPLOYEES],
  vehicles: [...SEED_VEHICLES],
  hotels: [...SEED_HOTELS],
  driverRecords: generateSeedDriverRecords(),
  waterDeliveryRecords: generateSeedWaterDeliveryRecords(),
};

/**
 * Simulates network latency for a more realistic async experience.
 * Set to 0 for instant operations during development.
 */
const MOCK_LATENCY_MS = 150;

async function simulateLatency(): Promise<void> {
  if (MOCK_LATENCY_MS > 0) {
    await new Promise(resolve => setTimeout(resolve, MOCK_LATENCY_MS));
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/** Strict ISO date (YYYY-MM-DD) for `createdAt`. */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** RN-safe unique id generator (no crypto.randomUUID polyfill required). */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// ============================================================================
// BUSINESS OPERATIONS
// ============================================================================

export async function getBusinesses(): Promise<MockBusiness[]> {
  await simulateLatency();
  return [...store.businesses];
}

export async function getBusinessById(id: string): Promise<MockBusiness | undefined> {
  await simulateLatency();
  return store.businesses.find(b => b.id === id);
}

export async function createBusiness(business: Omit<MockBusiness, 'id' | 'createdAt'>): Promise<MockBusiness> {
  await simulateLatency();
  const newBusiness: MockBusiness = {
    ...business,
    id: generateId('biz'),
    employees: 0,
    createdAt: todayISODate(),
  };
  store.businesses = [newBusiness, ...store.businesses];
  return newBusiness;
}

export async function updateBusiness(id: string, updates: Partial<MockBusiness>): Promise<MockBusiness | null> {
  await simulateLatency();
  const index = store.businesses.findIndex(b => b.id === id);
  if (index === -1) return null;

  const updated = { ...store.businesses[index], ...updates };
  store.businesses = store.businesses.map(b => b.id === id ? updated : b);
  return updated;
}

export async function deleteBusiness(id: string): Promise<void> {
  await simulateLatency();
  store.businesses = store.businesses.filter(b => b.id !== id);
}

// ============================================================================
// EMPLOYEE OPERATIONS
// ============================================================================

export async function getEmployees(): Promise<MockEmployee[]> {
  await simulateLatency();
  return [...store.employees];
}

export async function getEmployeeById(id: string): Promise<MockEmployee | undefined> {
  await simulateLatency();
  return store.employees.find(e => e.id === id);
}

export async function getEmployeesByBusinessId(businessId: string): Promise<MockEmployee[]> {
  await simulateLatency();
  return store.employees.filter(e => e.businessId === businessId);
}

export async function getEmployeesByBusinessType(businessType: 'taxi' | 'water_delivery'): Promise<MockEmployee[]> {
  await simulateLatency();
  return store.employees.filter(e => e.businessType === businessType);
}

export async function createEmployee(employee: Omit<MockEmployee, 'id' | 'createdAt'>): Promise<MockEmployee> {
  await simulateLatency();
  const newEmployee: MockEmployee = {
    ...employee,
    id: generateId('emp'),
    createdAt: todayISODate(),
  };
  store.employees = [newEmployee, ...store.employees];

  // Update business employee count
  const business = store.businesses.find(b => b.id === employee.businessId);
  if (business) {
    store.businesses = store.businesses.map(b =>
      b.id === employee.businessId ? { ...b, employees: b.employees + 1 } : b
    );
  }

  return newEmployee;
}

export async function updateEmployee(id: string, updates: Partial<MockEmployee>): Promise<MockEmployee | null> {
  await simulateLatency();
  const index = store.employees.findIndex(e => e.id === id);
  if (index === -1) return null;

  const updated = { ...store.employees[index], ...updates };
  store.employees = store.employees.map(e => e.id === id ? updated : e);
  return updated;
}

export async function deleteEmployee(id: string): Promise<void> {
  await simulateLatency();
  const employee = store.employees.find(e => e.id === id);
  store.employees = store.employees.filter(e => e.id !== id);

  // Update business employee count
  if (employee) {
    store.businesses = store.businesses.map(b =>
      b.id === employee.businessId ? { ...b, employees: Math.max(0, b.employees - 1) } : b
    );
  }
}

// ============================================================================
// VEHICLE OPERATIONS
// ============================================================================

export async function getVehicles(): Promise<MockVehicle[]> {
  await simulateLatency();
  return [...store.vehicles];
}

export async function getVehicleById(id: string): Promise<MockVehicle | undefined> {
  await simulateLatency();
  return store.vehicles.find(v => v.id === id);
}

export async function createVehicle(vehicle: Omit<MockVehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockVehicle> {
  await simulateLatency();
  const today = todayISODate();
  const newVehicle: MockVehicle = {
    ...vehicle,
    id: generateId('veh'),
    createdAt: today,
    updatedAt: today,
  };
  store.vehicles = [newVehicle, ...store.vehicles];
  return newVehicle;
}

export async function updateVehicle(id: string, updates: Partial<MockVehicle>): Promise<MockVehicle | null> {
  await simulateLatency();
  const index = store.vehicles.findIndex(v => v.id === id);
  if (index === -1) return null;

  const updated = { ...store.vehicles[index], ...updates, updatedAt: todayISODate() };
  store.vehicles = store.vehicles.map(v => v.id === id ? updated : v);
  return updated;
}

export async function deleteVehicle(id: string): Promise<void> {
  await simulateLatency();
  store.vehicles = store.vehicles.filter(v => v.id !== id);
}

export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string,
  employeeName: string
): Promise<MockVehicle | null> {
  return updateVehicle(vehicleId, {
    assignedEmployeeId: employeeId,
    assignedDriver: employeeName,
  });
}

export async function unassignEmployeeFromVehicle(vehicleId: string): Promise<MockVehicle | null> {
  return updateVehicle(vehicleId, {
    assignedEmployeeId: undefined,
    assignedDriver: undefined,
  });
}

// ============================================================================
// HOTEL OPERATIONS
// ============================================================================

export async function getHotels(): Promise<MockHotel[]> {
  await simulateLatency();
  return [...store.hotels];
}

export async function getHotelById(id: string): Promise<MockHotel | undefined> {
  await simulateLatency();
  return store.hotels.find(h => h.id === id);
}

export async function createHotel(hotel: Omit<MockHotel, 'id' | 'createdAt'>): Promise<MockHotel> {
  await simulateLatency();
  const newHotel: MockHotel = {
    ...hotel,
    id: generateId('hotel'),
    createdAt: todayISODate(),
  };
  store.hotels = [newHotel, ...store.hotels];
  return newHotel;
}

export async function updateHotel(id: string, updates: Partial<MockHotel>): Promise<MockHotel | null> {
  await simulateLatency();
  const index = store.hotels.findIndex(h => h.id === id);
  if (index === -1) return null;

  const updated = { ...store.hotels[index], ...updates };
  store.hotels = store.hotels.map(h => h.id === id ? updated : h);
  return updated;
}

export async function deleteHotel(id: string): Promise<void> {
  await simulateLatency();
  store.hotels = store.hotels.filter(h => h.id !== id);
}

export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string,
  employeeName: string
): Promise<MockHotel | null> {
  return updateHotel(hotelId, {
    assignedEmployeeId: employeeId,
    assignedEmployeeName: employeeName,
  });
}

export async function unassignEmployeeFromHotel(hotelId: string): Promise<MockHotel | null> {
  return updateHotel(hotelId, {
    assignedEmployeeId: undefined,
    assignedEmployeeName: undefined,
  });
}

// ============================================================================
// DRIVER RECORDS OPERATIONS
// ============================================================================

export async function getDriverRecords(): Promise<MockDriverRecord[]> {
  await simulateLatency();
  return [...store.driverRecords];
}

export async function getDriverRecordById(id: string): Promise<MockDriverRecord | undefined> {
  await simulateLatency();
  return store.driverRecords.find(r => r.id === id);
}

export async function getDriverRecordsByDate(date: string): Promise<MockDriverRecord[]> {
  await simulateLatency();
  return store.driverRecords.filter(r => r.date === date);
}

export async function getDriverRecordsByEmployeeId(employeeId: string): Promise<MockDriverRecord[]> {
  await simulateLatency();
  return store.driverRecords.filter(r => r.employeeId === employeeId);
}

/**
 * Create a new driver record (called when driver submits their day)
 * This makes the submission visible to admin immediately
 */
export async function createDriverRecord(
  record: Omit<MockDriverRecord, 'id'>
): Promise<MockDriverRecord> {
  await simulateLatency();

  // Check if a record already exists for this employee on this date
  const existingIndex = store.driverRecords.findIndex(
    r => r.employeeId === record.employeeId && r.date === record.date
  );

  if (existingIndex !== -1) {
    // Update existing record instead of creating new one
    const updated = { ...store.driverRecords[existingIndex], ...record };
    store.driverRecords = store.driverRecords.map((r, i) =>
      i === existingIndex ? updated : r
    );
    return updated;
  }

  const newRecord: MockDriverRecord = {
    ...record,
    id: generateId('rec_taxi'),
  };
  store.driverRecords = [newRecord, ...store.driverRecords];
  return newRecord;
}

/**
 * Update an existing driver record
 */
export async function updateDriverRecord(
  id: string,
  updates: Partial<MockDriverRecord>
): Promise<MockDriverRecord | null> {
  await simulateLatency();
  const index = store.driverRecords.findIndex(r => r.id === id);
  if (index === -1) return null;

  const updated = { ...store.driverRecords[index], ...updates };
  store.driverRecords = store.driverRecords.map(r => r.id === id ? updated : r);
  return updated;
}

/**
 * Delete a driver record
 */
export async function deleteDriverRecord(id: string): Promise<void> {
  await simulateLatency();
  store.driverRecords = store.driverRecords.filter(r => r.id !== id);
}

/**
 * Get driver record by employee ID and date (for checking existing submission)
 */
export async function getDriverRecordByEmployeeAndDate(
  employeeId: string,
  date: string
): Promise<MockDriverRecord | undefined> {
  await simulateLatency();
  return store.driverRecords.find(
    r => r.employeeId === employeeId && r.date === date
  );
}

// ============================================================================
// WATER DELIVERY RECORDS OPERATIONS (FIX: Added full CRUD for staff submissions)
// ============================================================================

export async function getWaterDeliveryRecords(): Promise<MockWaterDeliveryRecord[]> {
  await simulateLatency();
  return [...store.waterDeliveryRecords];
}

export async function getWaterDeliveryRecordById(id: string): Promise<MockWaterDeliveryRecord | undefined> {
  await simulateLatency();
  return store.waterDeliveryRecords.find(r => r.id === id);
}

export async function getWaterDeliveryRecordsByDate(date: string): Promise<MockWaterDeliveryRecord[]> {
  await simulateLatency();
  return store.waterDeliveryRecords.filter(r => r.date === date);
}

/**
 * FIX: Get water delivery records by employee ID
 * This allows fetching submission history for a specific staff member
 */
export async function getWaterDeliveryRecordsByEmployeeId(employeeId: string): Promise<MockWaterDeliveryRecord[]> {
  await simulateLatency();
  return store.waterDeliveryRecords.filter(r => r.employeeId === employeeId);
}

/**
 * FIX: Get water delivery record by employee ID and date
 * This checks if a submission already exists for today
 */
export async function getWaterDeliveryRecordByEmployeeAndDate(
  employeeId: string,
  date: string
): Promise<MockWaterDeliveryRecord | undefined> {
  await simulateLatency();
  return store.waterDeliveryRecords.find(
    r => r.employeeId === employeeId && r.date === date
  );
}

/**
 * FIX: Create a new water delivery record (called when staff submits their day)
 * This makes the submission visible to admin immediately
 * 
 * This is the KEY FIX - staff submissions now go to the central store
 * so admin Records screen can see them.
 */
export async function createWaterDeliveryRecord(
  record: Omit<MockWaterDeliveryRecord, 'id'>
): Promise<MockWaterDeliveryRecord> {
  await simulateLatency();

  // Check if a record already exists for this employee on this date
  const existingIndex = store.waterDeliveryRecords.findIndex(
    r => r.employeeId === record.employeeId && r.date === record.date
  );

  if (existingIndex !== -1) {
    // Update existing record instead of creating new one
    const updated = { ...store.waterDeliveryRecords[existingIndex], ...record };
    store.waterDeliveryRecords = store.waterDeliveryRecords.map((r, i) =>
      i === existingIndex ? updated : r
    );
    return updated;
  }

  const newRecord: MockWaterDeliveryRecord = {
    ...record,
    id: generateId('rec_water'),
  };
  store.waterDeliveryRecords = [newRecord, ...store.waterDeliveryRecords];
  return newRecord;
}

/**
 * FIX: Update an existing water delivery record
 */
export async function updateWaterDeliveryRecord(
  id: string,
  updates: Partial<MockWaterDeliveryRecord>
): Promise<MockWaterDeliveryRecord | null> {
  await simulateLatency();
  const index = store.waterDeliveryRecords.findIndex(r => r.id === id);
  if (index === -1) return null;

  const updated = { ...store.waterDeliveryRecords[index], ...updates };
  store.waterDeliveryRecords = store.waterDeliveryRecords.map(r => r.id === id ? updated : r);
  return updated;
}

/**
 * FIX: Delete a water delivery record
 */
export async function deleteWaterDeliveryRecord(id: string): Promise<void> {
  await simulateLatency();
  store.waterDeliveryRecords = store.waterDeliveryRecords.filter(r => r.id !== id);
}

// ============================================================================
// STORE UTILITIES
// ============================================================================

/**
 * Reset the store to initial seed data.
 * Useful for testing or when user wants to reset all data.
 */
export function resetStore(): void {
  store = {
    businesses: [...SEED_BUSINESSES],
    employees: [...SEED_EMPLOYEES],
    vehicles: [...SEED_VEHICLES],
    hotels: [...SEED_HOTELS],
    driverRecords: generateSeedDriverRecords(),
    waterDeliveryRecords: generateSeedWaterDeliveryRecords(),
  };
}

/**
 * Get a snapshot of the entire store (for debugging).
 */
export function getStoreSnapshot(): MockDataStore {
  return {
    businesses: [...store.businesses],
    employees: [...store.employees],
    vehicles: [...store.vehicles],
    hotels: [...store.hotels],
    driverRecords: [...store.driverRecords],
    waterDeliveryRecords: [...store.waterDeliveryRecords],
  };
}

/**
 * Get businesses formatted for the BusinessSelector component.
 * Returns a simplified format with id, name, and type.
 */
export async function getBusinessesForSelector(): Promise<Array<{ id: string; name: string; type: 'taxi' | 'water' }>> {
  await simulateLatency();
  return store.businesses
    .filter(b => b.status === 'enabled')
    .map(b => ({
      id: b.id,
      name: b.name,
      type: b.type === 'water_delivery' ? 'water' : 'taxi',
    }));
}
