import { supabase, BloodDrive } from '../lib/supabase';

export const bloodDriveService = {
  // Search blood drives with more detailed filters
  async searchBloodDrives(filters: {
    city?: string;
    state?: string;
    date?: string;
    dateRange?: { start: string; end: string };
    organizer?: string;
    maxDistance?: number;
    userLat?: number;
    userLon?: number;
  }) {
    try {
      let query = supabase
        .from('blood_drives')
        .select(`
          *,
          profiles (
            first_name,
            last_name,
            phone,
            email
          ),
          blood_drive_registrations (
            count
          )
        `)
        .eq('is_active', true);
      
      // Apply date filters
      if (filters.date) {
        query = query.eq('event_date', filters.date);
      } else if (filters.dateRange) {
        query = query
          .gte('event_date', filters.dateRange.start)
          .lte('event_date', filters.dateRange.end);
      } else {
        // Default to future events
        query = query.gte('event_date', new Date().toISOString().split('T')[0]);
      }
      
      // Apply location filters
      if (filters.city) {
        query = query.ilike('address', `%${filters.city}%`);
      }
      
      if (filters.state) {
        query = query.ilike('address', `%${filters.state}%`);
      }
      
      // Apply organizer filter
      if (filters.organizer) {
        query = query.ilike('title', `%${filters.organizer}%`);
      }
      
      const { data, error } = await query.order('event_date', { ascending: true });
      
      if (error) {
        console.error('Supabase query error:', error);
        console.error('Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      // If location filtering is requested and we have coordinates
      if (data && filters.userLat && filters.userLon && filters.maxDistance) {
        return data.filter(drive => {
          if (!drive.location_point) return false;
          
          // Extract coordinates from point data
          // In a real app, you'd use PostGIS functions for this
          const driveLat = drive.location_point.lat || 0;
          const driveLon = drive.location_point.lng || 0;
          
          // Simple distance calculation
          const distance = Math.sqrt(
            Math.pow(filters.userLat! - driveLat, 2) + 
            Math.pow(filters.userLon! - driveLon, 2)
          ) * 111; // Rough conversion to kilometers
          
          return distance <= filters.maxDistance;
        });
      }
      
      return data;
    } catch (error: any) {
      console.error('Error in searchBloodDrives:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        name: error.name,
        stack: error.stack
      });
      
      // Check for specific error types
      if (error.message?.includes('404') || error.code === '404') {
        throw new Error('Blood drives table not found. Please check your database setup.');
      }
      
      if (error.message?.includes('JWT') || error.message?.includes('Invalid JWT')) {
        throw new Error('Authentication error. Please check your Supabase credentials.');
      }
      
      if (error.message?.includes('relation "blood_drives" does not exist')) {
        throw new Error('Blood drives table does not exist. Please run the database migrations.');
      }

      if (error.code === 'MOCK_CLIENT') {
        throw new Error('Supabase not configured. Please check your environment variables in Netlify.');
      }
      
      throw error;
    }
  },

  // Create a new blood drive
  async createBloodDrive(driveData: Omit<BloodDrive, 'id' | 'created_at' | 'updated_at' | 'registered_donors'>) {
    const { data, error } = await supabase
      .from('blood_drives')
      .insert([{ ...driveData, registered_donors: 0 }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all active blood drives
  async getActiveBloodDrives() {
    const { data, error } = await supabase
      .from('blood_drives')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Get blood drives by organizer
  async getBloodDrivesByOrganizer(organizerId: string) {
    const { data, error } = await supabase
      .from('blood_drives')
      .select('*')
      .eq('organizer_id', organizerId)
      .order('event_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get blood drive by ID
  async getBloodDriveById(driveId: string) {
    const { data, error } = await supabase
      .from('blood_drives')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          email
        ),
        blood_drive_registrations (
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
      .eq('id', driveId)
      .single();

    if (error) throw error;
    return data;
  },

  // Register donor for blood drive
  async registerForBloodDrive(driveId: string, donorId: string) {
    // Check if already registered
    const { data: existingRegistration } = await supabase
      .from('blood_drive_registrations')
      .select('id')
      .eq('drive_id', driveId)
      .eq('donor_id', donorId)
      .single();

    if (existingRegistration) {
      throw new Error('Already registered for this blood drive');
    }

    // Create registration
    const { data, error } = await supabase
      .from('blood_drive_registrations')
      .insert([{
        drive_id: driveId,
        donor_id: donorId,
      }])
      .select()
      .single();

    if (error) throw error;

    // Update registered donors count
    await this.updateRegisteredDonorsCount(driveId);

    return data;
  },

  // Cancel registration
  async cancelRegistration(driveId: string, donorId: string) {
    const { error } = await supabase
      .from('blood_drive_registrations')
      .delete()
      .eq('drive_id', driveId)
      .eq('donor_id', donorId);

    if (error) throw error;

    // Update registered donors count
    await this.updateRegisteredDonorsCount(driveId);
  },

  // Update registered donors count
  async updateRegisteredDonorsCount(driveId: string) {
    const { count } = await supabase
      .from('blood_drive_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('drive_id', driveId);

    const { error } = await supabase
      .from('blood_drives')
      .update({ registered_donors: count || 0 })
      .eq('id', driveId);

    if (error) throw error;
  },

  // Mark attendance
  async markAttendance(registrationId: string, attended: boolean) {
    const { data, error } = await supabase
      .from('blood_drive_registrations')
      .update({ attended })
      .eq('id', registrationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get donor's registrations
  async getDonorRegistrations(donorId: string) {
    const { data, error } = await supabase
      .from('blood_drive_registrations')
      .select(`
        *,
        blood_drives (
          *,
          profiles (
            first_name,
            last_name
          )
        )
      `)
      .eq('donor_id', donorId)
      .order('registered_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Search blood drives (basic filters)
  async searchBloodDrivesBasic(filters: {
    city?: string;
    date?: string;
    organizer?: string;
  }) {
    let query = supabase
      .from('blood_drives')
      .select(`
        *,
        profiles (
          first_name,
          last_name,
          phone,
          email
        )
      `)
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString().split('T')[0]);

    if (filters.city) {
      query = query.ilike('address', `%${filters.city}%`);
    }

    if (filters.date) {
      query = query.eq('event_date', filters.date);
    }

    if (filters.organizer) {
      query = query.ilike('title', `%${filters.organizer}%`);
    }

    const { data, error } = await query.order('event_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Update blood drive
  async updateBloodDrive(driveId: string, updates: Partial<BloodDrive>) {
    const { data, error } = await supabase
      .from('blood_drives')
      .update(updates)
      .eq('id', driveId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete blood drive
  async deleteBloodDrive(driveId: string) {
    const { error } = await supabase
      .from('blood_drives')
      .delete()
      .eq('id', driveId);

    if (error) throw error;
  },

  // Get past blood drives with statistics
  async getPastBloodDrives(organizerId?: string) {
    let query = supabase
      .from('blood_drives')
      .select(`
        *,
        profiles (
          first_name,
          last_name
        ),
        blood_drive_registrations (
          attended
        )
      `)
      .lt('event_date', new Date().toISOString().split('T')[0]);

    if (organizerId) {
      query = query.eq('organizer_id', organizerId);
    }

    const { data, error } = await query.order('event_date', { ascending: false });

    if (error) throw error;

    // Calculate statistics
    return data?.map(drive => ({
      ...drive,
      total_registrations: drive.blood_drive_registrations?.length || 0,
      total_attended: drive.blood_drive_registrations?.filter(reg => reg.attended).length || 0,
    }));
  },
};