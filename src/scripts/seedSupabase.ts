/**
 * Seed Supabase Database with Initial Data
 * 
 * This script populates the Supabase database with initial seed data
 * matching the mock data structure.
 * 
 * Run this once to set up the database with sample data.
 */

import { supabase } from '../config/supabase';
import { getTodayDate } from '../config/supabaseHelpers';

const AVATAR_COLORS = [
  '#7C3AED',
  '#2563EB',
  '#059669',
  '#F97316',
  '#EC4899',
  '#0D9488',
  '#0891B2',
];

export async function seedDatabase() {
  console.log('🌱 Starting Supabase database seeding...');

  try {
    // 1. Seed Businesses
    console.log('📦 Seeding businesses...');
    const { data: businesses, error: bizError } = await supabase
      .from('businesses')
      .upsert([
        {
          id: 'biz_seed_city_taxi',
          name: 'City Taxi',
          type: 'taxi' as const,
          mode: 'auto' as const,
          status: 'enabled' as const,
          location: null,
          employees: 4,
          created_at: '2026-06-10',
        },
        {
          id: 'biz_seed_yalini_minerals',
          name: 'Yalini Minerals',
          type: 'water_delivery' as const,
          mode: 'manual' as const,
          status: 'enabled' as const,
          location: null,
          employees: 3,
          created_at: '2026-06-05',
        },
      ], { onConflict: 'id' })
      .select();

    if (bizError) throw bizError;
    console.log(`✅ Seeded ${businesses?.length || 0} businesses`);

    // 2. Seed Employees
    console.log('👥 Seeding employees...');
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .upsert([
        // Taxi employees
        {
          id: 'emp_seed_ramesh',
          full_name: 'Ramesh Kumar',
          mobile: '9876543210',
          business_id: 'biz_seed_city_taxi',
          business_name: 'City Taxi',
          business_type: 'taxi' as const,
          pin: '1234',
          status: 'enabled' as const,
          created_at: '2026-06-10',
        },
        {
          id: 'emp_seed_ajay',
          full_name: 'Ajay Verma',
          mobile: '9876543212',
          business_id: 'biz_seed_city_taxi',
          business_name: 'City Taxi',
          business_type: 'taxi' as const,
          pin: '1234',
          status: 'enabled' as const,
          created_at: '2026-06-08',
        },
        {
          id: 'emp_seed_deepak',
          full_name: 'Deepak Patel',
          mobile: '9876543214',
          business_id: 'biz_seed_city_taxi',
          business_name: 'City Taxi',
          business_type: 'taxi' as const,
          pin: '1234',
          status: 'enabled' as const,
          created_at: '2026-06-06',
        },
        {
          id: 'emp_seed_vijay',
          full_name: 'Vijay Kumar',
          mobile: '9876543216',
          business_id: 'biz_seed_city_taxi',
          business_name: 'City Taxi',
          business_type: 'taxi' as const,
          pin: '1234',
          status: 'enabled' as const,
          created_at: '2026-06-04',
        },
        // Water delivery employees
        {
          id: 'emp_seed_suresh',
          full_name: 'Suresh Babu',
          mobile: '9876543218',
          business_id: 'biz_seed_yalini_minerals',
          business_name: 'Yalini Minerals',
          business_type: 'water_delivery' as const,
          pin: '5678',
          status: 'enabled' as const,
          created_at: '2026-06-05',
        },
        {
          id: 'emp_seed_mani',
          full_name: 'Mani Kumar',
          mobile: '9876543220',
          business_id: 'biz_seed_yalini_minerals',
          business_name: 'Yalini Minerals',
          business_type: 'water_delivery' as const,
          pin: '5678',
          status: 'enabled' as const,
          created_at: '2026-06-03',
        },
        {
          id: 'emp_seed_arun',
          full_name: 'Arun Raj',
          mobile: '9876543222',
          business_id: 'biz_seed_yalini_minerals',
          business_name: 'Yalini Minerals',
          business_type: 'water_delivery' as const,
          pin: '5678',
          status: 'enabled' as const,
          created_at: '2026-06-01',
        },
      ], { onConflict: 'id' })
      .select();

    if (empError) throw empError;
    console.log(`✅ Seeded ${employees?.length || 0} employees`);

    // 3. Seed Vehicles
    console.log('🚗 Seeding vehicles...');
    const { data: vehicles, error: vehError } = await supabase
      .from('vehicles')
      .upsert([
        {
          id: 'veh_seed_tn01',
          name: 'Maruti Swift',
          number: 'TN01AB1234',
          status: 'enabled' as const,
          notes: 'White color, well maintained',
          assigned_driver: 'Ramesh Kumar',
          assigned_employee_id: 'emp_seed_ramesh',
          created_at: '2026-06-10',
          updated_at: getTodayDate(),
        },
        {
          id: 'veh_seed_tn02',
          name: 'Hyundai i10',
          number: 'TN02CD5678',
          status: 'enabled' as const,
          notes: 'Red color',
          assigned_driver: 'Ajay Verma',
          assigned_employee_id: 'emp_seed_ajay',
          created_at: '2026-06-08',
          updated_at: getTodayDate(),
        },
        {
          id: 'veh_seed_tn03',
          name: 'Honda City',
          number: 'TN03EF9012',
          status: 'enabled' as const,
          notes: 'Black, premium vehicle',
          assigned_driver: 'Deepak Patel',
          assigned_employee_id: 'emp_seed_deepak',
          created_at: '2026-06-06',
          updated_at: getTodayDate(),
        },
        {
          id: 'veh_seed_tn04',
          name: 'Toyota Etios',
          number: 'TN04GH3456',
          status: 'enabled' as const,
          notes: null,
          assigned_driver: null,
          assigned_employee_id: null,
          created_at: '2026-06-04',
          updated_at: getTodayDate(),
        },
      ], { onConflict: 'id' })
      .select();

    if (vehError) throw vehError;
    console.log(`✅ Seeded ${vehicles?.length || 0} vehicles`);

    // 4. Seed Hotels
    console.log('🏨 Seeding hotels...');
    const { data: hotels, error: hotelError } = await supabase
      .from('hotels')
      .upsert([
        {
          id: 'hotel_seed_taj',
          name: 'Taj Hotel',
          rate_per_can: 40,
          status: 'enabled' as const,
          location: 'Mount Road, Chennai',
          assigned_employee_id: 'emp_seed_suresh',
          assigned_employee_name: 'Suresh Babu',
          created_at: '2026-06-05',
        },
        {
          id: 'hotel_seed_leela',
          name: 'Leela Palace',
          rate_per_can: 45,
          status: 'enabled' as const,
          location: 'Adyar, Chennai',
          assigned_employee_id: 'emp_seed_suresh',
          assigned_employee_name: 'Suresh Babu',
          created_at: '2026-06-05',
        },
        {
          id: 'hotel_seed_grand',
          name: 'Grand Plaza',
          rate_per_can: 38,
          status: 'enabled' as const,
          location: 'T Nagar, Chennai',
          assigned_employee_id: 'emp_seed_mani',
          assigned_employee_name: 'Mani Kumar',
          created_at: '2026-06-03',
        },
        {
          id: 'hotel_seed_royal',
          name: 'Royal Residency',
          rate_per_can: 35,
          status: 'enabled' as const,
          location: 'Velachery, Chennai',
          assigned_employee_id: 'emp_seed_mani',
          assigned_employee_name: 'Mani Kumar',
          created_at: '2026-06-03',
        },
        {
          id: 'hotel_seed_park',
          name: 'Park Inn',
          rate_per_can: 42,
          status: 'enabled' as const,
          location: 'OMR, Chennai',
          assigned_employee_id: null,
          assigned_employee_name: null,
          created_at: '2026-06-01',
        },
      ], { onConflict: 'id' })
      .select();

    if (hotelError) throw hotelError;
    console.log(`✅ Seeded ${hotels?.length || 0} hotels`);

    console.log('🎉 Database seeding completed successfully!');
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return { success: false, error };
  }
}

// Export for use in app
export default seedDatabase;
