/**
 * Employee persistence service — local-only (AsyncStorage) for the UI milestone.
 *
 * First-run UX is non-empty: if no record exists yet, six demo employees are
 * seeded so the list, search, and stat cards have meaningful content on cold
 * start (matches the reference design).
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { EMPLOYEE_STORAGE_KEY } from "../screens/adminScreens/Employees/data/constants";
import type {
  Employee,
  EmployeeFormValues,
} from "../screens/adminScreens/Employees/types";
import { loadBusinesses } from "./businessService";

const storage = {
  async getItem(key: string, defaultValue = ""): Promise<string> {
    const value = await AsyncStorage.getItem(key);
    return value ?? defaultValue;
  },
  async setItem(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  },
};

/** Strict ISO date (YYYY-MM-DD) for `createdAt`. */
function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** RN-safe unique id generator (no crypto.randomUUID polyfill required). */
function generateId(): string {
  return `emp_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

const SEED_EMPLOYEES: Employee[] = [
  {
    id: "emp_seed_ramesh",
    fullName: "Ramesh Kumar",
    mobile: "9876543210",
    businessId: "biz_seed_city_taxi",
    businessName: "Yalini Cab's",
    businessType: "taxi",
    pin: "1234",
    status: "enabled",
    createdAt: "2026-06-10",
  },
  {
    id: "emp_seed_suresh",
    fullName: "Suresh Kumar",
    mobile: "9876543211",
    businessId: "biz_seed_yalini_minerals",
    businessName: "Yalini Minerals",
    businessType: "water_delivery",
    pin: "1234",
    status: "enabled",
    createdAt: "2026-06-09",
  },
  {
    id: "emp_seed_ajay",
    fullName: "Ajay Verma",
    mobile: "9876543212",
    businessId: "biz_seed_city_taxi",
    businessName: "Yalini Cab's",
    businessType: "taxi",
    pin: "1234",
    status: "disabled",
    createdAt: "2026-06-08",
  },
  {
    id: "emp_seed_mani",
    fullName: "Mani Kumar",
    mobile: "9876543213",
    businessId: "biz_seed_yalini_minerals",
    businessName: "Yalini Minerals",
    businessType: "water_delivery",
    pin: "1234",
    status: "disabled",
    createdAt: "2026-06-07",
  },
  {
    id: "emp_seed_deepak",
    fullName: "Deepak Patel",
    mobile: "9876543214",
    businessId: "biz_seed_city_taxi",
    businessName: "Yalini Cab's",
    businessType: "taxi",
    pin: "1234",
    status: "enabled",
    createdAt: "2026-06-06",
  },
  {
    id: "emp_seed_pawan",
    fullName: "Pawan Prasad",
    mobile: "9876543215",
    businessId: "biz_seed_yalini_minerals",
    businessName: "Yalini Minerals",
    businessType: "water_delivery",
    pin: "1234",
    status: "enabled",
    createdAt: "2026-06-05",
  },
];

export async function loadEmployees(): Promise<Employee[]>{
  try {    const raw = await storage.getItem(EMPLOYEE_STORAGE_KEY, "");
    if (!raw) {
      await saveEmployees(SEED_EMPLOYEES);
      return [...SEED_EMPLOYEES];
    }
    const parsed = JSON.parse(raw) as Employee[];
    if (!Array.isArray(parsed)) return [...SEED_EMPLOYEES];
    return parsed;
  } catch {
    return [...SEED_EMPLOYEES];
  }
}

export async function saveEmployees(employees: Employee[]): Promise<void> {
  await storage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees));
}

export async function createEmployee(
  values: EmployeeFormValues,
): Promise<Employee> {
  // Get business details
  const businesses = await loadBusinesses();
  const business = businesses.find((b) => b.id === values.businessId);
  
  const next: Employee = {
    id: generateId(),
    fullName: values.fullName.trim(),
    mobile: values.mobile.replace(/\D/g, ""),
    businessId: values.businessId,
    businessName: business?.name ?? "Unknown Business",
    businessType: business?.type ?? "taxi",
    pin: values.pin,
    status: values.status,
    createdAt: todayISODate(),
  };
  const current = await loadEmployees();
  await saveEmployees([next, ...current]);
  return next;
}

export async function updateEmployee(
  id: string,
  values: EmployeeFormValues,
): Promise<Employee | null> {
  // Get business details
  const businesses = await loadBusinesses();
  const business = businesses.find((b) => b.id === values.businessId);
  
  const current = await loadEmployees();
  let updated: Employee | null = null;
  const next = current.map((e) => {
    if (e.id !== id) return e;
    updated = {
      ...e,
      fullName: values.fullName.trim(),
      mobile: values.mobile.replace(/\D/g, ""),
      businessId: values.businessId,
      businessName: business?.name ?? e.businessName,
      businessType: business?.type ?? e.businessType,
      pin: values.pin || e.pin, // Keep existing PIN if not changed
      status: values.status,
    };
    return updated;
  });
  if (!updated) return null;
  await saveEmployees(next);
  return updated;
}

export async function deleteEmployee(id: string): Promise<void> {
  const current = await loadEmployees();
  await saveEmployees(current.filter((e) => e.id !== id));
}