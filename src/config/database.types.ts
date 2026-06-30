/**
 * Supabase Database TypeScript Definitions
 * 
 * Auto-generated types matching the Supabase database schema.
 * These types ensure type safety when querying the database.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string
          name: string
          type: 'taxi' | 'water_delivery'
          mode: 'auto' | 'manual'
          status: 'enabled' | 'disabled'
          location: string | null
          employees: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'taxi' | 'water_delivery'
          mode: 'auto' | 'manual'
          status: 'enabled' | 'disabled'
          location?: string | null
          employees?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'taxi' | 'water_delivery'
          mode?: 'auto' | 'manual'
          status?: 'enabled' | 'disabled'
          location?: string | null
          employees?: number
          created_at?: string
        }
      }
      employees: {
        Row: {
          id: string
          full_name: string
          mobile: string
          business_id: string
          business_name: string
          business_type: 'taxi' | 'water_delivery'
          pin: string
          role: 'admin' | 'driver' | 'staff'
          status: 'enabled' | 'disabled'
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          mobile: string
          business_id: string
          business_name: string
          business_type: 'taxi' | 'water_delivery'
          pin: string
          role?: 'admin' | 'driver' | 'staff'
          status: 'enabled' | 'disabled'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          mobile?: string
          business_id?: string
          business_name?: string
          business_type?: 'taxi' | 'water_delivery'
          pin?: string
          role?: 'admin' | 'driver' | 'staff'
          status?: 'enabled' | 'disabled'
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          name: string
          number: string
          status: 'enabled' | 'disabled'
          notes: string | null
          assigned_driver: string | null
          assigned_employee_id: string | null
          assignment_status: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          number: string
          status: 'enabled' | 'disabled'
          notes?: string | null
          assigned_driver?: string | null
          assigned_employee_id?: string | null
          assignment_status?: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          number?: string
          status?: 'enabled' | 'disabled'
          notes?: string | null
          assigned_driver?: string | null
          assigned_employee_id?: string | null
          assignment_status?: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      hotels: {
        Row: {
          id: string
          name: string
          rate_per_can: number
          status: 'enabled' | 'disabled'
          location: string | null
          address: string | null
          assigned_employee_id: string | null
          assigned_employee_name: string | null
          outstanding_cans: number
          assignment_status: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          rate_per_can: number
          status: 'enabled' | 'disabled'
          location?: string | null
          address?: string | null
          assigned_employee_id?: string | null
          assigned_employee_name?: string | null
          outstanding_cans?: number
          assignment_status?: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          rate_per_can?: number
          status?: 'enabled' | 'disabled'
          location?: string | null
          address?: string | null
          assigned_employee_id?: string | null
          assigned_employee_name?: string | null
          outstanding_cans?: number
          assignment_status?: 'available' | 'assigned' | 'assigning' | 'locked'
          assignment_locked_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      driver_records: {
        Row: {
          id: string
          driver_name: string
          employee_id: string
          vehicle_id: string
          vehicle_name: string
          vehicle_number: string
          date: string
          status: 'submitted' | 'pending'
          avatar_color: string
          trips: number
          total_income: number
          total_expense: number
          settled_to_admin: number
          balance_shortage: number
          total_profit: number
          total_cash_settled: number
          total_online_settled: number
        }
        Insert: {
          id?: string
          driver_name: string
          employee_id: string
          vehicle_id: string
          vehicle_name: string
          vehicle_number: string
          date: string
          status: 'submitted' | 'pending'
          avatar_color: string
          trips: number
          total_income: number
          total_expense: number
          settled_to_admin: number
          balance_shortage: number
          total_profit: number
          total_cash_settled?: number
          total_online_settled?: number
        }
        Update: {
          id?: string
          driver_name?: string
          employee_id?: string
          vehicle_id?: string
          vehicle_name?: string
          vehicle_number?: string
          date?: string
          status?: 'submitted' | 'pending'
          avatar_color?: string
          trips?: number
          total_income?: number
          total_expense?: number
          settled_to_admin?: number
          balance_shortage?: number
          total_profit?: number
          total_cash_settled?: number
          total_online_settled?: number
        }
      }
      trip_details: {
        Row: {
          id: string
          driver_record_id: string
          trip_number: number
          destination: string
          trip_type: string
          payment_mode: string
          distance: number
          income: number
          expense: number
          profit: number
          settled_cash: number
          settled_online: number
          expense_categories: Json
        }
        Insert: {
          id?: string
          driver_record_id: string
          trip_number: number
          destination: string
          trip_type?: string
          payment_mode?: string
          distance: number
          income: number
          expense: number
          profit?: number
          settled_cash?: number
          settled_online?: number
          expense_categories?: Json
        }
        Update: {
          id?: string
          driver_record_id?: string
          trip_number?: number
          destination?: string
          trip_type?: string
          payment_mode?: string
          distance?: number
          income?: number
          expense?: number
          profit?: number
          settled_cash?: number
          settled_online?: number
          expense_categories?: Json
        }
      }
      water_delivery_records: {
        Row: {
          id: string
          delivery_person_name: string
          employee_id: string
          date: string
          status: 'submitted' | 'pending'
          avatar_color: string
          total_hotels: number
          total_cans: number
          total_delivered: number
          total_returned: number
          total_outstanding: number
          total_settled: number
          total_cash_settled: number
          total_online_settled: number
          total_income: number
          total_expense: number
          total_profit: number
        }
        Insert: {
          id?: string
          delivery_person_name: string
          employee_id: string
          date: string
          status: 'submitted' | 'pending'
          avatar_color: string
          total_hotels: number
          total_cans: number
          total_delivered: number
          total_returned: number
          total_outstanding: number
          total_settled?: number
          total_cash_settled?: number
          total_online_settled?: number
          total_income: number
          total_expense: number
          total_profit: number
        }
        Update: {
          id?: string
          delivery_person_name?: string
          employee_id?: string
          date?: string
          status?: 'submitted' | 'pending'
          avatar_color?: string
          total_hotels?: number
          total_cans?: number
          total_delivered?: number
          total_returned?: number
          total_outstanding?: number
          total_settled?: number
          total_cash_settled?: number
          total_online_settled?: number
          total_income?: number
          total_expense?: number
          total_profit?: number
        }
      }
      hotel_deliveries: {
        Row: {
          id: string
          water_delivery_record_id: string
          hotel_name: string
          location: string
          rate_per_can: number
          total_cans: number
          delivered_cans: number
          returned_cans: number
          outstanding_cans: number
          income: number
          expense: number
          profit: number
          settled_cash: number
          settled_online: number
          shortage: number
        }
        Insert: {
          id?: string
          water_delivery_record_id: string
          hotel_name: string
          location: string
          rate_per_can: number
          total_cans: number
          delivered_cans: number
          returned_cans: number
          outstanding_cans: number
          income: number
          expense: number
          profit: number
          settled_cash?: number
          settled_online?: number
          shortage?: number
        }
        Update: {
          id?: string
          water_delivery_record_id?: string
          hotel_name?: string
          location?: string
          rate_per_can?: number
          total_cans?: number
          delivered_cans?: number
          returned_cans?: number
          outstanding_cans?: number
          income?: number
          expense?: number
          profit?: number
          settled_cash?: number
          settled_online?: number
          shortage?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      business_type: 'taxi' | 'water_delivery'
      business_mode: 'auto' | 'manual'
      status: 'enabled' | 'disabled'
      submission_status: 'submitted' | 'pending'
    }
  }
}
