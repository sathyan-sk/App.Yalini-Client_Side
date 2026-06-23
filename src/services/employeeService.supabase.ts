/**
 * Employee persistence service — Supabase implementation.
 *
 * This service uses Supabase for data persistence.
 * Handles denormalized fields (businessName, businessType) and employee count updates.
 */

import { supabase } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';
import { generateId } from '../services/mockData';
import type { Database } from '../config/database.types';
import type {
  Employee,
  EmployeeFormValues,
} from '../screens/adminScreens/Employees/types';

type EmployeeRow = Database['public']['Tables']['employees']['Row'];
type EmployeeInsert = Database['public']['Tables']['employees']['Insert'];
type EmployeeUpdate = Database['public']['Tables']['employees']['Update'];

/**
 * Convert database row (snake_case) to frontend Employee type (camelCase)
 */
const fromSupabaseRow = (row: EmployeeRow): Employee => ({
  id: row.id,
  fullName: row.full_name,
  mobile: row.mobile,
  businessId: row.business_id,
  businessName: row.business_name,
  businessType: row.business_type,
  pin: row.pin,
  status: row.status,
  createdAt: row.created_at,
});

/**
 * Load all employees from Supabase.
 */
export async function loadEmployees(): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase] Error loading employees:', error);
    throw new Error(`Failed to load employees: ${error.message}`);
  }

  return (data || []).map(fromSupabaseRow);
}

/**
 * Save employees - no-op for Supabase.
 */
export async function saveEmployees(_employees: Employee[]): Promise<void> {
  console.log('[Supabase] saveEmployees called - no-op in Supabase mode');
}

/**
 * Create a new employee.
 * Also increments the parent business employee count.
 */
export async function createEmployee(values: EmployeeFormValues): Promise<Employee> {
  // Get business details
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('name, type, employees')
    .eq('id', values.businessId)
    .single();

  if (bizError || !business) {
    throw new Error('Business not found');
  }

  // Auto-derive role from business type
  // taxi business → driver, water_delivery business → staff
  const derivedRole = business.type === 'taxi' ? 'driver' : 'staff';

  const insertData: EmployeeInsert = {
    id: generateId('emp'),
    full_name: values.fullName.trim(),
    mobile: values.mobile.replace(/\D/g, ''),
    business_id: values.businessId,
    business_name: business.name,
    business_type: business.type,
    pin: values.pin,
    role: derivedRole,
    status: values.status,
    created_at: getTodayDate(),
  };

  const { data, error } = await supabase
    .from('employees')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating employee:', error);
    throw new Error(`Failed to create employee: ${error.message}`);
  }

  // Increment business employee count
  await supabase
    .from('businesses')
    .update({ employees: business.employees + 1 })
    .eq('id', values.businessId);

  return fromSupabaseRow(data);
}

/**
 * Update an existing employee by ID.
 */
export async function updateEmployee(
  id: string,
  values: EmployeeFormValues
): Promise<Employee | null> {
  // Get business details
  const { data: business } = await supabase
    .from('businesses')
    .select('name, type')
    .eq('id', values.businessId)
    .single();

  const updateData: EmployeeUpdate = {
    full_name: values.fullName.trim(),
    mobile: values.mobile.replace(/\D/g, ''),
    business_id: values.businessId,
    business_name: business?.name ?? 'Unknown Business',
    business_type: business?.type ?? 'taxi',
    pin: values.pin,
    status: values.status,
  };

  const { data, error } = await supabase
    .from('employees')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error updating employee:', error);
    throw new Error(`Failed to update employee: ${error.message}`);
  }

  return data ? fromSupabaseRow(data) : null;
}

/**
 * Delete an employee by ID.
 * Also decrements the parent business employee count.
 */
export async function deleteEmployee(id: string): Promise<void> {
  // Get employee to find business_id
  const { data: employee } = await supabase
    .from('employees')
    .select('business_id')
    .eq('id', id)
    .single();

  if (!employee) {
    throw new Error('Employee not found');
  }

  // Delete employee
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[Supabase] Error deleting employee:', error);
    throw new Error(`Failed to delete employee: ${error.message}`);
  }

  // Decrement business employee count
  const { data: business } = await supabase
    .from('businesses')
    .select('employees')
    .eq('id', employee.business_id)
    .single();

  if (business && business.employees > 0) {
    await supabase
      .from('businesses')
      .update({ employees: business.employees - 1 })
      .eq('id', employee.business_id);
  }
}
