# Pending Submission Tracking - Implementation Plan
## Track Active Sessions & Pending Records for Admin View

**Analysis Date**: 2026-06-30  
**Purpose**: Implement pending submission tracking so admin can see who has started their day but not yet submitted

---

## Current State Analysis

### What Exists:
1. ✅ Records screen has "Submitted" and "Pending" tabs
2. ✅ Date picker filters records by date
3. ✅ DriverCard and DeliveryPersonCard components exist
4. ✅ Status badge shows "submitted" or "pending"
5. ✅ Database has `status` field in both `driver_records` and `water_delivery_records`

### What's Missing:
1. ❌ No automatic "pending" record creation when driver/staff starts day
2. ❌ Dashboard calculations only count "submitted" records
3. ❌ No real-time status updates in SessionInfoCard
4. ❌ Pending records not showing in records screen

---

## Implementation Plan

### Phase 1: Create Pending Records on Start Day

**Driver Start Day Flow:**
```
Driver clicks "Start Day"
   ↓
Create pending driver_record:
   - status: "pending"
   - driver_name: from employee data
   - employee_id: from auth
   - vehicle_id: assigned vehicle
   - vehicle_name: from assignment
   - vehicle_number: from assignment
   - date: today
   - trips: 0
   - total_income: 0
   - total_expense: 0
   - total_profit: 0
   ↓
Driver can now record trips
   ↓
Driver clicks "Submit"
   ↓
Update record: status = "submitted"
   - Fill in actual trip data
   - Calculate totals
```

**Staff Start Day Flow:**
```
Staff clicks "Start Day"
   ↓
Create pending water_delivery_record:
   - status: "pending"
   - delivery_person_name: from employee data
   - employee_id: from auth
   - date: today
   - total_hotels: 0
   - total_cans: 0
   - total_delivered: 0
   - total_income: 0
   - total_expense: 0
   - total_profit: 0
   ↓
Staff can now record deliveries
   ↓
Staff clicks "Submit"
   ↓
Update record: status = "submitted"
   - Fill in actual delivery data
   - Calculate totals
   - Update hotel outstanding cans
```

### Phase 2: Update Dashboard Calculations

**Current Issue:**
Dashboard only counts "submitted" records in stats.

**Fix:**
```typescript
// Dashboard stats should count ALL records for the date
const stats = {
  activeEmployees: count of employees who started day (have pending or submitted records),
  submittedToday: count of records with status = "submitted",
  pendingToday: count of records with status = "pending",
  businesses: count of active businesses
};
```

### Phase 3: Real-time Status Updates

**SessionInfoCard Updates:**
```
Status: "Not Started" → "In Progress" → "Submitted"
Color: Gray → Orange → Green
Icon: Circle → Clock → CheckCircle
```

### Phase 4: Records Screen Pending Tab

**Already Exists - Just Needs Data:**
- Tab switcher has "Pending" tab
- Filter logic exists: `record.status === "pending"`
- Just need to ensure pending records are created

---

## Files to Modify

### 1. Driver Module - Start Day Screen
**File:** `src/screens/driverScreens/StartDay/StartDayScreen.tsx`

**Add:**
```typescript
const handleStartDay = async () => {
  try {
    // Create pending record
    await createPendingDriverRecord({
      employeeId: authUser?.userId,
      driverName: driverData?.driver.name,
      vehicleId: assignedVehicle.id,
      vehicleName: assignedVehicle.name,
      vehicleNumber: assignedVehicle.number,
    });
    
    // Navigate to main screen
    navigation.replace('DriverMain');
  } catch (error) {
    console.error('Failed to start day:', error);
  }
};
```

### 2. Staff Module - Start Day Screen
**File:** `src/screens/staffScreens/StartDay/StaffStartDayScreen.tsx`

**Add:**
```typescript
const handleStartDay = async () => {
  try {
    // Create pending record
    await createPendingWaterRecord({
      employeeId: authUser?.userId,
      staffName: staffData?.staff.name,
    });
    
    // Navigate to main screen
    navigation.replace('StaffMain');
  } catch (error) {
    console.error('Failed to start day:', error);
  }
};
```

### 3. Driver Module - Checkout Screen
**File:** `src/screens/driverScreens/Checkout/CheckoutScreen.tsx`

**Update:**
```typescript
const handleSubmitSession = async () => {
  // ... existing validation ...
  
  const result = await submitDriverSession({
    ...sessionData,
    status: 'submitted', // Change from pending to submitted
  });
  
  if (result.success) {
    // Update local record status
    await updateDriverRecordStatus(sessionId, 'submitted');
  }
};
```

### 4. Staff Module - Checkout Screen
**File:** `src/screens/staffScreens/Checkout/StaffCheckoutScreen.tsx`

**Update:**
```typescript
const handleSubmitSession = async () => {
  // ... existing validation ...
  
  const result = await submitStaffSession({
    ...sessionData,
    status: 'submitted', // Change from pending to submitted
  });
  
  if (result.success) {
    // Update local record status
    await updateWaterRecordStatus(sessionId, 'submitted');
  }
};
```

### 5. Dashboard Calculations
**File:** `src/hooks/useDashboard.ts`

