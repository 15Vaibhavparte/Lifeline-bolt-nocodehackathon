import { supabase, Match } from '../lib/supabase';
import { donorService } from './donorService';
import { notificationService } from './notificationService';

export const matchingService = {
  // Create matches for a blood request
  async createMatches(requestId: string, bloodType: string, hospitalLat: number, hospitalLon: number) {
    try {
      // Find compatible donors
      const compatibleDonors = await donorService.findCompatibleDonors(
        bloodType as any,
        hospitalLat,
        hospitalLon,
        50 // 50km radius
      );

      if (!compatibleDonors || compatibleDonors.length === 0) {
        return [];
      }

      // Create match records
      const matches = compatibleDonors.map((donor: any) => ({
        request_id: requestId,
        donor_id: donor.donor_id,
        distance_km: donor.distance_km,
        compatibility_score: this.calculateCompatibilityScore(donor),
        donor_response: 'pending' as const,
      }));

      const { data, error } = await supabase
        .from('matches')
        .insert(matches)
        .select();

      if (error) throw error;

      // Send notifications to matched donors
      for (const donor of compatibleDonors) {
        await notificationService.createNotification({
          user_id: donor.user_id,
          title: 'Blood Request Match Found',
          message: `A ${bloodType} blood request matches your profile. Distance: ${donor.distance_km.toFixed(1)}km`,
          type: 'blood_request',
          data: { requestId, donorId: donor.donor_id },
        });
      }

      return data;
    } catch (error) {
      console.error('Error creating matches:', error);
      throw error;
    }
  },

  // Calculate compatibility score based on various factors
  calculateCompatibilityScore(donor: any): number {
    let score = 100;

    // Distance factor (closer is better)
    if (donor.distance_km > 20) score -= 20;
    else if (donor.distance_km > 10) score -= 10;
    else if (donor.distance_km > 5) score -= 5;

    // Donation history factor (more donations is better)
    if (donor.total_donations >= 10) score += 10;
    else if (donor.total_donations >= 5) score += 5;

    // Recent donation factor (not too recent)
    if (donor.last_donation_date) {
      const daysSinceLastDonation = Math.floor(
        (new Date().getTime() - new Date(donor.last_donation_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastDonation < 56) score -= 30; // Less than 8 weeks
      else if (daysSinceLastDonation < 84) score -= 10; // Less than 12 weeks
    }

    return Math.max(0, Math.min(100, score));
  },

  // Get matches for a blood request
  async getMatchesForRequest(requestId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        donors (
          *,
          profiles (
            first_name,
            last_name,
            phone,
            city,
            state
          )
        )
      `)
      .eq('request_id', requestId)
      .order('compatibility_score', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update donor response to a match
  async updateDonorResponse(matchId: string, response: 'accepted' | 'declined') {
    const { data, error } = await supabase
      .from('matches')
      .update({
        donor_response: response,
        responded_at: new Date().toISOString(),
      })
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;

    // If accepted, notify the requester
    if (response === 'accepted' && data) {
      const { data: requestData } = await supabase
        .from('blood_requests')
        .select('requester_id, patient_name')
        .eq('id', data.request_id)
        .single();

      if (requestData) {
        await notificationService.createNotification({
          user_id: requestData.requester_id,
          title: 'Donor Found!',
          message: `A donor has accepted your blood request for ${requestData.patient_name}`,
          type: 'donor_accepted',
          data: { matchId, requestId: data.request_id },
        });
      }
    }

    return data;
  },

  // Get matches for a donor
  async getMatchesForDonor(donorId: string) {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        blood_requests (
          *,
          profiles (
            first_name,
            last_name,
            phone
          )
        )
      `)
      .eq('donor_id', donorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};