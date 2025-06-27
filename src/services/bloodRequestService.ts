import { supabase, BloodRequest, UrgencyLevel, BloodType } from '../lib/supabase';

export const bloodRequestService = {
  // Create a new blood request
  async createBloodRequest(requestData: Omit<BloodRequest, 'id' | 'created_at' | 'updated_at' | 'matched_donors_count'>) {
    const { data, error } = await supabase
      .from('blood_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get blood requests by requester
  async getRequestsByRequester(requesterId: string) {
    const { data, error } = await supabase
      .from('blood_requests')
      .select('*')
      .eq('requester_id', requesterId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get active blood requests
  async getActiveRequests() {
    const { data, error } = await supabase
      .from('blood_requests')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone
        )
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString())
      .order('urgency_level', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update blood request status
  async updateRequestStatus(requestId: string, status: 'active' | 'fulfilled' | 'cancelled' | 'expired') {
    const { data, error } = await supabase
      .from('blood_requests')
      .update({ status })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get blood request by ID
  async getRequestById(requestId: string) {
    const { data, error } = await supabase
      .from('blood_requests')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          email
        ),
        matches (
          *,
          donors (
            *,
            profiles (
              first_name,
              last_name,
              phone
            )
          )
        )
      `)
      .eq('id', requestId)
      .single();

    if (error) throw error;
    return data;
  },

  // Search blood requests by filters
  async searchRequests(filters: {
    bloodType?: BloodType;
    urgency?: UrgencyLevel;
    city?: string;
    maxDistance?: number;
    userLat?: number;
    userLon?: number;
  }) {
    let query = supabase
      .from('blood_requests')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          city,
          state
        )
      `)
      .eq('status', 'active')
      .gt('expires_at', new Date().toISOString());

    if (filters.bloodType) {
      query = query.eq('blood_type', filters.bloodType);
    }

    if (filters.urgency) {
      query = query.eq('urgency_level', filters.urgency);
    }

    if (filters.city) {
      query = query.ilike('hospital_address', `%${filters.city}%`);
    }

    const { data, error } = await query.order('urgency_level', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update matched donors count
  async updateMatchedDonorsCount(requestId: string, count: number) {
    const { data, error } = await supabase
      .from('blood_requests')
      .update({ matched_donors_count: count })
      .eq('id', requestId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};