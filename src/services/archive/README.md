# Mock Data Archive

## 📦 Archived: 2026-01-26

This folder contains the **legacy mock data implementation** that was used during development before the app was connected to Supabase.

---

## 🗂️ Contents

- `index.ts` - Central mock data store (548 lines)
- `seedData.ts` - Seed data for businesses, employees, vehicles, hotels
- `types.ts` - TypeScript interfaces for mock data
- `driverConfig.ts` - Driver-specific configuration

---

## 📜 History

**Purpose**: 
- Provided in-memory data store for UI development
- Simulated async behavior with artificial latency
- Enabled development without backend connection

**Usage**:
- Originally used when `USE_MOCK=true` in featureFlags.ts
- All service layers have been refactored to use Supabase directly
- Mock mode has been completely removed from the codebase

**Status**: 
- ❌ **NO LONGER IN USE**
- ✅ **ARCHIVED FOR REFERENCE**
- 🔒 **PRESERVED IN GIT HISTORY**

---

## 🔄 Migration Path

### Before (with mock):
```typescript
// services/businessService.ts
if (USE_MOCK) {
  return getBusinesses(); // From mockData
} else {
  return loadFromSupabase(); // From Supabase
}
```

### After (production):
```typescript
// services/businessService.ts
export async function loadBusinesses(): Promise<Business[]> {
  const { loadBusinesses } = await import('./businessService.supabase');
  return loadBusinesses();
}
```

---

## 📚 Why Keep This?

1. **Reference**: Understanding original data structure
2. **Learning**: See how mock data was organized
3. **Recovery**: Can restore if needed (Git has full history)
4. **Documentation**: Shows app evolution

---

## 🚀 Current Implementation

All services now use **Supabase directly**:
- `businessService.supabase.ts`
- `employeeService.supabase.ts`
- `vehicleService.supabase.ts`
- `hotelService.supabase.ts`
- `authService.supabase.ts`
- `driverService.supabase.ts`
- `deliveryService.supabase.ts`
- `recordsService.supabase.ts`
- `dashboardService.supabase.ts`
- `financeService.supabase.ts`

---

## ⚠️ Note

**DO NOT** import from this folder in production code.

If you need to restore mock mode:
1. Check Git history for the original implementation
2. Or manually copy files back to `src/services/mockData/`
3. Update service layers to use mock imports again

---

**Archived**: 2026-01-26  
**Reason**: Migration to Supabase-only architecture  
**Status**: Legacy/Reference only