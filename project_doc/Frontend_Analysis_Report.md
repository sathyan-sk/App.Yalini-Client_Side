# Yalini Mobile App - Frontend Analysis Report
## Three-Module Architecture & Data Flow Analysis

---

## Executive Summary

**App Purpose**: Yalini Mobile is a multi-role business operations management application for managing two business types:
1. **Taxi Service** - Trip-based transportation with driver management
2. **Water Delivery** - Hotel-based water can delivery with staff management

**Technology Stack**:
- Frontend: React Native (Expo SDK 54), TypeScript
- Navigation: React Navigation v7 (Stack + Bottom Tabs)
- State Management: Zustand stores
- Backend Ready: Supabase integration layer prepared

**Architecture Pattern**: Role-Based Access Control (RBAC) with three distinct user modules

---

## 1. Three Core Modules

### Module 1: ADMIN Module
**Role**: Business operations oversight and management
**Access**: Administrative users

**Navigation Structure**:
```
AdminNavigator (Bottom Tabs)
├── Dashboard          → Overview metrics & recent submissions
├── DailyRecords       → Taxi & Water delivery records
├── Finance            → Financial summaries & analytics
├── Employees          → Employee CRUD management
└── Settings
    ├── MyBusiness     → Business configuration
    ├── Vehicles       → Vehicle management (Taxi)
    ├── Hotels         → Hotel management (Water)
    └── AssignAssets   → Employee-Asset assignments
```

**Key Workflows**:
1. **Business Configuration**: Create/manage taxi or water delivery businesses
2. **Employee Management**: Add drivers (taxi) or delivery staff (water)
3. **Asset Management**: 
   - Taxi: Add vehicles, assign to drivers
   - Water: Add hotels, assign to delivery staff
4. **Records Review**: View daily submissions from drivers/staff
5. **Financial Tracking**: Monitor income, expenses, profits across businesses

---

### Module 2: DRIVER Module (Taxi Service)
**Role**: Daily trip recording and expense tracking
**Access**: Employees with `businessType = "taxi"`

**Navigation Structure**:
```
DriverNavigator (Stack)
├── DriverStartDay    → Vehicle assignment check & start day
└── DriverMain (Bottom Tabs)
    ├── DriverHome    → Session overview & stats
    ├── AddTrip       → Record new trip
    ├── AllTrips      → View/manage trips & expenses
    └── Checkout      → End day & submit session
```

**Key Workflows**:
1. **Start Day**: Check vehicle assignment, begin session
2. **Add Trip**: Record trip details (from, to, amount, payment mode)
3. **Add Expense**: Log expenses per trip (fuel, toll, food, other)
4. **Review Trips**: View all trips, edit if needed
5. **Checkout**: Verify all expenses added, submit daily session

**Data Flow**:
```
StartDay → Get vehicle assignment from Supabase
    ↓
AddTrip → Create trip in tripStore
    ↓
AllTrips → View trips, add expenses
    ↓
Checkout → Validate all trips have expenses
    ↓
Submit Session → Send to backend via driverService
    ↓
Success Screen → Session submitted confirmation
```

---

### Module 3: STAFF Module (Water Delivery)
**Role**: Daily hotel delivery tracking
**Access**: Employees with `businessType = "water_delivery"`

**Navigation Structure**:
```
StaffNavigator (Stack)
├── StaffStartDay     → Hotel assignment check & start day
└── StaffMain (Bottom Tabs)
    ├── StaffHome     → Session overview
    ├── AddDelivery   → Record delivery to hotel
    ├── AllDeliveries → View/manage deliveries
    └── StaffCheckout → End day & submit session
```

**Key Workflows**:
1. **Start Day**: Check assigned hotels, begin session
2. **Add Delivery**: Record delivery to specific hotel (cans delivered/returned)
3. **Review Deliveries**: View all deliveries, edit if needed
4. **Checkout**: Submit daily delivery record

**Data Flow**:
```
StartDay → Get hotel assignments from Supabase
    ↓
AddDelivery → Create delivery record
    ↓
AllDeliveries → View deliveries, edit if needed
    ↓
Checkout → Submit daily record
    ↓
Success Screen → Submission confirmed
```

---

## 2. Complete Data Field Inventory

### 2.1 Authentication & User Data

**Auth User** (from authStore):
| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Employee ID (FK to Employee) |
| `email` | string | User email |
| `role` | "ADMIN" \| "DRIVER" \| "STAFF" | User role |
| `status` | string | Auth status |