**Update stats calculation:**
```typescript
const stats = {
  activeEmployees: pendingCount + submittedCount, // All active today
  submittedToday: submittedCount,
  pendingToday: pendingCount,
  businesses: businesses.length
};
```

### 6. Service Layer - Add Pending Record Creation
**File:** `src/services/driverService.supabase.ts`

**Add function:**
```typescript
export async function createPendingDriverRecord(data: {
  employeeId: string;
  driverName: string;
  vehicleId: string;
  vehicleName: string;
  vehicleNumber: string;
}): Promise<void> {
  const { error } = await supabase
    .from('driver_records')
    .insert({
      driver_name: data.driverName,
      employee_id: data.employeeId,
      vehicle_id: data.vehicleId,
      vehicle_name: data.vehicleName,
      vehicle_number: data.vehicleNumber,
      date: getTodayDate(),
      status: 'pending',
      avatar_color: getRandomAvatarColor(),
      trips: 0,
      total_income: 0,
      total_expense: 0,
      total_profit: 0,
    });
  
  if (error) throw error;
}
```

**File:** `src/services/deliveryService.supabase.ts`

**Add function:**
```typescript
export async function createPendingWaterRecord(data: {
  employeeId: string;
  staffName: string;
}): Promise<void> {
  const { error } = await supabase
    .from('water_delivery_records')
    .insert({
      delivery_person_name: data.staffName,
      employee_id: data.employeeId,
      date: getTodayDate(),
      status: 'pending',
      avatar_color: getRandomAvatarColor(),
      total_hotels: 0,
      total_cans: 0,
      total_delivered: 0,
      total_returned: 0,
      total_outstanding: 0,
      total_income: 0,
      total_expense: 0,
      total_profit: 0,
    });
  
  if (error) throw error;
}
```

---

## Status Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRIVER/STAFF SESSION STATUS                  │
└─────────────────────────────────────────────────────────────────┘

Not Started
   │
   │ [Start Day clicked]
   ▼
Pending (Yellow/Orange badge)
   │
   │ - Record created in database
   │ - Visible in Admin Records → Pending tab
   │ - Dashboard shows in "Pending Today" count
   │ - Driver/Staff can record trips/deliveries
   │
   │ [Submit clicked]
   ▼
Submitted (Green badge)
   │
   │ - Record updated in database
   │ - Moves to Admin Records → Submitted tab
   │ - Dashboard shows in "Submitted Today" count
   │ - Visible in Recent Submissions
```

---

## UI Changes Required

### 1. SessionInfoCard Status Display

**Current:**
```
┌─────────────────────────────┐
│ Session Status: ACTIVE      │
└─────────────────────────────┘
```

**New:**
```
┌─────────────────────────────┐
│ ● In Progress    [Clock]    │ ← Orange for pending
│ ● Submitted      [Check]    │ ← Green for submitted
└─────────────────────────────┘
```

### 2. Records Screen Pending Tab

**Already exists, just needs data:**
```
[Submitted (5)] [Pending (2)] ← Tab switcher
─────────────────────────────────────
Pending Records:
┌─────────────────────────────────────┐
│ [Avatar] John Doe                   │
│           Toyota Innova - TN01AB123 │
│           [Pending] ← Orange badge │
│                                     │
│ Trips: 0 | Income: ₹0 | Expense: ₹0│
└─────────────────────────────────────┘
```

### 3. Dashboard Stats

**Current:**
```
[Active Employees: 10]
[Submitted Today: 5]
[Pending Today: 0]  ← Always 0
[Businesses: 3]
```

**New:**
```
[Active Employees: 12] ← Includes pending
[Submitted Today: 5]
[Pending Today: 2]     ← Shows active sessions
[Businesses: 3]
```

---

## Database Changes

### No Schema Changes Needed!

The `status` field already exists in both tables:
- `driver_records.status`: 'submitted' | 'pending'
- `water_delivery_records.status`: 'submitted' | 'pending'

Just need to use it properly.

---

## Testing Checklist

### Driver Flow:
- [ ] Driver starts day → Pending record created
- [ ] Admin sees pending record in Records → Pending tab
- [ ] Dashboard shows pending count
- [ ] Driver adds trips → Pending record updates
- [ ] Driver submits → Status changes to "submitted"
- [ ] Admin sees record in Submitted tab
- [ ] Dashboard updates counts

### Staff Flow:
- [ ] Staff starts day → Pending record created
- [ ] Admin sees pending record in Records → Pending tab
- [ ] Dashboard shows pending count
- [ ] Staff adds deliveries → Pending record updates
- [ ] Staff submits → Status changes to "submitted"
- [ ] Admin sees record in Submitted tab
- [ ] Dashboard updates counts

### Date Filter:
- [ ] Select today → See pending and submitted
- [ ] Select yesterday → See only submitted (no pending from today)
- [ ] Select future date → No records

---

## Implementation Order

1. **Create pending record functions** in service layer
2. **Update StartDay screens** to create pending records
3. **Update Checkout screens** to update status to submitted
4. **Update Dashboard** to count pending records
5. **Test end-to-end flow**
6. **Update SessionInfoCard** to show real-time status

---

**Estimated Time:** 2-3 hours  
**Priority:** High (required for v4)  
**Risk:** Low (uses existing status field)