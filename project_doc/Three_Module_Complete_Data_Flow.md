# Three-Module Complete Data Flow Analysis
## Admin ↔ Driver ↔ Staff - End-to-End Data Workflow

**Analysis Date**: 2026-06-30  
**Scope**: Complete data flow across all three modules  
**Purpose**: Understand how data created in Admin flows to Driver/Staff and back

---

## Table of Contents
1. [Module Overview](#module-overview)
2. [Admin → Driver Data Flow](#admin--driver-data-flow)
3. [Admin → Staff Data Flow](#admin--staff-data-flow)
4. [Driver → Admin Data Flow](#driver--admin-data-flow)
5. [Staff → Admin Data Flow](#staff--admin-data-flow)
6. [Complete Data Flow Diagrams](#complete-data-flow-diagrams)
7. [Cross-Module Dependencies](#cross-module-dependencies)
8. [Data Transformation Summary](#data-transformation-summary)

---

## 1. Module Overview

### 1.1 Three-Module Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        YALINI MOBILE APP                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │    ADMIN     │    │    DRIVER    │    │    STAFF     │     │
│  │   MODULE     │    │   MODULE     │    │   MODULE     │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│         ↓                    ↓                    ↓             │
│  • Business Mgmt    • Trip Recording    • Delivery Tracking    │
│  • Employee Mgmt    • Expense Mgmt      • Hotel Deliveries     │
│  • Vehicle Mgmt     • Session Submit    • Session Submit       │
│  • Hotel Mgmt       •                   •                       │
│  • Records View     •                   •                       │
│  • Finance          •                   •                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Module Responsibilities

| Module | Creates | Reads | Submits |
|--------|---------|-------|---------|
| **Admin** | Business, Employee, Vehicle, Hotel | All records, Finance | Never submits daily work |
| **Driver** | Trips, Expenses | Own trips only | Daily session (driver_records) |
| **Staff** | Deliveries | Own deliveries only | Daily session (water_delivery_records) |

### 1.3 Business Type Determines Module Access

```
Business Type = "taxi"
   └─→ Creates Employees with role = "driver"
       └─→ Driver module enabled
           └─→ Can record trips, expenses

Business Type = "water_delivery"
   └─→ Creates Employees with role = "staff"
       └─→ Staff module enabled
           └─→ Can record deliveries
```

---

## 2. Admin → Driver Data Flow

### 2.1 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN MODULE                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create Business (Taxi)
   Admin Input:
   ├─ name: "City Taxi Service"
   ├─ type: "taxi"
   ├─ mode: "manual" or "auto"
   └─ status: "enabled"
   
   Database: businesses table
   └─→ id: "biz_123"
   
Step 2: Create Employee (Driver)
   Admin Input:
   ├─ fullName: "John Doe"
   ├─ mobile: "9876543210"
   ├─ businessId: "biz_123" (FK)
   ├─ pin: "1234"
   └─ status: "enabled"
   
   Auto-populated:
   ├─ businessName: "City Taxi Service" (from Business)
   ├─ businessType: "taxi" (from Business)
   └─ role: "driver" (derived from businessType)
   
   Database: employees table
   └─→ id: "emp_456"
   
Step 3: Create Vehicle
   Admin Input:
   ├─ name: "Toyota Innova"
   ├─ number: "TN 01 AB 1234"
   ├─ status: "enabled"
   └─ notes: "AC vehicle"
   
   Database: vehicles table
   └─→ id: "veh_789"
   
Step 4: Assign Vehicle to Driver
   Admin Action:
   ├─ Select employee: "John Doe" (emp_456)
   └─ Select vehicle: "Toyota Innova" (veh_789)
   
   Database Updates:
   ├─ vehicles.assigned_employee_id = "emp_456"
   ├─ vehicles.assigned_driver = "John Doe"
   └─ vehicles.assignment_status = "assigned"
   
   ┌─────────────────────────────────────────────────────────────────┐
   │                        DRIVER MODULE                            │
   └─────────────────────────────────────────────────────────────────┘

Step 5: Driver Login
   Driver Input:
   ├─ mobile: "9876543210"
   └─ pin: "1234"
   
   Auth Check:
   ├─ Query employees WHERE mobile = "9876543210"
   ├─ Verify pin = "1234"
   ├─ Check status = "enabled"
   └─ business_type = "taxi" → role = "DRIVER"
   
   Auth Session Created:
   ├─ userId: "emp_456"
   ├─ role: "DRIVER"
   └─ token: generated
   
Step 6: Start Day
   Fetch: getStartDayData(employeeId)
   
   Queries:
   ├─ employees WHERE id = "emp_456"
   │   └─→ name, businessName, businessType
   ├─ vehicles WHERE assigned_employee_id = "emp_456"
   │   └─→ vehicleId, vehicleName, vehicleNumber
   └─ businesses WHERE id = employee.business_id
       └─→ mode (auto/manual)
   
   Display:
   ├─ Manual Mode: Show assigned vehicle, enable Start Day
   └─ Auto Mode: Show available vehicles for selection
   
Step 7: Record Trips
   Driver Input (per trip):
   ├─ from: "Location A"
   ├─ to: "Location B"
   ├─ amount: 500
   ├─ tripType: "vendor" or "private"
   └─ paymentMode: "cash" or "online"
   
   Stored in: tripStore (Zustand)
   └─→ trips[] array
   
Step 8: Add Expenses
   Driver Input (per trip):
   ├─ fuel: 100
   ├─ toll: 50
   ├─ food: 0
   ├─ other: 0
   ├─ notes: "Toll booth"
   └─ settledCash: 400, settledOnline: 0
   
   Calculated:
   ├─ totalExpense = fuel + toll + food + other
   ├─ profit = income - expense
   └─ shortage = profit - settledCash - settledOnline
   
   Stored in: tripStore (linked to trip)
   
Step 9: Submit Session
   Driver Action: Submit daily session
   
   Process: submitDriverSession()
   ├─ Validate all trips have expenses
   ├─ Calculate totals:
   │   ├─ totalTrips: count
   │   ├─ totalIncome: sum of amounts
   │   ├─ totalExpense: sum of expenses
   │   ├─ totalProfit: income - expense
   │   └─ settledToAdmin: sum of settled amounts
   └─ Create database records:
       ├─ driver_records (parent)
       │   ├─ driver_name: "John Doe"
       │   ├─ employee_id: "emp_456"
       │   ├─ vehicle_id: "veh_789"
       │   ├─ vehicle_name: "Toyota Innova"
       │   ├─ date: "2026-06-30"
       │   ├─ status: "submitted"
       │   ├─ trips: 5
       │   ├─ total_income: 2500
       │   ├─ total_expense: 800
       │   └─ total_profit: 1700
       └─ trip_details (children, JSONB)
           └─→ Array of trip objects with expenses
   
   ┌─────────────────────────────────────────────────────────────────┐
   │                        ADMIN MODULE (READS)                     │
   └─────────────────────────────────────────────────────────────────┘

Step 10: Admin Views Records
   Admin Action: View Daily Records
   
   Query:
   ├─ driver_records WHERE date = "2026-06-30"
   │   └─→ JOIN employees, vehicles
   └─ Display:
       ├─ Driver name, vehicle, date
       ├─ Financial summary (income, expense, profit)
       └─ Trip details (expandable)
```

### 2.2 Driver Data Fields (From Admin)

| Admin Creates | Database Column | Driver Uses | Transformation |
|---------------|----------------|-------------|----------------|
| Business.name | employees.business_name | Display in UI | Direct copy |
| Business.type | employees.business_type | Role assignment | Determines DRIVER role |
| Business.mode | Fetched via join | StartDay behavior | Auto vs manual assignment |
| Employee.full_name | driver_records.driver_name | Session info | Direct copy |
| Employee.id | driver_records.employee_id | FK constraint | Direct reference |
| Vehicle.name | driver_records.vehicle_name | Session info | Direct copy |
| Vehicle.number | driver_records.vehicle_number | Session info | Direct copy |
| Vehicle.id | driver_records.vehicle_id | FK constraint | Direct reference |

### 2.3 Driver Submission Fields (To Admin)

| Driver Input | Database Column | Admin Views | Calculation |
|--------------|----------------|-------------|-------------|
| Trip.amount | trip_details.income | Financial summary | Sum |
| Trip.totalExpense | trip_details.expense | Financial summary | Sum |
| Trip.profit | trip_details.profit | Financial summary | Auto-calc |
| Session totals | driver_records.totals | Dashboard | Aggregated |
| Settled cash/online | driver_records.settled_* | Finance screen | Sum |

---

## 3. Admin → Staff Data Flow

### 3.1 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN MODULE                              │
└─────────────────────────────────────────────────────────────────┘

Step 1: Create Business (Water Delivery)
   Admin Input:
   ├─ name: "Yalini Minerals"
   ├─ type: "water_delivery"
   ├─ mode: "manual" or "auto"
   └─ status: "enabled"
   
   Database: businesses table
   └─→ id: "biz_789"
   
Step 2: Create Employee (Staff)
   Admin Input:
   ├─ fullName: "Jane Smith"
   ├─ mobile: "9876543211"
   ├─ businessId: "biz_789" (FK)
   ├─ pin: "5678"
   └─ status: "enabled"
   
   Auto-populated:
   ├─ businessName: "Yalini Minerals"
   ├─ businessType: "water_delivery"
   └─ role: "staff"
   
   Database: employees table
   └─→ id: "emp_999"
   
Step 3: Create Hotels
   Admin Input (per hotel):
   ├─ name: "Hotel Taj"
   ├─ ratePerCan: 20
   ├─ status: "enabled"
   ├─ location: "123 Main St"
   └─ outstandingCans: 0
   
   Database: hotels table
   └─→ id: "hotel_111"
   
Step 4: Assign Hotels to Staff
   Admin Action:
   ├─ Select employee: "Jane Smith" (emp_999)
   └─ Select hotels: ["Hotel Taj", "Hotel Oberoi"]
   
   Database Operations:
   ├─ Create staff_hotel_assignments:
   │   ├─ staff_id: "emp_999", hotel_id: "hotel_111"
   │   └─ staff_id: "emp_999", hotel_id: "hotel_222"
   ├─ Update hotels.assigned_employee_id = "emp_999"
   └─ Update hotels.assigned_employee_name = "Jane Smith"
   
   ┌─────────────────────────────────────────────────────────────────┐
   │                        STAFF MODULE                             │
   └─────────────────────────────────────────────────────────────────┘

Step 5: Staff Login
   Staff Input:
   ├─ mobile: "9876543211"
   └─ pin: "5678"
   
   Auth Check:
   ├─ Query employees WHERE mobile = "9876543211"
   ├─ Verify pin = "5678"
   ├─ Check status = "enabled"
   └─ business_type = "water_delivery" → role = "STAFF"
   
   Auth Session Created:
   ├─ userId: "emp_999"
   ├─ role: "STAFF"
   └─ token: generated
   
Step 6: Start Day
   Fetch: getStaffHomeData(employeeId)
   
   Queries:
   ├─ employees WHERE id = "emp_999"
   │   └─→ name, businessName, businessType
   ├─ staff_hotel_assignments WHERE staff_id = "emp_999" AND is_active = true
   │   └─→ hotel_ids: ["hotel_111", "hotel_222"]
   ├─ hotels WHERE id IN (hotel_ids) AND status = "enabled"
   │   └─→ hotel details (name, ratePerCan, outstandingCans, location)
   └─ businesses WHERE id = employee.business_id
       └─→ mode (auto/manual)
   
   Display:
   ├─ Manual Mode: Show assigned hotels, enable Start Day
   ├─ Auto Mode: Show all available hotels for selection
   └─ No Assignment: Show waiting state
   
Step 7: Add Deliveries
   Staff Action: Select hotel
   └─→ Fetch hotel details
       ├─ hotelId: "hotel_111"
       ├─ hotelName: "Hotel Taj"
       ├─ ratePerCan: 20
       └─ previousOutstandingCans: 50 (from hotels.outstanding_cans)
   
   Staff Input (per delivery):
   ├─ hotelId: "hotel_111"
   ├─ loadedCans: 100 (first delivery only, then locked)
   ├─ cansDelivered: 30
   ├─ cansReturned: 5
   ├─ outstandingCans: 75 (auto: 50 + 30 - 5)
   ├─ receivedIncome: 600 (30 delivered * 20 rate)
   ├─ expenseCategory: "fuel" (optional)
   ├─ expenseAmount: 50 (optional)
   ├─ settledCash: 500
   └─ settledOnline: 50
   
   Calculated:
   ├─ profit = 600 - 50 = 550
   ├─ shortage = 550 - 500 - 50 = 0
   └─ remainingCans = 100 - 30 = 70
   
   Stored in: deliveryStore (Zustand)
   └─→ deliveries[] array
   
Step 8: Submit Session
   Staff Action: Submit daily session
   
   Process: submitStaffSession()
   ├─ Validate at least one delivery
   ├─ Group deliveries by hotel
   │   └─ Hotel Taj: income=600, expense=50, profit=550
   ├─ Calculate totals:
   │   ├─ totalHotels: 1
   │   ├─ totalCans: 100 (loaded)
   │   ├─ totalDelivered: 30
   │   ├─ totalReturned: 5
   │   ├─ totalOutstanding: 75
   │   ├─ totalIncome: 600
   │   ├─ totalExpense: 50
   │   └─ totalProfit: 550
   └─ Create database records:
       ├─ water_delivery_records (parent)
       │   ├─ delivery_person_name: "Jane Smith"
       │   ├─ employee_id: "emp_999"
       │   ├─ date: "2026-06-30"
       │   ├─ status: "submitted"
       │   ├─ total_hotels: 1
       │   ├─ total_cans: 100
       │   ├─ total_delivered: 30
       │   ├─ total_outstanding: 75
       │   ├─ total_income: 600
       │   ├─ total_expense: 50
       │   └─ total_profit: 550
       └─ hotel_deliveries (children, JSONB)
           └─→ Array of hotel delivery objects
       
       Update hotels.outstanding_cans:
       └─ Hotel Taj: 50 + 30 - 5 = 75
   
   ┌─────────────────────────────────────────────────────────────────┐
   │                        ADMIN MODULE (READS)                     │
   └─────────────────────────────────────────────────────────────────┘

Step 9: Admin Views Records
   Admin Action: View Daily Records
   
   Query:
   ├─ water_delivery_records WHERE date = "2026-06-30"
   │   └─→ JOIN employees
   └─ Display:
       ├─ Staff name, date, business
       ├─ Financial summary (income, expense, profit)
       └─ Hotel-wise breakdown (expandable)
```

### 3.1 Staff Data Fields (From Admin)

| Admin Creates | Database Column | Staff Uses | Transformation |
|---------------|----------------|-------------|----------------|
| Business.name | employees.business_name | Display in UI | Direct copy |
| Business.type | employees.business_type | Role assignment | Determines STAFF role |
| Business.mode | Fetched via join | StartDay behavior | Auto vs manual assignment |
| Employee.full_name | water_delivery_records.delivery_person_name | Session info | Direct copy |
| Employee.id | water_delivery_records.employee_id | FK constraint | Direct reference |
| Hotel.name | hotel_deliveries.hotel_name | Delivery form | Direct copy |
| Hotel.rate_per_can | hotel_deliveries.rate_per_can | Amount calculation | Used in estAmount |
| Hotel.outstanding_cans | hotel_deliveries.outstanding_cans | Previous outstanding | Snapshot at delivery |
| Hotel.location | hotel_deliveries.location | Display only | Direct copy |

### 3.2 Staff Submission Fields (To Admin)

| Staff Input | Database Column | Admin Views | Calculation |
|-------------|----------------|-------------|-------------|
| Delivery.cansDelivered | hotel_deliveries.delivered_cans | Records view | Sum per hotel |
| Delivery.cansReturned | hotel_deliveries.returned_cans | Records view | Sum per hotel |
| Delivery.outstandingCans | hotel_deliveries.outstanding_cans | Records view | Auto-calculated |
| Delivery.receivedIncome | hotel_deliveries.income | Financial summary | Sum |
| Delivery.expenseAmount | hotel_deliveries.expense | Financial summary | Sum |
| Session totals | water_delivery_records.totals | Dashboard | Aggregated |

---

## 4. Driver → Admin Data Flow

### 4.1 Data Submission Flow

```
DRIVER MODULE                         ADMIN MODULE
─────────────────                     ─────────────────

1. Driver records trips
   ├─ Trip 1: A→B, ₹500
   ├─ Trip 2: C→D, ₹300
   └─ Trip 3: E→F, ₹400
   
2. Driver adds expenses
   ├─ Trip 1: fuel=100, toll=50
   ├─ Trip 2: fuel=80
   └─ Trip 3: fuel=120, toll=30
   
3. Driver submits session
   └─→ submitDriverSession()
       ├─ Validate all trips have expenses
       ├─ Calculate totals:
       │   ├─ totalTrips: 3
       │   ├─ totalIncome: 1200
       │   ├─ totalExpense: 380
       │   └─ totalProfit: 820
       └─→ POST to Supabase
           ├─ INSERT driver_records
           └─ INSERT trip_details (JSONB)

4. Admin views in Records screen
   ├─ Query: driver_records WHERE date = TODAY
   ├─ Display: Driver name, vehicle, totals
   └─ Drill-down: View trip details

5. Admin views in Finance screen
   ├─ Query: driver_records with filters
   ├─ Aggregate: Sum income, expense, profit
   └─ Display: Financial table
```

### 4.2 Driver Record Structure

```typescript
// driver_records table
{
  id: "dr_123",
  driver_name: "John Doe",
  employee_id: "emp_456",
  vehicle_id: "veh_789",
  vehicle_name: "Toyota Innova",
  vehicle_number: "TN 01 AB 1234",
  date: "2026-06-30",
  status: "submitted",
  avatar_color: "#1E88E5",
  trips: 3,
  total_income: 1200,
  total_expense: 380,
  settled_to_admin: 1000,
  balance_shortage: 420,
  total_profit: 820,
  per_km_rate: 15,
  fuel_expense: 300,
  trip_details: [
    {
      trip_number: 1,
      destination: "A to B",
      trip_type: "vendor",
      payment_mode: "cash",
      distance: 15,
      income: 500,
      expense: 150,
      profit: 350,
      settled_cash: 400,
      settled_online: 0,
      expense_categories: {
        fuel: 100,
        toll: 50,
        food: 0,
        other: 0,
        notes: "Toll booth"
      }
    },
    // ... more trips
  ]
}
```

---

## 5. Staff → Admin Data Flow

### 5.1 Data Submission Flow

```
STAFF MODULE                          ADMIN MODULE
─────────────────                     ─────────────────

1. Staff selects hotels
   ├─ Hotel Taj (rate: ₹20/can)
   └─ Hotel Oberoi (rate: ₹25/can)

2. Staff records deliveries
   ├─ Hotel Taj: 30 delivered, 5 returned
   │   ├─ previous outstanding: 50
   │   ├─ new outstanding: 75
   │   ├─ income: 600 (30 * 20)
   │   └─ expense: 50 (fuel)
   └─ Hotel Oberoi: 25 delivered, 3 returned
       ├─ previous outstanding: 20
       ├─ new outstanding: 42
       ├─ income: 625 (25 * 25)
       └─ expense: 30 (toll)

3. Staff submits session
   └─→ submitStaffSession()
       ├─ Group by hotel
       │   ├─ Hotel Taj: income=600, expense=50, profit=550
       │   └─ Hotel Oberoi: income=625, expense=30, profit=595
       ├─ Calculate totals:
       │   ├─ totalHotels: 2
       │   ├─ totalCans: 55 (30+25)
       │   ├─ totalDelivered: 55
       │   ├─ totalReturned: 8
       │   ├─ totalOutstanding: 117 (75+42)
       │   ├─ totalIncome: 1225
       │   ├─ totalExpense: 80
       │   └─ totalProfit: 1145
       └─→ POST to Supabase
           ├─ INSERT water_delivery_records
           ├─ INSERT hotel_deliveries (JSONB)
           └─ UPDATE hotels.outstanding_cans

4. Admin views in Records screen
   ├─ Query: water_delivery_records WHERE date = TODAY
   ├─ Display: Staff name, business, totals
   └─ Drill-down: View hotel-wise breakdown

5. Admin views in Finance screen
   ├─ Query: water_delivery_records with filters
   ├─ Aggregate: Sum income, expense, profit
   └─ Display: Financial table
```

### 5.2 Water Delivery Record Structure

```typescript
// water_delivery_records table
{
  id: "wd_456",
  delivery_person_name: "Jane Smith",
  employee_id: "emp_999",
  date: "2026-06-30",
  status: "submitted",
  avatar_color: "#7C3AED",
  total_hotels: 2,
  total_cans: 100,
  total_delivered: 55,
  total_returned: 8,
  total_outstanding: 117,
  total_settled: 1100,
  total_cash_settled: 800,
  total_online_settled: 300,
  total_income: 1225,
  total_expense: 80,
  total_profit: 1145,
  hotel_deliveries: [
    {
      hotel_name: "Hotel Taj",
      location: "123 Main St",
      rate_per_can: 20,
      total_cans: 100,
      delivered_cans: 30,
      returned_cans: 5,
      outstanding_cans: 75,
      income: 600,
      expense: 50,
      profit: 550,
      settled_cash: 500,
      settled_online: 50,
      shortage: 0
    },
    {
      hotel_name: "Hotel Oberoi",
      location: "456 Park Ave",
      rate_per_can: 25,
      total_cans: 0,
      delivered_cans: 25,
      returned_cans: 3,
      outstanding_cans: 42,
      income: 625,
      expense: 30,
      profit: 595,
      settled_cash: 300,
      settled_online: 250,
      shortage: 45
    }
  ]
}
```

---

## 6. Complete Data Flow Diagrams

### 6.1 Three-Module Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ADMIN MODULE                                 │
│  (Creates Foundation Data)                                           │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ Creates
                              ▼
        ┌─────────────────────────────────────┐
        │                                     │
    ┌───┴────┐    ┌────────┐    ┌────────┐  │
    │Business│    │Employee│    │ Vehicle│  │
    │  (1)   │    │  (N)   │    │  (N)   │  │
    └───┬────┘    └───┬────┘    └───┬────┘  │
        │             │             │        │
        │    ┌────────┴──────┐     │        │
        │    │  Assignments  │     │        │
        │    │  (Junction)   │     │        │
        │    └────────┬──────┘     │        │
        │             │             │        │
        └─────────────┼─────────────┘        │
                      │                       │
                      │ Enables               │
                      ▼                       ▼
            ┌──────────────────────────────────────┐
            │                                      │
        ┌───┴────┐    ┌──────────┐                │
        │ DRIVER │    │  STAFF   │                │
        │ MODULE │    │  MODULE  │                │
        └───┬────┘    └────┬─────┘                │
            │               │                      │
            │  Records       │  Records            │
            │  Trips         │  Deliveries         │
            │  Expenses      │  (Cans)             │
            │               │                      │
            └───────┬───────┘                      │
                    │                               │
                    │ Submits                       │
                    ▼                               ▼
          ┌──────────────────────────────────────────┐
          │                                          │
      ┌───┴────┐    ┌────────────┐                  │
      │driver_ │    │water_deliv-│                  │
      │records │    │  ery_records│                  │
      └───┬────┘    └─────┬──────┘                  │
          │                │                          │
          └────────┬───────┘                          │
                   │                                   │
                   │ Admin Views                       │
                   ▼                                   ▼
          ┌──────────────────────────────────────────────┐
          │         ADMIN MODULE (READS)                 │
          │  • Daily Records Screen                      │
          │  • Finance Screen                            │
          │  • Dashboard Aggregations                    │
          └──────────────────────────────────────────────┘
```

### 6.2 Data Flow by Business Type

```
BUSINESS TYPE: TAXI
─────────────────────────────────────────────────────────────────────

Admin Creates:
   Business (type="taxi")
      └─→ Employee (role="driver")
          └─→ Vehicle Assignment
              └─→ Driver can start day

Driver Creates:
   Session
      └─→ Trips (with from, to, amount)
          └─→ Expenses (fuel, toll, etc.)
              └─→ Submit Session
                  └─→ driver_records + trip_details

Admin Reads:
   driver_records
      └─→ View in Records screen
      └─→ Aggregate in Finance screen
      └─→ Dashboard stats

─────────────────────────────────────────────────────────────────────

BUSINESS TYPE: WATER_DELIVERY
─────────────────────────────────────────────────────────────────────

Admin Creates:
   Business (type="water_delivery")
      └─→ Employee (role="staff")
          └─→ Hotels
              └─→ Hotel Assignment (staff_hotel_assignments)
                  └─→ Staff can start day

Staff Creates:
   Session
      └─→ Deliveries (per hotel)
          ├─ cansDelivered, cansReturned
          ├─ income, expense
          └─→ Submit Session
              └─→ water_delivery_records + hotel_deliveries
                  └─→ Update hotels.outstanding_cans

Admin Reads:
   water_delivery_records
      └─→ View in Records screen
      └─→ Aggregate in Finance screen
      └─→ Dashboard stats
```

### 6.3 Real-Time Data Dependencies

```
┌─────────────────────────────────────────────────────────────────┐
│                    DATA DEPENDENCY CHAIN                         │
└─────────────────────────────────────────────────────────────────┘

Level 1: Foundation (Admin)
   └─→ Business
       └─→ MUST exist before Employee
           └─→ employees.business_id → businesses.id

Level 2: People (Admin)
   └─→ Employee
       └─→ MUST exist before Assignment
           └─→ assignments.staff_id → employees.id

Level 3: Assets (Admin)
   ├─→ Vehicle (Taxi)
   │   └─→ MUST exist before Assignment
   │       └─→ assignments.vehicle_id → vehicles.id
   └─→ Hotel (Water)
       └─→ MUST exist before Assignment
           └─→ assignments.hotel_id → hotels.id

Level 4: Assignment (Admin)
   └─→ Assignment
       └─→ REQUIRED for Driver/Staff to work
           ├─→ Driver: Has vehicle to drive
           └─→ Staff: Has hotels to deliver

Level 5: Daily Work (Driver/Staff)
   ├─→ Driver: Creates trips, expenses
   │   └─→ Submits: driver_records
   └─→ Staff: Creates deliveries
       └─→ Submits: water_delivery_records

Level 6: Review (Admin)
   └─→ Reads submitted records
       └─→ Views in Records, Finance, Dashboard
```

---

## 7. Cross-Module Dependencies

### 7.1 Critical Dependencies Matrix

| Admin Entity | Depends On | Enables | Used By |
|--------------|------------|---------|---------|
| Business | None | Employee creation | Employee.businessId |
| Employee | Business | Assignment, Login | Driver/Staff module |
| Vehicle | None | Driver assignment | Driver session |
| Hotel | None | Staff assignment | Staff session |
| Assignment | Employee + Asset | Daily work | StartDay screen |

### 7.2 Data Availability Timeline

```
TIMELINE: Admin → Driver/Staff Data Availability
─────────────────────────────────────────────────────────────────────

T+0: Admin creates Business
     └─→ Available for employee creation

T+1: Admin creates Employee
     └─→ Can login immediately
     └─→ businessName, businessType auto-populated

T+2: Admin creates Vehicle/Hotel
     └─→ Available for assignment

T+3: Admin assigns Vehicle/Hotel to Employee
     └─→ Driver/Staff can now start day
     └─→ StartDay screen shows assignment

T+4: Driver/Staff starts day
     └─→ Creates session
     └─→ Can record trips/deliveries

T+5: Driver/Staff submits session
     └─→ Creates driver_records/water_delivery_records
     └─→ Available for Admin to view

T+6: Admin views records
     └─→ Records screen shows submission
     └─→ Finance screen aggregates data
     └─→ Dashboard updates stats
```

### 7.3 Business Mode Impact on Data Flow

**Manual Mode**:
```
Admin Action Required at T+3:
   └─→ Explicitly assign vehicles/hotels
       └─→ Creates assignment record
           └─→ Employee sees only assigned assets

Data Flow:
   Admin → Assignment → Employee sees specific assets
   └─→ No choice for Driver/Staff
```

**Auto Mode**:
```
Admin Action at T+3:
   └─→ Create assets (vehicles/hotels)
       └─→ NO assignment needed
           └─→ All enabled assets available

Data Flow:
   Admin → Assets available
   └─→ Driver/Staff self-selects each day
       └─→ Creates temporary assignment
```

### 7.4 Status Field Impact

```
BUSINESS STATUS
─────────────────────────────────────────────────────────────────────
enabled:
   ├─→ Employees can be created
   ├─→ Appears in business lists
   └─→ Active in dashboard

disabled:
   ├─→ No new employees
   ├─→ Hidden from selection
   └─→ Excluded from dashboard

─────────────────────────────────────────────────────────────────────
EMPLOYEE STATUS
─────────────────────────────────────────────────────────────────────
enabled:
   ├─→ Can login
   ├─→ Can be assigned assets
   └─→ Records count in dashboard

disabled:
   ├─→ Cannot login
   ├─→ Should unassign assets
   └─→ Excluded from dashboard

─────────────────────────────────────────────────────────────────────
ASSET STATUS (Vehicle/Hotel)
─────────────────────────────────────────────────────────────────────
enabled:
   ├─→ Available for assignment
   ├─→ Appears in lists
   └─→ Can be selected (auto mode)

disabled:
   ├─→ Not available
   ├─→ Hidden from selection
   └─→ Existing assignments should be removed
```

---

## 8. Data Transformation Summary

### 8.1 Field Transformations by Module

**Admin → Database**:
```typescript
// Input transformation
fullName: string → trim() → employees.full_name
mobile: string → replace(/\D/g, "") → employees.mobile
businessId: string → FK → employees.business_id
businessName: string → auto-populated → employees.business_name
businessType: string → auto-populated → employees.business_type
pin: string → stored as-is (should hash!) → employees.pin
```

**Driver → Database**:
```typescript
// Session submission
trip.amount: number → sum → driver_records.total_income
trip.totalExpense: number → sum → driver_records.total_expense
trip.profit: number → sum → driver_records.total_profit
trip.expense: object → JSONB → trip_details.expense_categories

// Calculated fields
totalProfit = totalIncome - totalExpense
balanceShortage = totalProfit - settledToAdmin
```

**Staff → Database**:
```typescript
// Session submission
delivery.cansDelivered: number → sum → water_delivery_records.total_delivered
delivery.receivedIncome: number → sum → water_delivery_records.total_income
delivery.expenseAmount: number → sum → water_delivery_records.total_expense

// Per-hotel aggregation
hotelMap: Map<string, aggregates>
  └─→ Group by hotelId
      └─→ Sum income, expense, cans
          └─→ hotel_deliveries array

// Outstanding update
hotel.outstanding_cans = previous + delivered - returned
```

### 8.2 Denormalization Strategy

**Why Denormalize?**
1. **Performance**: Avoid joins on every query
2. **History**: Preserve data even if source changes
3. **Simplicity**: Easier queries for common use cases

**What's Denormalized?**

```typescript
// Employee table
business_name: Copied from Business.name
business_type: Copied from Business.type
Reason: Employee needs business info, avoid join

// Driver records
driver_name: Copied from Employee.full_name
vehicle_name: Copied from Vehicle.name
vehicle_number: Copied from Vehicle.number
Reason: Preserve historical record

// Water delivery records
delivery_person_name: Copied from Employee.full_name
Reason: Preserve historical record

// Hotel deliveries
hotel_name: Copied from Hotel.name
location: Copied from Hotel.location
rate_per_can: Copied from Hotel.rate_per_can (at delivery time)
Reason: Preserve historical rates and names
```

### 8.3 Calculated vs Stored Fields

**Calculated On-the-Fly** (Not Stored):
```typescript
// Driver module
profit = income - expense
shortage = profit - settledCash - settledOnline

// Staff module
outstandingCans = previousOutstanding + delivered - returned
estAmount = delivered * ratePerCan
profit = income - expense
shortage = profit - settledCash - settledOnline
remainingCans = totalLoaded - totalDeliveredSoFar
```

**Stored in Database** (Pre-calculated):
```typescript
// Driver records
total_income: Sum of all trip incomes
total_expense: Sum of all trip expenses
total_profit: total_income - total_expense
settled_to_admin: Sum of all settlements
balance_shortage: total_profit - settled_to_admin

// Water delivery records
total_hotels: Count of unique hotels
total_cans: Sum of all loaded cans
total_delivered: Sum of delivered cans
total_outstanding: Sum of outstanding cans
total_income: Sum of all hotel incomes
total_expense: Sum of all hotel expenses
total_profit: total_income - total_expense
```

**Why Store?**
- Faster dashboard queries
- Avoid recalculating from JSONB
- Consistent aggregations
- Historical snapshots

---

## 9. Summary

### 9.1 Key Data Flow Patterns

**Pattern 1: Admin Creates → Driver/Staff Consumes**
```
Admin: Business → Employee → Asset → Assignment
Driver/Staff: Fetches assignment → Uses assets → Records work
```

**Pattern 2: Driver/Staff Creates → Admin Reads**
```
Driver/Staff: Records work → Submits session
Admin: Views records → Aggregates data → Shows in dashboard
```

**Pattern 3: Calculated Fields**
```
Input → Calculation → Display
   ↓         ↓           ↓
User    On-the-fly    Real-time
Data    or Stored     or Historical
```

### 9.2 Critical Success Factors

1. **Data Hierarchy**: Business → Employee → Asset → Assignment must be followed
2. **Status Checks**: Always check enabled/disabled before operations
3. **Business Mode**: Determines assignment workflow (auto vs manual)
4. **Denormalization**: Critical fields copied for performance
5. **Calculations**: Consistent formulas across modules
6. **Validation**: Strict at creation (Admin) and usage (Driver/Staff)

### 9.3 Common Data Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Hotel not showing for staff | No assignment or disabled | Check staff_hotel_assignments, hotel status |
| Outstanding cans wrong | Not updated after submission | Update in submitStaffSession |
| Rate per can outdated | Cached in form | Refresh on screen focus |
| Driver can't start day | No vehicle assignment | Check vehicles.assigned_employee_id |
| Employee can't login | Disabled status or wrong PIN | Check employees.status, verify PIN |

---

**Document Version**: 1.0  
**Analysis Date**: 2026-06-30  
**Analyst**: AI Assistant  
**Next Steps**: Validate against backend schema, review with team