---

### 2.2 Business Entity

**Purpose**: Root entity for business operations

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `name` | string | Yes | Admin form | Business name |
| `type` | "taxi" \| "water_delivery" | Yes | Admin form | Determines asset type |
| `mode` | "auto" \| "manual" | Yes | Admin form | Assignment mode |
| `status` | "enabled" \| "disabled" | Yes | Admin form | Operational status |
| `location` | string? | No | Admin form | Physical address |
| `employees` | number | Yes | Calculated | Auto-maintained count |
| `createdAt` | string (YYYY-MM-DD) | Yes | Auto-generated | Creation timestamp |

**Backend Requirements**:
- Unique constraint on `name`
- Index on `type` for filtering
- Trigger to maintain `employees` count

---

### 2.3 Employee Entity

**Purpose**: Workers (Drivers/Staff) linked to businesses

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `fullName` | string | Yes | Admin form | Employee name |
| `mobile` | string | Yes | Admin form | Digits only (cleaned) |
| `businessId` | string | Yes | Admin form | FK → Business.id |
| `businessName` | string | Yes | Auto-populated | Denormalized from Business |
| `businessType` | "taxi" \| "water_delivery" | Yes | Auto-populated | Inherited from Business |
| `pin` | string | Yes | Admin form | 4-digit PIN |
| `status` | "enabled" \| "disabled" | Yes | Admin form | Account status |
| `createdAt` | string (YYYY-MM-DD) | Yes | Auto-generated | Creation date |

**Backend Requirements**:
- Unique constraint on `mobile`
- FK constraint: `businessId` → Business.id
- Index on `businessType` for role-based queries
- `businessName` & `businessType` denormalized for performance

---

### 2.4 Vehicle Entity (Taxi Only)

**Purpose**: Taxi vehicles assigned to drivers

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `name` | string | Yes | Admin form | Vehicle model |
| `number` | string | Yes | Admin form | Registration (uppercase) |
| `status` | "enabled" \| "disabled" | Yes | Admin form | Operational status |
| `notes` | string? | No | Admin form | Additional info |
| `assignedDriver` | string? | No | AssignAssets | Driver name (display) |
| `assignedEmployeeId` | string? | No | AssignAssets | FK → Employee.id |
| `createdAt` | string (YYYY-MM-DD) | Yes | Auto-generated | Creation date |
| `updatedAt` | string (YYYY-MM-DD) | Yes | Auto-updated | Last modification |

**Backend Requirements**:
- Unique constraint on `number` (recommended)
- FK constraint: `assignedEmployeeId` → Employee.id (nullable)
- Index on `assignedEmployeeId` for quick lookups
- 1:1 relationship with Employee (for taxi drivers)

---

### 2.5 Hotel Entity (Water Delivery Only)

**Purpose**: Delivery locations for water business

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `name` | string | Yes | Admin form | Hotel/customer name |
| `ratePerCan` | number | Yes | Admin form | Price per can (INR) |
| `status` | "enabled" \| "disabled" | Yes | Admin form | Operational status |
| `location` | string? | No | Admin form | Physical address |
| `assignedEmployeeId` | string? | No | AssignAssets | FK → Employee.id |
| `assignedEmployeeName` | string? | No | AssignAssets | Employee name (display) |
| `createdAt` | string (YYYY-MM-DD) | Yes | Auto-generated | Creation date |

**Backend Requirements**:
- FK constraint: `assignedEmployeeId` → Employee.id (nullable)
- Index on `assignedEmployeeId` for quick lookups
- N:1 relationship with Employee (one staff → many hotels)

---

### 2.6 Driver Record Entity (Taxi Daily Submission)

**Purpose**: Daily trip submission from taxi driver

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `driverName` | string | Yes | Driver app | Employee fullName |
| `employeeId` | string | Yes | Driver app | FK → Employee.id |
| `vehicleId` | string | Yes | Driver app | FK → Vehicle.id |
| `vehicleName` | string | Yes | Driver app | Denormalized vehicle name |
| `vehicleNumber` | string | Yes | Driver app | Denormalized vehicle number |
| `date` | string (YYYY-MM-DD) | Yes | Driver app | Record date |
| `status` | "submitted" \| "pending" | Yes | Driver app | Submission status |
| `avatarColor` | string | Yes | Auto-generated | UI color code |
| `trips` | number | Yes | Calculated | Count of tripDetails |
| `totalIncome` | number | Yes | Calculated | Sum of trip incomes |
| `totalExpense` | number | Yes | Calculated | Sum of trip expenses + fuel |
| `settledToAdmin` | number | Yes | Driver app | Amount settled |
| `balanceShortage` | number | Yes | Calculated | Income - settled - expense |
| `totalProfit` | number | Yes | Calculated | Income - expense |
| `perKmRate` | number | Yes | Driver app | Rate per km |
| `fuelExpense` | number | Yes | Driver app | Fuel cost |
| `tripDetails` | TripDetail[] | Yes | Driver app | Array of trips |

