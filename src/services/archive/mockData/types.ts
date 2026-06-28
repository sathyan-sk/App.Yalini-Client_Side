/**
 * Unified types for the Mock Service Layer.
 * These types are the source of truth for all mock data structures.
 */

import type { BusinessTypeId, BusinessModeId, BusinessStatusId } from '../../screens/adminScreens/MyBusiness/types';
import type { EmployeeStatusId } from '../../screens/adminScreens/Employees/types';
import type { HotelStatusId } from '../../screens/adminScreens/Hotels/types';
import type { VehicleStatusId } from '../../types/vehicle';
import type { RecordStatus } from '../../types/taxiRecords';
import type { RecordStatus as WaterRecordStatus, HotelDelivery } from '../../types/waterRecords';

// Re-export types for convenience
export type { BusinessTypeId, BusinessModeId, BusinessStatusId };
export type { EmployeeStatusId };
export type { HotelStatusId };
export type { VehicleStatusId };
export type { RecordStatus, WaterRecordStatus, HotelDelivery };

/**
 * Business entity in the mock store
 */
export interface MockBusiness {
  id: string;
  name: string;
  type: BusinessTypeId;
  mode: BusinessModeId;
  status: BusinessStatusId;
  location?: string;
  employees: number;
  createdAt: string;
}

/**
 * Employee entity in the mock store
 */
export interface MockEmployee {
  id: string;
  fullName: string;
  mobile: string;
  businessId: string;
  businessName: string;
  businessType: BusinessTypeId;
  pin: string;
  status: EmployeeStatusId;
  createdAt: string;
}

/**
 * Vehicle entity in the mock store
 */
export interface MockVehicle {
  id: string;
  name: string;
  number: string;
  status: VehicleStatusId;
  notes?: string;
  assignedDriver?: string;
  assignedEmployeeId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hotel entity in the mock store
 */
export interface MockHotel {
  id: string;
  name: string;
  ratePerCan: number;
  status: HotelStatusId;
  location?: string;
  assignedEmployeeId?: string;
  assignedEmployeeName?: string;
  createdAt: string;
}

/**
 * Trip detail for taxi records
 */
export interface TripDetail {
  id: string;
  tripNumber: number;
  destination: string;
  distance: number;
  income: number;
  expense: number;
}

/**
 * Taxi driver daily record
 */
export interface MockDriverRecord {
  id: string;
  driverName: string;
  employeeId: string;
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  date: string;
  status: RecordStatus;
  avatarColor: string;
  trips: number;
  totalIncome: number;
  totalExpense: number;
  settledToAdmin: number;
  balanceShortage: number;
  totalProfit: number;
  perKmRate: number;
  tripDetails: TripDetail[];
  fuelExpense: number;
}

/**
 * Water delivery daily record
 */
export interface MockWaterDeliveryRecord {
  id: string;
  deliveryPersonName: string;
  employeeId: string;
  date: string;
  status: WaterRecordStatus;
  avatarColor: string;
  totalHotels: number;
  totalCans: number;
  totalDelivered: number;
  totalReturned: number;
  totalOutstanding: number;
  totalIncome: number;
  totalExpense: number;
  totalProfit: number;
  hotelDeliveries: HotelDelivery[];
}

/**
 * The complete mock data store shape
 */
export interface MockDataStore {
  businesses: MockBusiness[];
  employees: MockEmployee[];
  vehicles: MockVehicle[];
  hotels: MockHotel[];
  driverRecords: MockDriverRecord[];
  waterDeliveryRecords: MockWaterDeliveryRecord[];
}
