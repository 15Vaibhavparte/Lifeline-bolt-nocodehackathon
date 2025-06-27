import { freeAIMatchingService } from './freeAIMatchingService';
import { matchingService } from './matchingService';
import { notificationService } from './notificationService';
import { bloodRequestService } from './bloodRequestService';
import { BloodType, UrgencyLevel } from '../lib/supabase';

export class EmergencyMatchingService {
  // Main emergency matching function - the "under 30 seconds" feature
  async processEmergencyRequest(requestData: {
    bloodType: BloodType;
    urgencyLevel: UrgencyLevel;
    hospitalLat: number;
    hospitalLon: number;
    requestId: string;
    patientName: string;
    unitsNeeded: number;
  }): Promise<{
    matchesFound: number;
    estimatedResponseTime: number;
    topMatches: any[];
    processingTime: number;
    aiProvider: string;
  }> {
    const startTime = Date.now();
    
    try {
      console.log(`🚨 Processing ${requestData.urgencyLevel} blood request for ${requestData.bloodType}`);
      
      // 1. Free AI-powered matching (primary method)
      const aiResult = await freeAIMatchingService.findOptimalMatches(
        requestData.bloodType,
        requestData.urgencyLevel,
        requestData.hospitalLat,
        requestData.hospitalLon,
        requestData.urgencyLevel === 'critical' ? 20 : 10
      );

      const { matches: aiMatches, provider } = aiResult;

      // 2. Create match records in database
      if (aiMatches.length > 0) {
        const matchPromises = aiMatches.slice(0, 10).map(async (match) => {
          return this.createMatchRecord({
            request_id: requestData.requestId,
            donor_id: match.donorId,
            compatibility_score: match.confidenceScore,
            estimated_response_time: match.estimatedResponseTime,
            ai_reasoning: match.reasoning.join('; '),
            distance_km: match.distance,
          });
        });

        await Promise.all(matchPromises);
      }

      // 3. Send priority notifications based on urgency
      await this.sendPriorityNotifications(aiMatches, requestData);

      // 4. Calculate metrics
      const processingTime = Date.now() - startTime;
      const avgResponseTime = aiMatches.length > 0 
        ? aiMatches.reduce((sum, m) => sum + m.estimatedResponseTime, 0) / aiMatches.length
        : 0;

      console.log(`✅ Processed in ${processingTime}ms, found ${aiMatches.length} matches using ${provider}`);

      return {
        matchesFound: aiMatches.length,
        estimatedResponseTime: avgResponseTime,
        topMatches: aiMatches.slice(0, 5),
        processingTime,
        aiProvider: provider,
      };

    } catch (error) {
      console.error('Emergency matching failed:', error);
      
      // Fallback to basic matching
      return this.fallbackEmergencyMatching(requestData, startTime);
    }
  }