**Nested: TripDetail**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Trip identifier |
| `tripNumber` | number | Yes | Sequential number |
| `destination` | string | Yes | Trip destination |
| `tripType` | "vendor" \| "private" | Yes | Trip category |
| `paymentMode` | "cash" \| "online" | Yes | Payment method |
| `distance` | number | Yes | Distance in km |
| `income` | number | Yes | Trip fare (INR) |
| `expense` | number | Yes | Trip expense (INR) |
| `profit` | number | Yes | Income - expense |
| `expenseCategories` | object | Yes | Breakdown: fuel, toll, food, other, notes |

**Backend Requirements**:
- Unique constraint: `employeeId + date` (one record per day)
- FK constraints: `employeeId` → Employee.id, `vehicleId` → Vehicle.id
- JSONB column for `tripDetails` array
- Index on `date` and `status` for filtering
- Calculated fields can be computed or stored

---

### 2.7 Water Delivery Record Entity

**Purpose**: Daily delivery submission from water delivery staff

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `deliveryPersonName` | string | Yes | Staff app | Employee fullName |
| `employeeId` | string | Yes | Staff app | FK → Employee.id |
| `date` | string (YYYY-MM-DD) | Yes | Staff app | Record date |
| `status` | "submitted" \| "pending" | Yes | Staff app | Submission status |
| `avatarColor` | string | Yes | Auto-generated | UI color code |
| `totalHotels` | number | Yes | Calculated | Count of hotelDeliveries |
| `totalCans` | number | Yes | Calculated | Sum of all cans |
| `totalDelivered` | number | Yes | Calculated | Sum of delivered cans |
| `totalReturned` | number | Yes | Calculated | Sum of returned cans |
| `totalOutstanding` | number | Yes | Calculated | Sum of outstanding cans |
| `totalIncome` | number | Yes | Calculated | Sum of hotel incomes |
| `totalExpense` | number | Yes | Calculated | Sum of hotel expenses |
| `totalProfit` | number | Yes | Calculated | Income - expense |
| `hotelDeliveries` | HotelDelivery[] | Yes | Staff app | Array of deliveries |

**Nested: HotelDelivery**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Delivery identifier |
| `hotelName` | string | Yes | Hotel name |
| `location` | string | Yes | Hotel address |
| `totalCans` | number | Yes | Cans dispatched |
| `deliveredCans` | number | Yes | Cans delivered |
| `returnedCans` | number | Yes | Cans returned |
| `outstandingCans` | number | Yes | Cans outstanding |
| `income` | number | Yes | Hotel income (INR) |
| `expense` | number | Yes | Hotel expense (INR) |
| `profit` | number | Yes | Income - expense |

**Backend Requirements**:
- Unique constraint: `employeeId + date`
- FK constraint: `employeeId` → Employee.id
- JSONB column for `hotelDeliveries` array
- Index on `date` and `status`
- Calculated fields can be computed or stored

---

### 2.8 Assignment Entity

**Purpose**: Links employees to assets (vehicles/hotels)

| Field | Type | Required | Source | Backend Notes |
|-------|------|----------|--------|---------------|
| `id` | string | Yes | Auto-generated | UUID primary key |
| `employeeId` | string | Yes | AssignAssets | FK → Employee.id |
| `employeeName` | string | Yes | Auto-populated | Denormalized employee name |
| `assetId` | string | Yes | AssignAssets | FK → Vehicle.id or Hotel.id |
| `assetName` | string | Yes | Auto-populated | Denormalized asset name |
| `assetType` | "vehicle" \| "hotel" | Yes | Auto-populated | Asset category |
| `businessId` | string | Yes | Auto-populated | FK → Business.id |
| `businessName` | string | Yes | Auto-populated | Denormalized business name |
| `businessType` | "taxi" \| "water_delivery" | Yes | Auto-populated | Business type |
| `assignedAt` | string (YYYY-MM-DD) | Yes | Auto-generated | Assignment date |

