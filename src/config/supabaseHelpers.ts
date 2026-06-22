/**
 * Supabase Helper Functions
 * 
 * Utility functions for common Supabase operations.
 * These helpers handle error formatting and type conversions.
 */

import { supabase } from './supabase';
import type { Database } from './database.types';

/**
 * Helper to convert camelCase to snake_case for database columns
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

/**
 * Helper to convert snake_case to camelCase for JavaScript objects
 */
export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

/**
 * Convert object keys from camelCase to snake_case
 */
export const objectToSnakeCase = <T extends Record<string, any>>(obj: T): any => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key);
    result[snakeKey] = value;
  }
  return result;
};

/**
 * Convert object keys from snake_case to camelCase
 */
export const objectToCamelCase = <T extends Record<string, any>>(obj: T): any => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key);
    result[camelKey] = value;
  }
  return result;
};

/**
 * Generic error handler for Supabase operations
 */
export const handleSupabaseError = (error: any): Error => {
  if (error?.message) {
    return new Error(`Supabase Error: ${error.message}`);
  }
  return new Error('An unknown Supabase error occurred');
};

/**
 * Format date to YYYY-MM-DD for Supabase
 */
export const formatDateForSupabase = (date: Date | string): string => {
  if (typeof date === 'string') {
    return date.split('T')[0]; // Handle ISO strings
  }
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDate = (): string => {
  return formatDateForSupabase(new Date());
};

/**
 * Batch insert helper with error handling
 */
export const batchInsert = async <T extends keyof Database['public']['Tables']>(
  table: T,
  records: Database['public']['Tables'][T]['Insert'][]
): Promise<{ data: any[] | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from(table)
      .insert(records)
      .select();
    
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Batch update helper with error handling
 */
export const batchUpdate = async <T extends keyof Database['public']['Tables']>(
  table: T,
  updates: Array<{ id: string; data: Database['public']['Tables'][T]['Update'] }>
): Promise<{ success: boolean; errors: any[] }> => {
  const errors: any[] = [];
  
  for (const update of updates) {
    const { error } = await supabase
      .from(table)
      .update(update.data)
      .eq('id', update.id);
    
    if (error) {
      errors.push({ id: update.id, error });
    }
  }
  
  return { success: errors.length === 0, errors };
};

/**
 * Pagination helper
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export const paginate = <T extends keyof Database['public']['Tables']>(
  query: any,
  params: PaginationParams
) => {
  const { page, pageSize } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  return query.range(from, to);
};

/**
 * Search helper for text fields
 */
export const searchByField = <T extends keyof Database['public']['Tables']>(
  query: any,
  field: string,
  searchTerm: string
) => {
  return query.ilike(field, `%${searchTerm}%`);
};
