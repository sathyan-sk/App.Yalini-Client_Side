# Business Mode Implementation Plan
## Auto/Manual Assignment System

---

## 📋 Overview

**Purpose**: Implement business mode (Auto/Manual) for asset assignment workflow  
**Status**: Planning phase  
**Priority**: Critical - Core app functionality

---

## 🎯 Business Mode Logic

### Manual Mode:
- **Admin assigns** vehicles/hotels to employees
- Employees **cannot** select their own assignments
- Admin has full control over assignments
- Employee can only start day if assigned

### Auto Mode:
- **Employees select** their own vehicles/hotels
- Admin can still override assignments
- Employees choose from available assets
- Conflict prevention: Same asset can't be assigned to multiple employees

---

## 📊 Database Changes Required

### Businesses Table (Already exists):
```sql
- mode: 'auto' | 'manual'  ✅ Already in schema
```

### Vehicles Table (Add assignment tracking):
```sql
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS:
  - assigned_employee_id VARCHAR(255) REFERENCES employees(id) ON DELETE SET NULL
  - assigned_driver VARCHAR(255)  -- Denormalized name
  - assignment_status VARCHAR(20) DEFAULT 'available'  -- available, assigned, locked
  - updated_at DATE
```

### Hotels Table (Add pending cans tracking):
```sql
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS:
  - address TEXT  -- NEW: Hotel address
  - assigned_employee_id VARCHAR(255) REFERENCES employees(id) ON DELETE SET NULL
  - assigned_employee_name VARCHAR(255)
  - pending_cans INTEGER DEFAULT 0  -- NEW: Non-returned cans tracking
  - updated_at DATE
```

---

## 🔄 Service Layer Changes

### 1. Business Service (No changes needed - mode already supported)

### 2. Employee Service (Add mode validation):
```typescript
// Check business mode before allowing employee operations
export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  // Get business to check mode
  const business = await getBusinessById(values.businessId);
  
  // Create employee
  const employee = await createInSupabase(values);
  
  // If manual mode, employee needs assignment before starting day
  if (business.mode === 'manual') {
    // Mark employee as awaiting assignment
  }
  
  return employee;
}
```

### 3. Vehicle Service (Add conflict checking):
```typescript
export async function assignEmployeeToVehicle(
  vehicleId: string,
  employeeId: string
): Promise<void> {
  // Check if vehicle is already assigned
  const vehicle = await getVehicleById(vehicleId);
  
  if (vehicle.assignment_status === 'assigned' && 
      vehicle.assigned_employee_id !== employeeId) {
    throw new Error('Vehicle is already assigned to another employee');
  }
  
  // Check business mode
  const employee = await getEmployeeById(employeeId);
  const business = await getBusinessById(employee.businessId);
  
  if (business.mode === 'manual') {
    // Admin assignment - allowed
    await assignVehicle(vehicleId, employeeId);
  } else {
    // Auto mode - employee self-assignment
    if (vehicle.assignment_status === 'locked') {
      throw new Error('Vehicle is locked by admin');
    }
    await assignVehicle(vehicleId, employeeId);
  }
}
```

### 4. Hotel Service (Add pending cans tracking):
```typescript
export async function assignEmployeeToHotel(
  hotelId: string,
  employeeId: string
): Promise<void> {
  // Similar to vehicle logic
}

export async function updateHotelPendingCans(
  hotelId: string,
  returnedCans: number,
  deliveredCans: number
): Promise<void> {
  // Update pending cans: pending = pending + delivered - returned
  const hotel = await getHotelById(hotelId);
  const newPendingCans = hotel.pending_cans + deliveredCans - returnedCans;
  
  await updateHotel(hotelId, {
    pending_cans: Math.max(0, newPendingCans)
  });
}
```

---

## 🎨 UI Changes Required

### 1. Employee Screens:
- Show business mode indicator
- In manual mode: Show "Awaiting Assignment" if not assigned
- In auto mode: Show "Select Vehicle/Hotel" button
- Disable "Start Day" if no assignment in manual mode

### 2. Vehicle Management:
- Show assignment status (Available/Assigned/Locked)
- Show which employee has the vehicle
- Lock toggle for admin (prevents auto-selection)
- Conflict warning if trying to assign already assigned vehicle

### 3. Hotel Management:
- **Add "Address" field** to form
- Show pending cans count
- Show assignment status
- Lock toggle for admin
- Pending cans history

### 4. Assignment Screen:
- Filter by business mode
- Show available assets
- Show employee assignments
- Quick assign/unassign actions
- Conflict indicators

---

## ✅ Implementation Checklist

### Phase 1: Database & Service Layer
- [ ] Update vehicle service with assignment tracking
- [ ] Update hotel service with pending cans tracking
- [ ] Add conflict checking logic
- [ ] Add mode validation in employee service
- [ ] Update business service to expose mode

### Phase 2: Employee Management
- [ ] Update AddEmployeeScreen to show business mode
- [ ] Add validation for manual mode (requires assignment)
- [ ] Update employee list to show assignment status
- [ ] Add "Awaiting Assignment" indicator

### Phase 3: Vehicle Management
- [ ] Update vehicle form (add status field)
- [ ] Add assignment status display
- [ ] Add lock/unlock toggle
- [ ] Add conflict checking in UI
- [ ] Update vehicle list with status

### Phase 4: Hotel Management
- [ ] **Add "address" field** to hotel form
- [ ] Add pending cans tracking
- [ ] Add assignment status display
- [ ] Add lock/unlock toggle
- [ ] Update hotel list with pending cans

### Phase 5: Assignment Management
- [ ] Update assignment screen with mode logic
- [ ] Add filtering by business type
- [ ] Add conflict indicators
- [ ] Add bulk assignment actions
- [ ] Add quick assign/unassign

### Phase 6: Driver/Staff Screens
- [ ] Update StartDay screen with mode logic
- [ ] Show available assets in auto mode
- [ ] Show assigned assets in manual mode
- [ ] Disable start day if no assignment (manual mode)
- [ ] Add asset selection flow

### Phase 7: Testing & Validation
- [ ] Test manual mode assignment flow
- [ ] Test auto mode selection flow
- [ ] Test conflict prevention
- [ ] Test pending cans tracking
- [ ] Test employee login with assignments
- [ ] Test edge cases

---

## 🚀 Next Steps

1. Start with database schema updates
2. Update service layers with mode logic
3. Update UI screens systematically
4. Test each module thoroughly
5. Move to next module

---

**Ready to implement?** Let me know and I'll start with the database and service layer changes.