**Backend Requirements**:
- Unique constraint: `employeeId + assetId` (prevent duplicates)
- FK constraints to Employee, Business, and polymorphic asset
- Index on `employeeId` and `assetId`
- Business rules enforced at application layer

---

### 2.9 Session Data (Driver Only)

**Purpose**: Active work session tracking

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sessionId` | string | Yes | Unique session identifier |
| `driverId` | string | Yes | FK → Employee.id |
| `vehicleId` | string | Yes | FK → Vehicle.id |
| `sessionDate` | string | Yes | Date (e.g., "26 Jan 2026") |
| `startTime` | string | Yes | Start time (e.g., "9:30 AM") |
| `endTime` | string | Yes | End time (on submission) |
| `sessionStatus` | "Day Started" \| "Day Ended" \| "Submitted" | Yes | Current status |
| `isActive` | boolean | Yes | Session active flag |

**Backend Requirements**:
- Table: `driver_sessions`
- FK constraints to Employee and Vehicle
- Index on `driverId` and `sessionDate`
- Status transitions tracked

---

### 2.10 Finance & Dashboard Aggregations

**Finance Record** (for Finance screen):
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Record ID |
| `employeeId` | string | FK → Employee |
| `employeeName` | string | Denormalized name |
| `avatarColor` | string | UI color |
| `businessId` | string | FK → Business |
| `businessName` | string | Denormalized name |
| `businessType` | string | "taxi" or "water_delivery" |
| `date` | string | Record date |
| `income` | number | Total income |
| `profit` | number | Net profit |
| `expense` | number | Total expense |
| `paymentType` | string | Payment method |
| `assetName` | string | Vehicle/Hotel name |
| `trips` | number? | For taxi (trip count) |
| `totalCans` | number? | For water (can count) |
| `totalHotels` | number? | For water (hotel count) |

**Dashboard Stats**:
| Field | Type | Calculation |
|-------|------|-------------|
| `activeEmployees` | number | Count(employees WHERE status="enabled") |
| `submittedToday` | number | Count(records WHERE status="submitted" AND date=today) |
| `pendingToday` | number | Count(records WHERE status="pending" AND date=today) |
| `businesses` | number | Count(businesses WHERE status="enabled") |

**Business Overview**:
| Field | Type | Calculation |
|-------|------|-------------|
| `id` | string | Business ID |
| `name` | string | Business name |
| `category` | string | "Taxi" or "Delivery" |
| `metrics[]` | array | Income, Expense, Profit for selected date |

---

## 3. Data Flow Diagrams

### 3.1 Driver Module Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    DRIVER MODULE WORKFLOW                    │
└─────────────────────────────────────────────────────────────┘

1. START DAY
   ├─► Driver opens app
   ├─► getStartDayData(employeeId) called
   ├─► Fetches: DriverInfo + DriverAssignment
   │   ├─► employeeId → Employee record
   │   ├─► vehicleId → Vehicle record
   │   └─► Check assignment exists
   └─► If assigned → Navigate to DriverMain

2. ADD TRIP
   ├─► Driver fills form: from, to, amount, paymentMode, tripType
   ├─► Validation: non-empty fields, amount > 0
   ├─► addTrip() → tripStore
   │   ├─► Generate trip ID
   │   ├─► Set date/time
   │   ├─► hasExpense = false
   │   └─► Recalculate totals
   └─► Trip added to trips[]

3. ADD EXPENSE
   ├─► Select trip from AllTrips
   ├─► Enter expenses: fuel, toll, food, other, notes
   ├─► addExpense(tripId, expense)
   │   ├─► Calculate total = fuel + toll + food + other
   │   ├─► Set hasExpense = true
   │   ├─► Set totalExpense = total
   │   └─► Recalculate session totals
   └─► Expense linked to trip

4. CHECKOUT / SUBMIT
   ├─► Validate: all trips have expenses
   ├─► submitSession() → driverService
   │   ├─► Prepare SessionSubmissionData
   │   │   ├─► sessionId, driverId, vehicleId
   │   │   ├─► sessionDate, startTime, endTime
   │   │   ├─► totals: trips, income, expenses, net
   │   │   └─► trips[] with expenses
   │   └─► POST to backend
   ├─► On success:
   │   ├─► Create DriverRecord in backend
   │   ├─► Update session status to "Submitted"
   │   └─► Navigate to Success screen
   └─► On failure: Show error, allow retry

5. DATA PERSISTED
   └─► Backend creates:
       ├─► driver_records entry
       ├─► trip_details (JSONB)
       └─► Updates dashboard aggregations
```