  // Create match record in database
  private async createMatchRecord(matchData: any) {
    try {
      const { data, error } = await supabase
        .from('matches')
        .insert([{
          request_id: matchData.request_id,
          donor_id: matchData.donor_id,
          compatibility_score: matchData.compatibility_score,
          distance_km: matchData.distance_km,
          donor_response: 'pending',
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create match record:', error);
      return null;
    }
  }

  // Send notifications with different priorities based on urgency
  private async sendPriorityNotifications(matches: any[], requestData: any) {
    const { urgencyLevel, patientName, bloodType, unitsNeeded } = requestData;
    
    if (matches.length === 0) {
      console.log('⚠️ No matches found for notifications');
      return;
    }
    
    // Critical: Notify top 5 immediately, then others in waves
    if (urgencyLevel === 'critical') {
      // Immediate notifications to top 5 matches
      const topMatches = matches.slice(0, 5);
      await this.sendImmediateNotifications(topMatches, requestData, 'CRITICAL');
      
      // Delayed notifications to next 10 matches (after 2 minutes if no response)
      if (matches.length > 5) {
        setTimeout(async () => {
          const nextMatches = matches.slice(5, 15);
          await this.sendImmediateNotifications(nextMatches, requestData, 'URGENT');
        }, 2 * 60 * 1000);
      }
      
    } else if (urgencyLevel === 'high') {
      // Notify top 10 immediately
      const topMatches = matches.slice(0, 10);
      await this.sendImmediateNotifications(topMatches, requestData, 'HIGH');
      
    } else {
      // Normal: Standard notifications
      const topMatches = matches.slice(0, 8);
      await this.sendStandardNotifications(topMatches, requestData);
    }
  }

  private async sendImmediateNotifications(matches: any[], requestData: any, priority: string) {
    const notifications = matches.map(match => ({
      user_id: match.donorId,
      title: `🚨 ${priority} Blood Request`,
      message: `URGENT: ${requestData.bloodType} blood needed for ${requestData.patientName}. ${requestData.unitsNeeded} units required. Distance: ${match.distance?.toFixed(1) || 'Unknown'}km`,
      type: 'emergency_blood_request',
      data: {
        requestId: requestData.requestId,
        urgencyLevel: requestData.urgencyLevel,
        priority,
        estimatedResponseTime: match.estimatedResponseTime,
        confidenceScore: match.confidenceScore,
      },
    }));

    try {
      await notificationService.createBulkNotifications(notifications);
      console.log(`📱 Sent ${notifications.length} ${priority} notifications`);
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
    
    // Also trigger push notifications, SMS, etc. for critical requests
    if (priority === 'CRITICAL') {
      await this.triggerMultiChannelAlerts(matches, requestData);
    }
  }

  private async sendStandardNotifications(matches: any[], requestData: any) {
    const notifications = matches.map(match => ({
      user_id: match.donorId,
      title: 'Blood Donation Request',
      message: `${requestData.bloodType} blood needed for ${requestData.patientName}. You're a compatible match!`,
      type: 'blood_request',
      data: {
        requestId: requestData.requestId,
        urgencyLevel: requestData.urgencyLevel,
        estimatedResponseTime: match.estimatedResponseTime,
      },
    }));

    try {
      await notificationService.createBulkNotifications(notifications);
      console.log(`📱 Sent ${notifications.length} standard notifications`);
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
  }

  private async triggerMultiChannelAlerts(matches: any[], requestData: any) {
    // In a real implementation, integrate with:
    // - Push notification services (Firebase, OneSignal)
    // - SMS services (Twilio, AWS SNS)
    // - Email services (SendGrid, AWS SES)
    // - Voice call services for critical cases
    
    console.log(`🚨 Triggering multi-channel alerts for ${matches.length} top donors`);
    
    // Example: SMS integration
    // await smsService.sendBulkSMS(matches, requestData);
    
    // Example: Push notifications
    // await pushService.sendCriticalAlert(matches, requestData);
  }

  private async fallbackEmergencyMatching(requestData: any, startTime: number) {
    console.log('🔄 Falling back to basic matching algorithm');
    
    try {
      // Use existing basic matching as fallback
      const basicMatches = await matchingService.createMatches(
        requestData.requestId,
        requestData.bloodType,
        requestData.hospitalLat,
        requestData.hospitalLon
      );

      const processingTime = Date.now() - startTime;
      
      return {
        matchesFound: basicMatches?.length || 0,
        estimatedResponseTime: 45, // Default estimate
        topMatches: basicMatches?.slice(0, 5) || [],
        processingTime,
        aiProvider: 'fallback',
      };
    } catch (error) {
      console.error('Fallback matching also failed:', error);
      
      const processingTime = Date.now() - startTime;
      return {
        matchesFound: 0,
        estimatedResponseTime: 0,
        topMatches: [],
        processingTime,
        aiProvider: 'none',
      };
    }
  }

  // Real-time monitoring of match responses
  async monitorMatchResponses(requestId: string) {
    // Set up real-time subscription to match responses
    const subscription = supabase
      .channel(`matches:${requestId}`)
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'matches',
          filter: `request_id=eq.${requestId}`
        }, 
        (payload) => {
          console.log('Match response received:', payload);
          this.handleMatchResponse(payload.new);
        }
      )
      .subscribe();

    return subscription;
  }

  private async handleMatchResponse(matchData: any) {
    if (matchData.donor_response === 'accepted') {
      console.log('✅ Donor accepted! Notifying requester...');
      
      // Notify requester immediately
      try {
        const request = await bloodRequestService.getRequestById(matchData.request_id);
        if (request) {
          await notificationService.createNotification({
            user_id: request.requester_id,
            title: '🎉 Donor Found!',
            message: `A donor has accepted your blood request for ${request.patient_name}`,
            type: 'donor_accepted',
            data: { matchId: matchData.id, requestId: matchData.request_id },
          });
        }
      } catch (error) {
        console.error('Failed to notify requester:', error);
      }
    }
  }
}

export const emergencyMatchingService = new EmergencyMatchingService();