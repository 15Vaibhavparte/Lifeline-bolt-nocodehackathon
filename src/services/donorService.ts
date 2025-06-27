import { supabase, Donor, BloodType, AvailabilityStatus } from '../lib/supabase';

export const donorService = {
  // Search donors by various criteria
  async searchDonors(filters: {
    bloodType?: BloodType;
    city?: string;
    state?: string;
    maxDistance?: number;
    userLat?: number;
    userLon?: number;
    isEligible?: boolean;
  }) {
    let query = supabase
      .from('donors')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          city,
          state,
          location,
          gender,
          is_verified
        )
      `)
      .eq('availability_status', 'available');
    
    if (filters.bloodType) {
      query = query.eq('blood_type', filters.bloodType);
    }
    
    if (filters.isEligible !== undefined) {
      query = query.eq('is_eligible', filters.isEligible);
    }
    
    if (filters.city) {
      query = query.eq('profiles.city', filters.city);
    }
    
    if (filters.state) {
      query = query.eq('profiles.state', filters.state);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // If location filtering is requested and we have coordinates
    if (data && filters.userLat && filters.userLon && filters.maxDistance) {
      return data.filter(donor => {
        if (!donor.profiles?.location) return false;
        
        // Simple distance calculation (this is a mock implementation)
        const donorLat = donor.profiles.location.lat || 0;
        const donorLon = donor.profiles.location.lng || 0;
        
        const distance = Math.sqrt(
          Math.pow(filters.userLat! - donorLat, 2) + 
          Math.pow(filters.userLon! - donorLon, 2)
        ) * 111; // Rough conversion to kilometers
        
        return distance <= filters.maxDistance;
      });
    }
    
    return data;
  },

  // Create donor profile
  async createDonorProfile(donorData: Omit<Donor, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('donors')
      .insert([donorData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get donor by user ID
  async getDonorByUserId(userId: string) {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          city,
          state,
          location
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update donor availability
  async updateAvailability(donorId: string, status: AvailabilityStatus) {
    const { data, error } = await supabase
      .from('donors')
      .update({ availability_status: status })
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Find compatible donors for a blood request
  async findCompatibleDonors(
    bloodType: BloodType,
    hospitalLat: number,
    hospitalLon: number,
    maxDistance: number = 50
  ) {
    const { data, error } = await supabase
      .rpc('find_compatible_donors', {
        request_blood_type: bloodType,
        hospital_lat: hospitalLat,
        hospital_lon: hospitalLon,
        max_distance_km: maxDistance,
      });

    if (error) throw error;
    return data;
  },

  // Get donor donation history
  async getDonationHistory(donorId: string) {
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        blood_requests (
          patient_name,
          hospital_name
        )
      `)
      .eq('donor_id', donorId)
      .order('donation_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update donor profile
  async updateDonorProfile(donorId: string, updates: Partial<Donor>) {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', donorId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get donor statistics
  async getDonorStats(donorId: string) {
    const { data: donations, error } = await supabase
      .from('donations')
      .select('*')
      .eq('donor_id', donorId)
      .eq('status', 'completed');

    if (error) throw error;

    const totalDonations = donations?.length || 0;
    const totalUnits = donations?.reduce((sum, donation) => sum + donation.units_donated, 0) || 0;
    const livesImpacted = totalUnits * 3; // Estimate 3 lives per unit

    return {
      totalDonations,
      totalUnits,
      livesImpacted,
      lastDonation: donations?.[0]?.donation_date,
    };
  },
};