---

### 3.2 Staff Module Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    STAFF MODULE WORKFLOW                     │
└─────────────────────────────────────────────────────────────┘

1. START DAY
   ├─► Staff opens app
   ├─► getStaffHomeData(employeeId) called
   ├─► Fetches: StaffInfo + AssignedHotels[]
   │   ├─► employeeId → Employee record
   │   └─► assignedEmployeeId → Hotels[]
   └─► If hotels assigned → Navigate to StaffMain

2. ADD DELIVERY
   ├─► Staff selects hotel
   ├─► Enter delivery details:
   │   ├─► hotelId
   │   ├─► totalCans (dispatched)
   │   ├─► deliveredCans
   │   ├─► returnedCans
   │   ├─► outstandingCans (auto: total - delivered)
   │   ├─► income (ratePerCan × delivered)
   │   └─► expense
   ├─► Validation: delivered + returned = total
   └─► Delivery added to session

3. CHECKOUT / SUBMIT
   ├─► Review all deliveries
   ├─► submitDeliverySession() → deliveryService
   │   ├─► Prepare WaterDeliveryRecord
   │   │   ├─► employeeId, date
   │   │   ├─► Calculate totals from hotelDeliveries[]
   │   │   └─► hotelDeliveries[] with all details
   │   └─► POST to backend
   ├─► On success:
   │   ├─► Create WaterDeliveryRecord
   │   ├─► Update session status
   │   └─► Navigate to Success screen
   └─► On failure: Show error

4. DATA PERSISTED
   └─► Backend creates:
       ├─► water_delivery_records entry
       ├─► hotel_deliveries (JSONB)
       └─► Updates dashboard aggregations
```

---

### 3.3 Admin Module Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                   ADMIN MODULE WORKFLOW                      │
└─────────────────────────────────────────────────────────────┘

1. BUSINESS MANAGEMENT
   ├─► Create Business
   │   ├─► Input: name, type, mode, status
   │   ├─► Generate: id, employees=0, createdAt
   │   └─► Store in businesses[]
   ├─► Edit Business
   │   ├─► Update fields
   │   └─► Propagate to: Employees, Records, Dashboard
   └─► Delete Business
       ├─► Check: no active employees
       └─► Cascade or block deletion

2. EMPLOYEE MANAGEMENT
   ├─► Create Employee
   │   ├─► Input: fullName, mobile, businessId, pin, status
   │   ├─► Clean: trim name, digits-only mobile
   │   ├─► Lookup: businessName, businessType from Business
   │   ├─► Generate: id, createdAt
   │   ├─► Side effect: Business.employees++
   │   └─► Store in employees[]
   ├─► Edit Employee
   │   ├─► Update fields (businessId immutable)
   │   └─► Propagate name changes to: Vehicles, Hotels, Records
   └─► Delete Employee
       ├─► Unassign from Vehicles
       ├─► Unassign from Hotels
       ├─► Side effect: Business.employees--
       └─► Remove from employees[]

3. ASSET MANAGEMENT
   ├─► Create Vehicle/Hotel
   │   ├─► Input: name, number/ratePerCan, status
   │   ├─► Generate: id, createdAt
   │   └─► Store in vehicles[] or hotels[]
   ├─► Assign Asset
   │   ├─► Select: employeeId, assetId
   │   ├─► Validate: businessType matches assetType
   │   ├─► Update: asset.assignedEmployeeId, assignedDriver/Name
   │   └─► Create Assignment record
   └─► Unassign Asset
       ├─► Clear: assignedEmployeeId, assignedDriver/Name
       └─► Delete Assignment record

4. RECORDS REVIEW
   ├─► Select: business, date, status filter
   ├─► Fetch: driverRecords[] or waterRecords[]
   ├─► Display: summary cards with totals
   └─► Drill-down: view trip/hotel details

5. DASHBOARD
   ├─► Select date
   ├─► Aggregate:
   │   ├─► Count active employees
   │   ├─► Count submitted/pending records
   │   ├─► Sum income/expense/profit by business
   │   └─► Fetch recent submissions
   └─► Display: stats, business cards, submission timeline
```

---

## 4. Backend Database Schema Recommendations

### 4.1 Core Tables

