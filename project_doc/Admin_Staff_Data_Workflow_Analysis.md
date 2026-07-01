# Admin & Staff Module - Data Field Workflow Analysis
## Complete Data Flow from Admin Creation to Staff Usage

**Analysis Date**: 2026-06-30  
**Purpose**: Understand data field mappings and workflows between Admin and Staff modules  
**Modules Covered**: Admin (MyBusiness, Employees, Hotels) → Staff (StartDay, AddDelivery, Checkout)

---

## Table of Contents
1. [Admin Module Data Creation](#admin-module-data-creation)
2. [Staff Module Data Consumption](#staff-module-data-consumption)
3. [Data Field Mappings](#data-field-mappings)
4. [Workflow Diagrams](#workflow-diagrams)
5. [Critical Dependencies](#critical-dependencies)
6. [Data Validation Rules](#data-validation-rules)

---

## 1. Admin Module Data Creation

### 1.1 Business Entity (MyBusiness Screen)

**Screen**: `src/screens/adminScreens/MyBusiness/MyBusinessScreen.tsx`

**Fields Created**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Auto-generated UUID |
| `name` | string | Yes | Business name (e.g., "Yalini Minerals") |
| `type` | enum | Yes | `"taxi"` or `"water_delivery"` |
| `mode` | enum | Yes | `"auto"` (self-assign) or `"manual"` (admin assigns) |
| `status` | enum | Yes | `"enabled"` or `"disabled"` |
| `location` | string | No | Physical address |
| `employees` | number | Yes | Auto-calculated count (default: 0) |
| `created_at` | string | Yes | Auto-generated date |

**Business Type Impact**:
- **Taxi Business**: Creates vehicles, assigns to drivers
- **Water Delivery Business**: Creates hotels, assigns to staff

**Mode Impact**:
- **Auto Mode**: Employees can self-select vehicles/hotels
- **Manual Mode**: Admin must assign vehicles/hotels to employees

---

### 1.2 Employee Entity (AddEmployee Screen)

**Screen**: `src/screens/adminScreens/Employees/AddEmployeeScreen.tsx`

**Fields Created**:
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| `fullName` | string | Yes | Min 2 chars | Employee full name |
| `mobile` | string | Yes | 10 digits only | Mobile number (cleaned) |
| `businessId` | string | Yes | Must exist | FK to Business |
| `businessName` | string | Yes | Auto-populated | Denormalized from Business |
| `businessType` | string | Yes | Auto-populated | `"taxi"` or `"water_delivery"` |
| `pin` | string | Yes | Exactly 4 digits | Login PIN |
| `confirmPin` | string | Yes | Must match pin | PIN confirmation |
| `status` | enum | Yes | - | `"enabled"` or `"disabled"` |
| `role` | string | Yes | Auto-set | `"driver"` or `"staff"` based on businessType |
| `created_at` | string | Yes | Auto-generated | Creation date |

**Auto-Populated Fields** (from Business):
```typescript
// When businessId is selected:
businessName = selectedBusiness.name;
businessType = selectedBusiness.type; // "taxi" or "water_delivery"
role = businessType === "taxi" ? "driver" : "staff";
```

**Data Cleaning**:
```typescript
mobile = values.mobile.replace(/\D/g, ""); // Digits only
fullName = values.fullName.trim(); // Trim whitespace
```

---

### 1.3 Hotel Entity (Water Delivery Only)

**Screen**: `src/screens/adminScreens/Hotels/` (assumed)

**Fields Created**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Auto-generated UUID |
| `name` | string | Yes | Hotel/customer name |
| `ratePerCan` | number | Yes | Price per can (INR) |
| `status` | enum | Yes | `"enabled"` or `"disabled"` |
| `location` | string | No | Physical address |
| `assignedEmployeeId` | string | No | FK to Employee (nullable) |
| `assignedEmployeeName` | string | No | Denormalized employee name |
| `outstandingCans` | number | Yes | Default: 0 |
| `created_at` | string | Yes | Auto-generated |

**Assignment Flow**:
1. Admin creates hotel
2. Admin assigns hotel to staff member (via AssignAssets)
3. System updates `assignedEmployeeId` and `assignedEmployeeName`
4. Staff can see assigned hotels in StartDay screen

---

## 2. Staff Module Data Consumption

### 2.1 StartDay Screen (Staff)

**Screen**: `src/screens/staffScreens/StartDay/StaffStartDayScreen.tsx`

**Data Fetched**:
```typescript
// From getStaffHomeData(employeeId)
{
  staff: {
    id: string; // From employees.id
    name: string; // From employees.full_name
    businessName: string; // From employees.business_name
    businessType: string; // From employees.business_type
    role: string; // From employees.role
    businessMode?: 'auto' | 'manual'; // From businesses.mode
  },
  assignedHotels: Array<{
    hotelId: string; // From hotels.id
    hotelName: string; // From hotels.name
    location: string; // From hotels.location
    outstandingCans?: number; // From hotels.outstanding_cans
  }>,
  availableHotels?: Array<{...}>, // For auto mode
  totalOutstandingCans: number; // Sum of all assigned hotels
  sessionStatus: string; // "OPEN" or "SUBMITTED"
  sessionDate: string; // Formatted date
}
```

**Display Logic**:
```typescript
// Has assignment check
const hasAssignment = staffData?.assignedHotels?.length > 0;

// Business mode check
const businessMode = data?.staff?.businessMode || 'manual';

// Available hotels (auto mode only)
const availableHotels = data?.availableHotels || [];
```

**User Actions**:
1. **Has Assignment + Manual Mode**: Show hotels, enable "Start Day" button
2. **Auto Mode + Available Hotels**: Show hotel selection list
3. **No Assignment + Manual Mode**: Show "No Assignment" card, contact admin

---

### 2.2 AddDelivery Screen (Staff)

**Screen**: `src/screens/staffScreens/AddDelivery/AddDeliveryScreen.tsx`

**Data Flow**:
```
1. Load Session & Hotels
   ├─ getDeliverySession(employeeId)
   └─ loadHotelsForDelivery(employeeId)
       └─ Fetches from staff_hotel_assignments junction table
           └─ Returns assigned hotels with ratePerCan

2. Select Hotel
   ├─ User selects hotel from dropdown
   ├─ Fetch hotel details (getHotelById)
   │   └─ Get previous outstanding cans
   └─ Populate form:
       ├─ hotelId
       ├─ hotelName
       ├─ ratePerCan (from hotels.rate_per_can)
       └─ previousOutstandingCans (from hotels.outstanding_cans)

3. Enter Delivery Details
   ├─ Total Loaded Cans (first delivery only, then locked)
   ├─ Cans Delivered
   ├─ Cans Returned
   ├─ Outstanding Cans (auto-calculated)
   │   └─ previousOutstanding + delivered - returned
   ├─ Est. Amount (auto-calculated)
   │   └─ deliveredCans * ratePerCan
   └─ Income Received

4. Optional: Add Expense
   ├─ Expense Category (fuel, toll, food, other)
   └─ Expense Amount

5. Optional: Add Settlement
   ├─ Settled Cash
   ├─ Settled Online
   └─ Shortage (auto-calculated)
       └─ profit - settledCash - settledOnline

6. Save Delivery
   └─ saveDeliveryRecord(formValues)
       └─ Returns DeliveryRecord with id
           └─ addDelivery(record) to store
```

**Form Fields**:
| Field | Source | Type | Validation |
|-------|--------|------|------------|
| `hotelId` | hotels.id | string | Required |
| `hotelName` | hotels.name | string | Auto-populated |
| `ratePerCan` | hotels.rate_per_can | number | Auto-populated |
| `loadedCans` | User input | number | Required, > 0 (first delivery only) |
| `cansDelivered` | User input | number | Required, > 0, ≤ remaining |
| `cansReturned` | User input | number | ≥ 0, ≤ delivered |
| `outstandingCans` | Calculated | number | previous + delivered - returned |
| `estAmount` | Calculated | number | delivered * ratePerCan |
| `receivedIncome` | User input | number | ≥ 0 |
| `expenseCategory` | User input | enum | Optional |
| `expenseAmount` | User input | number | Required if category selected |
| `settledCash` | User input | number | ≥ 0 |
| `settledOnline` | User input | number | ≥ 0 |
| `shortage` | Calculated | number | profit - settledCash - settledOnline |

**Calculated Fields**:
```typescript
// Outstanding cans
outstandingCans = previousOutstandingCans + cansDelivered - cansReturned;

// Estimated amount
estAmount = cansDelivered * ratePerCan;

// Profit
profit = receivedIncome - expenseAmount;

// Shortage
shortage = Math.max(0, profit - settledCash - settledOnline);

// Remaining cans (if loaded cans locked)
remainingCans = totalLoadedCans - totalDeliveredSoFar - cansDelivered;
```

---

### 2.3 Staff Checkout Screen

**Screen**: `src/screens/staffScreens/Checkout/StaffCheckoutScreen.tsx` (assumed)

**Data Submitted**:
```typescript
// submitStaffSession(data)
{
  staffId: string; // From authStore.user.userId
  staffName: string; // From employees.full_name
  deliveries: DeliveryRecord[]; // All deliveries from store
  totalIncome: number; // Sum of receivedIncome
  totalExpense: number; // Sum of expenseAmount
  profit: number; // totalIncome - totalExpense
  totalSettlement?: number; // Sum of settledCash + settledOnline
}
```

**Backend Creates**:
1. `water_delivery_records` entry
   - Aggregated totals from all deliveries
   - Grouped by hotel
2. `hotel_deliveries` entries
   - One entry per hotel with aggregated data
3. Updates `hotels.outstanding_cans` for each hotel

---

## 3. Data Field Mappings

### 3.1 Admin → Staff Data Flow

```
ADMIN CREATES                    STAFF USES
─────────────────────────────────────────────────────

Business
├─ id ──────────────────────────→ Employee.businessId
├─ name ────────────────────────→ Employee.businessName
└─ type ────────────────────────→ Employee.businessType
                                 → Staff role ("staff")

Employee
├─ id ──────────────────────────→ Session.staffId
├─ full_name ───────────────────→ Session.staffName
├─ business_id ─────────────────→ Fetches business details
├─ business_name ───────────────→ Display in UI
├─ business_type ───────────────→ Determines module access
└─ pin ─────────────────────────→ Authentication

Hotel (via Assignment)
├─ id ──────────────────────────→ Delivery.hotelId
├─ name ────────────────────────→ Delivery.hotelName
├─ rate_per_can ────────────────→ Delivery.ratePerCan
├─ location ────────────────────→ Display in UI
└─ outstanding_cans ────────────→ Delivery.previousOutstandingCans

Assignment (Junction Table)
├─ staff_id ────────────────────→ Filters assigned hotels
└─ hotel_id ────────────────────→ Links to hotel data
```

### 3.2 Field Transformation Matrix

| Admin Field | Database Column | Staff Field | Transformation |
|-------------|----------------|-------------|----------------|
| `businesses.name` | `employees.business_name` | `staff.businessName` | Direct copy |
| `businesses.type` | `employees.business_type` | `staff.businessType` | Direct copy |
| `businesses.mode` | Fetched via join | `staff.businessMode` | Direct copy |
| `employees.full_name` | `water_delivery_records.delivery_person_name` | `session.staffName` | Direct copy |
| `employees.id` | `water_delivery_records.employee_id` | `session.staffId` | Direct copy |
| `hotels.name` | `hotel_deliveries.hotel_name` | `delivery.hotelName` | Direct copy |
| `hotels.rate_per_can` | `hotel_deliveries.rate_per_can` | `delivery.ratePerCan` | Direct copy |
| `hotels.outstanding_cans` | `hotel_deliveries.outstanding_cans` | `delivery.previousOutstandingCans` | Snapshot at delivery time |
| `hotels.location` | `hotel_deliveries.location` | Not used in form | Fetched for display |

---

## 4. Workflow Diagrams

### 4.1 Complete Admin → Staff Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN MODULE                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create Business
   Input: name, type="water_delivery", mode, status
   Output: Business record
   └─→ employees.business_id = Business.id

Step 2: Create Employee
   Input: fullName, mobile, businessId, pin, status
   Auto-populated: businessName, businessType, role="staff"
   Output: Employee record
   └─→ staff can now login with mobile + PIN

Step 3: Create Hotels
   Input: name, ratePerCan, status, location
   Output: Hotel records
   └─→ Available for assignment

Step 4: Assign Hotels to Staff
   Input: employeeId, hotelId
   Creates: Assignment record in staff_hotel_assignments
   Updates: hotels.assigned_employee_id
   └─→ Staff can now see hotels in StartDay screen

┌─────────────────────────────────────────────────────────────────┐
│                        STAFF MODULE                              │
└─────────────────────────────────────────────────────────────────┘

Step 5: Staff Login
   Input: mobile, pin
   Auth: Check employees table
   Output: Auth session with userId
   └─→ Navigate to StaffStartDay

Step 6: Start Day
   Fetch: getStaffHomeData(employeeId)
   ├─→ Employee data (name, business)
   ├─→ Assigned hotels (via staff_hotel_assignments)
   │   └─→ Hotel details (name, ratePerCan, outstandingCans)
   └─→ Business mode (auto/manual)
   
   Display:
   ├─ Manual Mode: Show assigned hotels, enable Start Day
   ├─ Auto Mode: Show available hotels for selection
   └─ No Assignment: Show waiting state

Step 7: Add Deliveries
   For each hotel:
   ├─ Select hotel
   │   └─→ Fetch previous outstanding cans
   ├─ Enter delivery details
   │   ├─ cansDelivered
   │   ├─ cansReturned
   │   ├─ outstandingCans (auto-calc)
   │   ├─ receivedIncome
   │   └─ Optional: expense, settlement
   └─ Save to deliveryStore

Step 8: Checkout & Submit
   Input: All deliveries from store
   Process: submitStaffSession()
   ├─→ Group deliveries by hotel
   ├─→ Calculate totals
   └─→ Create water_delivery_records + hotel_deliveries
   
   Output: Success screen
   └─→ Admin can view in Records screen
```

### 4.2 Data Validation Flow

```
ADMIN INPUT                    VALIDATION                    DATABASE
─────────────────────────────────────────────────────────────────────

Business Name
   ├─ Required
   ├─ Non-empty
   ├─ Unique constraint
   └─→ businesses.name

Business Type
   ├─ Required
   ├─ Must be "taxi" or "water_delivery"
   └─→ businesses.type

Employee Full Name
   ├─ Required
   ├─ Min 2 characters
   ├─ Trimmed
   └─→ employees.full_name

Employee Mobile
   ├─ Required
   ├─ 10 digits only
   ├─ Regex: /\D/g replace
   ├─ Unique constraint
   └─→ employees.mobile

Employee PIN
   ├─ Required
   ├─ Exactly 4 digits
   ├─ Match confirmPin
   └─→ employees.pin (should be hashed!)

Hotel Rate Per Can
   ├─ Required
   ├─ Positive integer
   └─→ hotels.rate_per_can

Delivery Cans Delivered
   ├─ Required
   ├─ > 0
   ├─ ≤ remaining cans (if loaded)
   └─→ hotel_deliveries.delivered_cans

Delivery Outstanding
   ├─ Auto-calculated
   ├─ previous + delivered - returned
   └─→ hotel_deliveries.outstanding_cans
```

---

## 5. Critical Dependencies

### 5.1 Required Data Hierarchy

```
Business (Level 1)
   └─→ Must exist before creating Employees
       └─→ Employees (Level 2)
           └─→ Must exist before assignment
               └─→ Hotels (Level 3)
                   └─→ Must exist before assignment
                       └─→ Assignments (Level 4)
                           └─→ Required for Staff to work
```

**Dependency Rules**:
1. **Business → Employee**: Employee.businessId must reference valid Business
2. **Employee → Assignment**: Assignment.staffId must reference valid Employee
3. **Hotel → Assignment**: Assignment.hotelId must reference valid Hotel
4. **Assignment → Staff Work**: Staff can only deliver to assigned hotels

### 5.2 Business Mode Impact

**Manual Mode**:
```
Admin Action Required:
  1. Create Business (mode="manual")
  2. Create Employee
  3. Create Hotels
  4. Assign Hotels to Employee (via AssignAssets)
  5. Employee can now start day

Staff Experience:
  - Sees only assigned hotels
  - Cannot select additional hotels
  - Must contact admin for changes
```

**Auto Mode**:
```
Admin Action Required:
  1. Create Business (mode="auto")
  2. Create Employee
  3. Create Hotels (no assignment needed)

Staff Experience:
  - Sees all available hotels
  - Can self-select hotels on StartDay
  - Can change selection each day
```

### 5.3 Status Fields Impact

**Business Status**:
- `enabled`: Employees can be created, business appears in lists
- `disabled`: No new employees, business hidden from selection

**Employee Status**:
- `enabled`: Can login, can be assigned assets
- `disabled`: Cannot login, assignments should be removed

**Hotel Status**:
- `enabled`: Available for assignment, appears in lists
- `disabled`: Not available, hidden from selection

---

## 6. Data Validation Rules

### 6.1 Admin Module Validation

**AddEmployeeScreen**:
```typescript
fullName: {
  required: true,
  minLength: 2,
  trim: true
}

mobile: {
  required: true,
  pattern: /^\d{10}$/,
  transform: (value) => value.replace(/\D/g, "")
}

businessId: {
  required: true,
  mustExist: true,
  mustBeEnabled: true
}

pin: {
  required: true,
  length: 4,
  pattern: /^\d{4}$/,
  match: confirmPin
}

status: {
  required: true,
  enum: ["enabled", "disabled"]
}
```

### 6.2 Staff Module Validation

**AddDeliveryScreen**:
```typescript
hotelId: {
  required: true,
  mustBeAssigned: true,
  mustBeEnabled: true
}

loadedCans: {
  required: !isLoadedCansLocked,
  min: 1,
  max: 9999,
  lockAfterFirst: true
}

cansDelivered: {
  required: true,
  min: 1,
  max: remainingCans // if loaded cans locked
}

cansReturned: {
  min: 0,
  max: cansDelivered
}

outstandingCans: {
  calculated: true,
  formula: previousOutstanding + delivered - returned,
  min: 0
}

receivedIncome: {
  required: true,
  min: 0
}

expenseAmount: {
  required: if expenseCategory selected,
  min: 0
}

settledCash: {
  min: 0
}

settledOnline: {
  min: 0
}

shortage: {
  calculated: true,
  formula: Math.max(0, profit - settledCash - settledOnline)
}
```

### 6.3 Database Constraints

**PostgreSQL Constraints**:
```sql
-- Businesses
UNIQUE(name)
CHECK (type IN ('taxi', 'water_delivery'))
CHECK (mode IN ('auto', 'manual'))

-- Employees
UNIQUE(mobile)
CHECK (mobile ~ '^\d{10}$')
CHECK (pin ~ '^\d{4}$')
FK: business_id → businesses(id)

-- Hotels
FK: assigned_employee_id → employees(id) (nullable)

-- Staff Hotel Assignments
UNIQUE(staff_id, hotel_id)
FK: staff_id → employees(id)
FK: hotel_id → hotels(id)

-- Water Delivery Records
UNIQUE(employee_id, date)
FK: employee_id → employees(id)

-- Hotel Deliveries
FK: water_delivery_record_id → water_delivery_records(id)
```

---

## 7. Data Consistency Rules

### 7.1 Denormalized Fields

**Employee Table**:
```typescript
business_name: Denormalized from Business.name
business_type: Denormalized from Business.type
```
**Reason**: Avoid joins on every query, improve read performance

**Water Delivery Records**:
```typescript
delivery_person_name: Denormalized from Employee.full_name
```
**Reason**: Preserve name even if employee is deleted

**Hotel Deliveries**:
```typescript
hotel_name: Denormalized from Hotel.name
location: Denormalized from Hotel.location
rate_per_can: Snapshot from Hotel.rate_per_can at delivery time
```
**Reason**: Preserve historical data, avoid joins

### 7.2 Calculated Fields

**On-the-fly Calculations**:
```typescript
// In Staff module
outstandingCans = previousOutstanding + delivered - returned
estAmount = delivered * ratePerCan
profit = income - expense
shortage = profit - settledCash - settledOnline
remainingCans = totalLoaded - totalDeliveredSoFar
```

**Stored in Database**:
```typescript
// In water_delivery_records
total_hotels: Count of hotel_deliveries
total_cans: Sum of hotel_deliveries.total_cans
total_delivered: Sum of hotel_deliveries.delivered_cans
total_outstanding: Sum of hotel_deliveries.outstanding_cans
total_income: Sum of hotel_deliveries.income
total_expense: Sum of hotel_deliveries.expense
total_profit: Sum of hotel_deliveries.profit
```

**Why Store?**: Faster dashboard queries, avoid recalculating from JSONB

---

## 8. Common Issues & Solutions

### 8.1 Issue: Hotel Not Appearing for Staff

**Possible Causes**:
1. Hotel status = "disabled"
2. No assignment in `staff_hotel_assignments`
3. Assignment `is_active` = false
4. Employee status = "disabled"

**Debug Steps**:
```typescript
// 1. Check employee status
const { data: employee } = await supabase
  .from('employees')
  .select('status')
  .eq('id', employeeId)
  .single();

// 2. Check assignments
const { data: assignments } = await supabase
  .from('staff_hotel_assignments')
  .select('*, hotels(*)')
  .eq('staff_id', employeeId)
  .eq('is_active', true);

// 3. Check hotel status
const hotelEnabled = assignments.every(a => a.hotels.status === 'enabled');
```

### 8.2 Issue: Outstanding Cans Incorrect

**Problem**: Outstanding cans not updating after delivery

**Root Cause**: `hotels.outstanding_cans` not updated after submission

**Solution**:
```typescript
// In submitStaffSession (deliveryService.supabase.ts)
hotelMap.forEach((hotelData, hotelId) => {
  supabase
    .from('hotels')
    .update({ outstanding_cans: hotelData.outstandingCans })
    .eq('id', hotelId);
});
```

### 8.3 Issue: Rate Per Can Not Updating

**Problem**: Staff sees old rate after admin updates

**Root Cause**: Rate cached in delivery form

**Solution**:
```typescript
// Refresh hotels on screen focus
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', async () => {
    const refreshedHotels = await loadHotelsForDelivery(employeeId);
    setHotels(refreshedHotels);
  });
  return unsubscribe;
}, [navigation, employeeId]);
```

---

## 9. Summary

### Key Takeaways:

1. **Admin Creates Foundation**: Business → Employee → Hotels → Assignments
2. **Staff Consumes Data**: Fetches assigned hotels, records deliveries
3. **Data Flows Down**: Business info → Employee → Assignments → Deliveries
4. **Calculated Fields**: Outstanding, profit, shortage calculated in real-time
5. **Denormalization**: Critical fields copied for performance and history
6. **Validation**: Strict at both admin (creation) and staff (delivery) levels
7. **Business Mode**: Determines assignment workflow (auto vs manual)
8. **Status Fields**: Control visibility and access at every level

### Data Integrity Rules:
- ✅ All foreign keys validated
- ✅ Unique constraints on mobile, business name, employee+date
- ✅ Status checks before assignment
- ✅ Outstanding cans never negative
- ✅ Delivered cans cannot exceed loaded cans

---

**Document Version**: 1.0  
**Analysis Date**: 2026-06-30  
**Analyst**: AI Assistant  
**Next Steps**: Review with team, validate against backend schema