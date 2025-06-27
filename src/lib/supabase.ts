import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const hasValidCredentials = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url' && 
  supabaseAnonKey !== 'your_supabase_anon_key' &&
  isValidUrl(supabaseUrl);

if (!hasValidCredentials) {
  console.error('⚠️ Supabase not configured properly. Please set up your Supabase credentials in the .env file.');
  console.error('📝 Instructions:');
  console.error('1. Go to https://supabase.com and create a new project');
  console.error('2. Copy your project URL and anon key from Settings > API');
  console.error('3. Update VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.error('4. Restart your development server');
}

// Create a mock client for development when credentials are not available
const createMockClient = () => ({
  auth: {
    signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
  }),
});

export const supabase = hasValidCredentials 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidCredentials;

// Types for our database
export type UserRole = 'donor' | 'recipient' | 'hospital' | 'organizer';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type UrgencyLevel = 'normal' | 'high' | 'critical';
export type RequestStatus = 'active' | 'fulfilled' | 'cancelled' | 'expired';
export type DonationStatus = 'scheduled' | 'completed' | 'cancelled';
export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: GenderType;
  role: UserRole;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  location?: { lat: number; lng: number };
  profile_picture_url?: string;
  is_verified: boolean;
  emergency_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface Donor {
  id: string;
  user_id: string;
  blood_type: BloodType;
  weight?: number;
  last_donation_date?: string;
  medical_conditions?: string;
  availability_status: AvailabilityStatus;
  total_donations: number;
  donation_points: number;
  is_eligible: boolean;
  next_eligible_date?: string;
  notification_preferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    emergency: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface BloodRequest {
  id: string;
  requester_id: string;
  patient_name: string;
  blood_type: BloodType;
  units_needed: number;
  urgency_level: UrgencyLevel;
  hospital_name: string;
  hospital_address: string;
  hospital_location?: { lat: number; lng: number };
  contact_number: string;
  additional_info?: string;
  status: RequestStatus;
  expires_at: string;
  matched_donors_count: number;
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  request_id?: string;
  blood_type: BloodType;
  donation_date: string;
  location: string;
  units_donated: number;
  status: DonationStatus;
  notes?: string;
  verified_by?: string;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
}

export interface BloodDrive {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  address: string;
  location_point?: { lat: number; lng: number };
  expected_donors: number;
  registered_donors: number;
  contact_phone?: string;
  contact_email?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  request_id: string;
  donor_id: string;
  distance_km?: number;
  compatibility_score?: number;
  donor_response: 'pending' | 'accepted' | 'declined';
  responded_at?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  data?: any;
  is_read: boolean;
  created_at: string;
}