```sql
-- Businesses
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('taxi', 'water_delivery')),
    mode VARCHAR(50) NOT NULL CHECK (mode IN ('auto', 'manual')),
    status VARCHAR(50) NOT NULL DEFAULT 'enabled',
    location TEXT,
    employees INTEGER NOT NULL DEFAULT 0,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(name)
);

-- Employees
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL UNIQUE,
    business_id UUID NOT NULL REFERENCES businesses(id),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    pin VARCHAR(4) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'enabled',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    CHECK (pin ~ '^\d{4}$')
);

-- Vehicles (Taxi)
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'enabled',
    notes TEXT,
    assigned_employee_id UUID REFERENCES employees(id),
    assigned_driver VARCHAR(255),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Hotels (Water Delivery)
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    rate_per_can INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'enabled',
    location TEXT,
    assigned_employee_id UUID REFERENCES employees(id),
    assigned_employee_name VARCHAR(255),
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Driver Sessions
CREATE TABLE driver_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) NOT NULL UNIQUE,
    driver_id UUID NOT NULL REFERENCES employees(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    session_date VARCHAR(50) NOT NULL,
    start_time VARCHAR(50) NOT NULL,
    end_time VARCHAR(50),
    session_status VARCHAR(50) NOT NULL DEFAULT 'Day Started',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Driver Records (Daily Taxi Submissions)
CREATE TABLE driver_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_name VARCHAR(255) NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    vehicle_name VARCHAR(255) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    avatar_color VARCHAR(50) NOT NULL,
    trips INTEGER NOT NULL DEFAULT 0,
    total_income DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_expense DECIMAL(10,2) NOT NULL DEFAULT 0,
    settled_to_admin DECIMAL(10,2) NOT NULL DEFAULT 0,
    balance_shortage DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
    per_km_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    fuel_expense DECIMAL(10,2) NOT NULL DEFAULT 0,
    trip_details JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Water Delivery Records
CREATE TABLE water_delivery_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    delivery_person_name VARCHAR(255) NOT NULL,
    employee_id UUID NOT NULL REFERENCES employees(id),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    avatar_color VARCHAR(50) NOT NULL,
    total_hotels INTEGER NOT NULL DEFAULT 0,
    total_cans INTEGER NOT NULL DEFAULT 0,
    total_delivered INTEGER NOT NULL DEFAULT 0,
    total_returned INTEGER NOT NULL DEFAULT 0,
    total_outstanding INTEGER NOT NULL DEFAULT 0,
    total_income DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_expense DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_profit DECIMAL(10,2) NOT NULL DEFAULT 0,
    hotel_deliveries JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id),
    employee_name VARCHAR(255) NOT NULL,
    asset_id UUID NOT NULL,
    asset_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL CHECK (asset_type IN ('vehicle', 'hotel')),
    business_id UUID NOT NULL REFERENCES businesses(id),
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(employee_id, asset_id)
);
```

### 4.2 Indexes for Performance

```sql
-- Employee lookups
CREATE INDEX idx_employees_business ON employees(business_id);
CREATE INDEX idx_employees_type ON employees(business_type);
CREATE INDEX idx_employees_status ON employees(status);

-- Vehicle assignments
CREATE INDEX idx_vehicles_assigned_emp ON vehicles(assigned_employee_id);

-- Hotel assignments
CREATE INDEX idx_hotels_assigned_emp ON hotels(assigned_employee_id);

-- Record filtering
CREATE INDEX idx_driver_records_date ON driver_records(date);
CREATE INDEX idx_driver_records_status ON driver_records(status);
CREATE INDEX idx_driver_records_emp_date ON driver_records(employee_id, date);

CREATE INDEX idx_water_records_date ON water_delivery_records(date);
CREATE INDEX idx_water_records_status ON water_delivery_records(status);
CREATE INDEX idx_water_records_emp_date ON water_delivery_records(employee_id, date);

-- Assignment lookups
CREATE INDEX idx_assignments_employee ON assignments(employee_id);
CREATE INDEX idx_assignments_asset ON assignments(asset_id);
```

---

## 5. API Endpoint Recommendations

### 5.1 Driver Module Endpoints

```
POST   /api/driver/start-day
       Body: { employeeId }
       Returns: { driver, assignment, session }

POST   /api/driver/trips
       Body: { sessionId, tripType, from, to, amount, paymentMode }
       Returns: { tripId }

PUT    /api/driver/trips/:tripId/expense
       Body: { fuel, toll, food, other, notes }
       Returns: { success }

GET    /api/driver/trips
       Params: { sessionId }
       Returns: { trips[], totals }

POST   /api/driver/session/submit
       Body: { sessionId, trips[], totals }
       Returns: { submissionId, success }

GET    /api/driver/session/status
       Params: { employeeId }
       Returns: { sessionStatus, canStartNew }
```

