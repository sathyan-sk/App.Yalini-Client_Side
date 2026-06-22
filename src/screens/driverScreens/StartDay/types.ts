/**
 * Type contracts for the Driver StartDay module.
 */

export interface DriverAssignment {
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
  isAssigned: boolean;
}

export interface DriverInfo {
  id: string;
  name: string;
  businessName: string;
  businessType: 'taxi';
  role: 'Driver';
}

// screens/driverScreens/StartDay/types.ts
// Add this if not already exists

export interface StartDayData {
  driver: {
    id:           string
    name:         string
    businessName: string
    businessType: string
    role:         string
  }
  assignment: {
    vehicleId:     string
    vehicleName:   string
    vehicleNumber: string
    isAssigned:    boolean
  } | null
}
