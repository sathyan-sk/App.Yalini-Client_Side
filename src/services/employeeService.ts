/**
 * Employee persistence service — Centralized service layer.
 *
 * ARCHITECTURE:
 * - Direct Supabase implementation (production)
 * - Structured for future backend abstraction
 * - No mock mode - production-ready only
 *
 * All functions delegate to Supabase implementation.
 */

import type {
  Employee,
  EmployeeFormValues,
} from '../screens/adminScreens/Employees/types';

export async function loadEmployees(): Promise<Employee[]> {
  const { loadEmployees } = await import('./employeeService.supabase');
  return loadEmployees();
}

export async function saveEmployees(_employees: Employee[]): Promise<void> {
  const { saveEmployees } = await import('./employeeService.supabase');
  return saveEmployees(_employees);
}

export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  const { createEmployee } = await import('./employeeService.supabase');
  return createEmployee(values);
}

export async function updateEmployee(
  id: string,
  values: EmployeeFormValues
): Promise<Employee | null> {
  const { updateEmployee } = await import('./employeeService.supabase');
  return updateEmployee(id, values);
}

export async function deleteEmployee(id: string): Promise<void> {
  const { deleteEmployee } = await import('./employeeService.supabase');
  return deleteEmployee(id);
}
