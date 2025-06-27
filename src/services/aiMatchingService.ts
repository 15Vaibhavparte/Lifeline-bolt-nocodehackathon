import { supabase, BloodType } from '../lib/supabase';
import { donorService } from './donorService';
import { notificationService } from './notificationService';

interface MatchingFeatures {
  bloodTypeCompatibility: number;
  distance: number;
  donationHistory: number;
  availability: number;
  responseTime: number;
  reliability: number;
  urgencyMatch: number;
  timeOfDay: number;
  weatherConditions?: number;
  trafficConditions?: number;
}

interface AIMatchResult {
  donorId: string;
  confidenceScore: number;
  estimatedResponseTime: number;
  features: MatchingFeatures;
  reasoning: string[];
}

export class AIMatchingService {
  private apiKey: string;
  private modelEndpoint: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_AI_API_KEY || '';
    this.modelEndpoint = import.meta.env.VITE_AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';
  }

  // Main AI matching function
  async findOptimalMatches(
    requestId: string,
    bloodType: BloodType,
    urgencyLevel: 'normal' | 'high' | 'critical',
    hospitalLat: number,
    hospitalLon: number,
    maxResults: number = 10
  ): Promise<AIMatchResult[]> {
    try {
      // 1. Get initial compatible donors using existing logic
      const compatibleDonors = await donorService.findCompatibleDonors(
        bloodType,
        hospitalLat,
        hospitalLon,
        100 // Wider search radius for AI processing
      );

      if (!compatibleDonors || compatibleDonors.length === 0) {
        return [];
      }

      // 2. Extract features for each donor
      const donorFeatures = await Promise.all(
        compatibleDonors.map(donor => this.extractDonorFeatures(donor, urgencyLevel, hospitalLat, hospitalLon))
      );

      // 3. Use AI model for intelligent matching
      const aiResults = await this.runAIMatching(donorFeatures, urgencyLevel);

      // 4. Sort by AI confidence score and return top matches
      return aiResults
        .sort((a, b) => b.confidenceScore - a.confidenceScore)
        .slice(0, maxResults);

    } catch (error) {
      console.error('AI matching failed, falling back to basic matching:', error);
      // Fallback to basic matching
      return this.fallbackMatching(compatibleDonors, urgencyLevel);
    }
  }

  // Extract comprehensive features for AI model
  private async extractDonorFeatures(
    donor: any,
    urgencyLevel: string,
    hospitalLat: number,
    hospitalLon: number
  ): Promise<{ donorId: string; features: MatchingFeatures }> {
    
    // Get donor's historical response data
    const responseHistory = await this.getDonorResponseHistory(donor.donor_id);
    
    // Calculate various features
    const features: MatchingFeatures = {
      // Blood compatibility (0-1)
      bloodTypeCompatibility: this.calculateBloodCompatibility(donor.blood_type, urgencyLevel),
      
      // Distance factor (0-1, closer = higher score)
      distance: Math.max(0, 1 - (donor.distance_km / 50)),
      
      // Donation history score (0-1)
      donationHistory: Math.min(1, donor.total_donations / 20),
      
      // Current availability (0-1)
      availability: donor.availability_status === 'available' ? 1 : 0,
      
      // Historical response time (0-1, faster = higher)
      responseTime: this.calculateResponseTimeScore(responseHistory),
      
      // Reliability score based on past commitments (0-1)
      reliability: this.calculateReliabilityScore(responseHistory),
      
      // Urgency match (how well donor responds to urgent requests)
      urgencyMatch: this.calculateUrgencyMatchScore(responseHistory, urgencyLevel),
      
      // Time of day factor (0-1)
      timeOfDay: this.calculateTimeOfDayScore(),
    };

    return { donorId: donor.donor_id, features };
  }

  // AI model integration
  private async runAIMatching(
    donorFeatures: { donorId: string; features: MatchingFeatures }[],
    urgencyLevel: string
  ): Promise<AIMatchResult[]> {
    
    const prompt = this.buildAIPrompt(donorFeatures, urgencyLevel);
    
    try {
      const response = await fetch(this.modelEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an AI system specialized in blood donor-recipient matching. 
                       Analyze donor features and provide confidence scores (0-100) for optimal matching.
                       Consider urgency, distance, reliability, and response patterns.
                       Return JSON array with donorId, confidenceScore, estimatedResponseTime, and reasoning.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);
      
      return aiResponse.map((result: any) => ({
        donorId: result.donorId,
        confidenceScore: result.confidenceScore,
        estimatedResponseTime: result.estimatedResponseTime,
        features: donorFeatures.find(d => d.donorId === result.donorId)?.features || {},
        reasoning: result.reasoning || [],
      }));

    } catch (error) {
      console.error('AI API call failed:', error);
      throw error;
    }
  }

  // Build AI prompt with donor data
  private buildAIPrompt(
    donorFeatures: { donorId: string; features: MatchingFeatures }[],
    urgencyLevel: string
  ): string {
    return `
      Analyze these blood donors for optimal matching:
      
      Urgency Level: ${urgencyLevel}
      Current Time: ${new Date().toISOString()}
      
      Donors:
      ${donorFeatures.map((donor, index) => `
        Donor ${index + 1} (ID: ${donor.donorId}):
        - Blood Compatibility: ${donor.features.bloodTypeCompatibility}
        - Distance Score: ${donor.features.distance}
        - Donation History: ${donor.features.donationHistory}
        - Availability: ${donor.features.availability}
        - Response Time Score: ${donor.features.responseTime}
        - Reliability Score: ${donor.features.reliability}
        - Urgency Match Score: ${donor.features.urgencyMatch}
        - Time of Day Score: ${donor.features.timeOfDay}
      `).join('\n')}
      
      Please rank these donors and provide:
      1. Confidence score (0-100) for successful donation
      2. Estimated response time in minutes
      3. Key reasoning factors
      
      Consider:
      - Urgency level affects weight of response time vs distance
      - Historical patterns predict future behavior
      - Time of day affects availability
      - Reliability is crucial for critical requests
    `;
  }

  // Helper methods for feature calculation
  private calculateBloodCompatibility(donorType: string, urgencyLevel: string): number {
    // Universal donors get higher scores for urgent requests
    if (donorType === 'O-') return urgencyLevel === 'critical' ? 1.0 : 0.9;
    if (donorType === 'O+') return urgencyLevel === 'critical' ? 0.9 : 0.8;
    return 0.7; // Same type compatibility
  }

  private calculateResponseTimeScore(responseHistory: any[]): number {
    if (!responseHistory.length) return 0.5; // Default for new donors
    
    const avgResponseTime = responseHistory.reduce((sum, r) => sum + r.responseTimeMinutes, 0) / responseHistory.length;
    return Math.max(0, 1 - (avgResponseTime / 120)); // 2 hours = 0 score
  }

  private calculateReliabilityScore(responseHistory: any[]): number {
    if (!responseHistory.length) return 0.5;
    
    const commitmentRate = responseHistory.filter(r => r.fulfilled).length / responseHistory.length;
    return commitmentRate;
  }

  private calculateUrgencyMatchScore(responseHistory: any[], currentUrgency: string): number {
    const urgentResponses = responseHistory.filter(r => r.urgencyLevel === 'critical' || r.urgencyLevel === 'high');
    if (urgentResponses.length === 0) return currentUrgency === 'normal' ? 0.7 : 0.3;
    
    const urgentSuccessRate = urgentResponses.filter(r => r.fulfilled).length / urgentResponses.length;
    return urgentSuccessRate;
  }

  private calculateTimeOfDayScore(): number {
    const hour = new Date().getHours();
    // Higher scores during typical waking hours
    if (hour >= 8 && hour <= 20) return 1.0;
    if (hour >= 6 && hour <= 22) return 0.7;
    return 0.3; // Late night/early morning
  }

  // Get donor's historical response data
  private async getDonorResponseHistory(donorId: string): Promise<any[]> {
    const { data } = await supabase
      .from('matches')
      .select(`
        donor_response,
        responded_at,
        created_at,
        blood_requests (
          urgency_level,
          created_at
        )
      `)
      .eq('donor_id', donorId)
      .not('responded_at', 'is', null);

    return (data || []).map(match => ({
      responseTimeMinutes: match.responded_at ? 
        (new Date(match.responded_at).getTime() - new Date(match.created_at).getTime()) / (1000 * 60) : 
        null,
      fulfilled: match.donor_response === 'accepted',
      urgencyLevel: match.blood_requests?.urgency_level,
    }));
  }

  // Fallback to basic matching if AI fails
  private fallbackMatching(compatibleDonors: any[], urgencyLevel: string): AIMatchResult[] {
    return compatibleDonors.map(donor => ({
      donorId: donor.donor_id,
      confidenceScore: this.calculateBasicScore(donor, urgencyLevel),
      estimatedResponseTime: this.estimateBasicResponseTime(donor),
      features: {} as MatchingFeatures,
      reasoning: ['Fallback to basic algorithm due to AI service unavailability'],
    }));
  }

  private calculateBasicScore(donor: any, urgencyLevel: string): number {
    let score = 50;
    
    // Distance factor
    score += Math.max(0, 30 - donor.distance_km);
    
    // Donation history
    score += Math.min(20, donor.total_donations * 2);
    
    // Urgency bonus for experienced donors
    if (urgencyLevel === 'critical' && donor.total_donations >= 5) {
      score += 15;
    }
    
    return Math.min(100, score);
  }

  private estimateBasicResponseTime(donor: any): number {
    // Basic estimation based on distance and donation history
    const baseTime = 30; // 30 minutes base
    const distanceTime = donor.distance_km * 2; // 2 minutes per km
    const experienceBonus = Math.max(0, 10 - donor.total_donations); // Experienced donors respond faster
    
    return baseTime + distanceTime + experienceBonus;
  }
}

export const aiMatchingService = new AIMatchingService();