### 5.2 Staff Module Endpoints

```
POST   /api/staff/start-day
       Body: { employeeId }
       Returns: { staff, assignedHotels[], session }

POST   /api/staff/deliveries
       Body: { sessionId, hotelId, totalCans, deliveredCans, returnedCans, income, expense }
       Returns: { deliveryId }

GET    /api/staff/deliveries
       Params: { sessionId }
       Returns: { deliveries[], totals }

POST   /api/staff/session/submit
       Body: { sessionId, deliveries[], totals }
       Returns: { submissionId, success }
```

### 5.3 Admin Module Endpoints

```
# Business
GET    /api/admin/businesses
POST   /api/admin/businesses
PUT    /api/admin/businesses/:id
DELETE /api/admin/businesses/:id

# Employees
GET    /api/admin/employees
POST   /api/admin/employees
PUT    /api/admin/employees/:id
DELETE /api/admin/employees/:id

# Vehicles
GET    /api/admin/vehicles
POST   /api/admin/vehicles
PUT    /api/admin/vehicles/:id
POST   /api/admin/vehicles/:id/assign
POST   /api/admin/vehicles/:id/unassign

# Hotels
GET    /api/admin/hotels
POST   /api/admin/hotels
PUT    /api/admin/hotels/:id
POST   /api/admin/hotels/:id/assign
POST   /api/admin/hotels/:id/unassign

# Records
GET    /api/admin/records/driver
       Params: { businessId, date, status }
GET    /api/admin/records/water
       Params: { businessId, date, status }
GET    /api/admin/records/driver/:id
GET    /api/admin/records/water/:id

# Dashboard
GET    /api/admin/dashboard
       Params: { date }
       Returns: { stats, businesses, submissions }

# Finance
GET    /api/admin/finance
       Params: { mode, month/fromDate/toDate, businessId }
       Returns: { summary, records[], pagination }
```

---

## 6. State Management Analysis

### 6.1 Zustand Stores

**authStore**:
- `user`: AuthUser | null
- `status`: "booting" | "authenticated" | "unauthenticated"
- `bootstrap()`: Restore session from storage
- `login()`, `logout()`: Auth actions

**tripStore** (Driver):
- `session`: SessionInfo
- `trips`: TripWithExpense[]
- `totalTrips`, `totalIncome`, `totalExpenses`, `netAmount`: Computed
- `addTrip()`, `updateTrip()`, `deleteTrip()`: Trip CRUD
- `addExpense()`, `updateExpense()`: Expense management
- `submitSession()`: Submit to backend
- `resetStore()`: Clear for new day

**deliveryStore** (Staff):
- Similar structure for water deliveries
- Manages hotel deliveries instead of trips

### 6.2 Data Flow Pattern

```
UI Component
    ↓ (useStore)
Zustand Store (State)
    ↓ (action)
Service Layer (business logic)
    ↓ (API call)
Backend API
    ↓ (response)
Store Update
    ↓ (re-render)
UI Component
```

---

## 7. Critical Business Rules Summary

### 7.1 Validation Rules

| Entity | Rule | Enforcement |
|--------|------|-------------|
| Business | Name required, non-empty | Form validation |
| Business | Type: taxi or water_delivery | Form validation |
| Employee | Mobile: digits only | Service sanitization |
| Employee | PIN: exactly 4 digits | Form validation |
| Vehicle | Number: uppercase | Service transformation |
| Hotel | ratePerCan: positive integer | Form validation |
| Trip | Amount > 0 | Form validation |
| Delivery | delivered + returned = total | Form validation |
| Driver Record | One per employee per day | Backend unique constraint |
| Water Record | One per employee per day | Backend unique constraint |

### 7.2 Assignment Rules

| Rule | Description |
|------|-------------|
| Type Matching | Taxi employees → Vehicles, Water employees → Hotels |
| 1:1 Vehicles | One vehicle assigned to one driver at a time |
| N:1 Hotels | Multiple hotels can be assigned to one staff |
| Status Check | Only enabled employees/assets can be assigned |
| Auto-population | Assignment denormalizes names for display |

### 7.3 Submission Rules

| Rule | Description |
|------|-------------|
| All Expenses Required | Driver must add expenses to all trips before submit |
| Future Date Prevention | Cannot submit records for future dates |
| Session Uniqueness | One active session per employee at a time |
| Status Transition | Day Started → Day Ended → Submitted |

---

## 8. Backend Migration Checklist

### 8.1 Data Migration

- [ ] Migrate mock data stores to database tables
- [ ] Create all core entities (Business, Employee, Vehicle, Hotel)
- [ ] Set up foreign key constraints
- [ ] Create unique constraints (employee+date for records)
- [ ] Add indexes for query performance

### 8.2 API Development

- [ ] Implement REST endpoints for all CRUD operations
- [ ] Add authentication middleware (JWT/Session)
- [ ] Implement role-based access control
- [ ] Add input validation and sanitization
- [ ] Implement business rule enforcement

### 8.3 Service Layer Updates

- [ ] Replace mock service calls with real API calls
- [ ] Add error handling and retry logic
- [ ] Implement offline queue (if needed)
- [ ] Add loading and error states
- [ ] Implement data caching strategy

### 8.4 Real-time Features (Optional)

- [ ] Dashboard real-time updates via WebSocket
- [ ] Live submission notifications
- [ ] Assignment change notifications

---

## 9. Key Insights for Backend Development

### 9.1 Data Relationships

```
Business (1) ──< (N) Employee (1) ──< (N) Records
                    │
                    ├── (1:1) Vehicle ──< Driver Record
                    │
                    └── (N:1) Hotel ──< Water Record

Employee (1) ──< (N) Assignments (N) >── (1) Asset
```

### 9.2 Calculated Fields

Many fields are calculated from other fields. Backend can either:
1. **Store calculated fields**: Faster reads, need triggers to maintain
2. **Calculate on query**: Slower reads, always accurate
3. **Hybrid approach**: Store frequently accessed, calculate others

**Recommended**: Store critical aggregations, calculate detailed breakdowns on query.

### 9.3 Denormalization Strategy

The frontend uses denormalized fields extensively:
- `businessName` in Employee (instead of join)
- `vehicleName/number` in DriverRecord
- `assignedDriver` in Vehicle
- `employeeName` in Assignment

**Backend Approach**: 
- Keep normalized schema
- Use views or materialized views for common queries
- Let frontend denormalize as needed for display

### 9.4 JSONB Usage

Both `driver_records.trip_details` and `water_delivery_records.hotel_deliveries` use JSONB:
- **Pros**: Flexible schema, easy to query nested data
- **Cons**: Harder to enforce constraints, larger storage
- **Alternative**: Normalized child tables if query patterns are predictable

**Recommendation**: Start with JSONB for flexibility, migrate to normalized tables if query patterns stabilize.

---

## 10. Module Comparison Matrix

| Feature | Admin | Driver | Staff |
|---------|-------|--------|-------|
| **Primary Role** | Management | Trip recording | Delivery tracking |
| **Business Type** | Both | Taxi only | Water only |
| **Authentication** | Admin login | Employee PIN | Employee PIN |
| **Data Creation** | Yes (Business, Employee, Asset) | Yes (Trips, Expenses) | Yes (Deliveries) |
| **Data Submission** | No | Yes (Daily session) | Yes (Daily record) |
| **Records View** | All records | Own records only | Own records only |
| **Asset Assignment** | Yes | No (view only) | No (view only) |
| **Financial View** | Yes (all) | No | No |
| **Session Management** | No | Yes | Yes |
| **Real-time Updates** | Dashboard | Trip list | Delivery list |

---

## Conclusion

The Yalini Mobile app is a well-architected role-based business management system with clear separation of concerns across three modules. The frontend is production-ready with:

- **80+ data fields** across 8 core entities
- **Clear data flow** from UI → Store → Service → Backend
- **Comprehensive business rules** enforced at multiple layers
- **Flexible schema** using JSONB for variable-length data
- **Denormalized fields** for performance optimization

The backend should focus on:
1. Implementing the core relational schema with proper constraints
2. Providing RESTful APIs for all CRUD operations
3. Enforcing business rules at the database and API layers
4. Supporting the calculated fields either via triggers or computed columns
5. Ensuring data integrity with foreign keys and unique constraints

The existing service layer abstraction makes backend migration straightforward - simply replace mock implementations with real API calls.

---

**Document Version**: 1.0  
**Analysis Date**: 2026-01-26  
**Analyst**: AI Assistant  
**Repository**: https://github.com/sathyan-sk/App.Yalini-Client_Side.git