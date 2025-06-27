import { BloodType, UrgencyLevel } from '../lib/supabase';

interface DappierResponse {
  response: string | { text: string } | any;
}

export class DappierService {
  private apiKey: string;
  private dataModelId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_DAPPIER_API_KEY || '';
    this.dataModelId = import.meta.env.VITE_DAPPIER_PROJECT_ID || '';
    this.baseUrl = import.meta.env.VITE_DAPPIER_BASE_URL || 'https://api.dappier.com';
  }

  // Helper method to extract text from response
  private extractResponseText(response: any): string {
    if (typeof response === 'string') {
      return response;
    }
    
    if (response && typeof response === 'object') {
      // Try common response field names
      if (typeof response.text === 'string') {
        return response.text;
      }
      if (typeof response.content === 'string') {
        return response.content;
      }
      if (typeof response.message === 'string') {
        return response.message;
      }
      if (typeof response.answer === 'string') {
        return response.answer;
      }
      if (typeof response.result === 'string') {
        return response.result;
      }
      
      // If it's an object but no known text field, stringify it
      return JSON.stringify(response);
    }
    
    // Fallback to string conversion
    return String(response || '');
  }

  // Query the Dappier AI model
  async queryAI(prompt: string, context?: any): Promise<string> {
    try {
      if (!this.apiKey || !this.dataModelId) {
        throw new Error('Dappier API key or data model ID not configured');
      }

      const endpoint = `${this.baseUrl}/app/datamodel/${this.dataModelId}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query: prompt,
          context: context || {}
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Dappier API error (${response.status}): ${errorText}`);
      }

      const data = await response.json() as DappierResponse;
      
      // Extract text from the response using the helper method
      const responseText = this.extractResponseText(data.response);
      
      return responseText;
    } catch (error: any) {
      console.error('Dappier AI query failed:', error);
      throw new Error(`Failed to query Dappier AI: ${error.message}`);
    }
  }

  // Check if the Dappier service is healthy
  async healthCheck(): Promise<boolean> {
    try {
      // First check if we have the required configuration
      if (!this.apiKey || !this.dataModelId) {
        console.warn('Dappier API credentials not configured');
        return false;
      }

      // Try a simple health check query with shorter timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const endpoint = `${this.baseUrl}/app/datamodel/${this.dataModelId}`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            query: "Health check: Please respond with 'OK' if you're working properly.",
            context: { type: 'health_check' }
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.warn(`Dappier API health check failed with status: ${response.status}`);
          return false;
        }

        const data = await response.json() as DappierResponse;
        const responseText = this.extractResponseText(data.response);
        
        return responseText.toLowerCase().includes('ok');
      } catch (fetchError: any) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.warn('Dappier API health check timed out');
        } else {
          console.warn('Dappier API health check network error:', fetchError.message);
        }
        return false;
      }
    } catch (error: any) {
      console.error('Dappier health check failed:', error);
      return false;
    }
  }

  // Debug method to test API connectivity
  async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('Testing Dappier API connection...');
      console.log('API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'Not configured');
      console.log('Project ID:', this.dataModelId || 'Not configured');
      console.log('Base URL:', this.baseUrl);

      if (!this.apiKey || !this.dataModelId) {
        return {
          success: false,
          error: 'API credentials not configured',
          details: { 
            hasApiKey: !!this.apiKey, 
            hasProjectId: !!this.dataModelId 
          }
        };
      }

      const endpoint = `${this.baseUrl}/app/datamodel/${this.dataModelId}`;
      console.log('Endpoint:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          query: "Test connection",
          context: { type: 'connection_test' }
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        return {
          success: false,
          error: `API returned ${response.status}: ${errorText}`,
          details: { status: response.status, errorText }
        };
      }

      const data = await response.json();
      console.log('Success response:', data);

      return {
        success: true,
        details: data
      };
    } catch (error: any) {
      console.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        details: { 
          name: error.name,
          stack: error.stack
        }
      };
    }
  }

  // Get donor eligibility assessment
  async assessDonorEligibility(donorData: {
    age: number;
    weight: number;
    lastDonationDate?: string;
    medicalHistory: string[];
    medications: string[];
    lifestyle: {
      smoking: boolean;
      alcohol: string;
      exercise: string;
    };
  }): Promise<{
    eligible: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
    waitPeriod?: number;
    reasoning: string[];
  }> {
    const prompt = `
      Assess blood donation eligibility for donor with the following profile:
      
      Demographics:
      - Age: ${donorData.age} years
      - Weight: ${donorData.weight} kg
      - Last donation: ${donorData.lastDonationDate || 'Never'}
      
      Medical History: ${donorData.medicalHistory.join(', ')}
      Current Medications: ${donorData.medications.join(', ')}
      
      Lifestyle:
      - Smoking: ${donorData.lifestyle.smoking ? 'Yes' : 'No'}
      - Alcohol consumption: ${donorData.lifestyle.alcohol}
      - Exercise level: ${donorData.lifestyle.exercise}
      
      Please provide:
      1. Eligibility assessment (eligible/not eligible)
      2. Risk level (low/medium/high)
      3. Specific recommendations
      4. Required waiting period if applicable
      5. Detailed medical reasoning
      
      Consider FDA, WHO, and AABB guidelines for blood donation eligibility.
    `;

    try {
      const response = await this.queryAI(prompt, { type: 'eligibility_assessment' });
      
      // Parse the response to extract structured data
      // This is a simplified parsing - in a real app, you'd want more robust parsing
      const eligible = response.toLowerCase().includes('eligible') && !response.toLowerCase().includes('not eligible');
      
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      if (response.toLowerCase().includes('low risk')) riskLevel = 'low';
      if (response.toLowerCase().includes('high risk')) riskLevel = 'high';
      
      // Extract recommendations (lines starting with - or • or numbers)
      const recommendations = response
        .split('\n')
        .filter(line => /^[-•\d]/.test(line.trim()))
        .map(line => line.replace(/^[-•\d\s]+/, '').trim());
      
      // Extract reasoning
      const reasoningSection = response.split('Reasoning:')[1] || response.split('Medical reasoning:')[1] || '';
      const reasoning = reasoningSection
        ? reasoningSection.split('\n').filter(line => line.trim().length > 0).map(line => line.trim())
        : ['Based on standard blood donation guidelines'];
      
      return {
        eligible,
        riskLevel,
        recommendations,
        waitPeriod: eligible ? 0 : 90, // Default 90 days if not eligible
        reasoning
      };
    } catch (error) {
      console.error('Eligibility assessment failed:', error);
      throw error;
    }
  }

  // Intelligent donor matching
  async intelligentDonorMatching(requestData: {
    bloodType: BloodType;
    urgencyLevel: UrgencyLevel;
    hospitalLocation: { lat: number; lon: number };
    patientAge?: number;
    medicalCondition?: string;
    unitsNeeded: number;
    timeOfDay?: string;
    weatherConditions?: string;
  }): Promise<{
    matches: any[];
    reasoning: string[];
    confidence: number;
    estimatedResponseTime: number;
  }> {
    const prompt = `
      INTELLIGENT BLOOD DONOR MATCHING REQUEST:
      
      Patient Requirements:
      - Blood Type Needed: ${requestData.bloodType}
      - Urgency Level: ${requestData.urgencyLevel}
      - Units Required: ${requestData.unitsNeeded}
      - Patient Age: ${requestData.patientAge || 'Not specified'}
      - Medical Condition: ${requestData.medicalCondition || 'Not specified'}
      
      Context:
      - Hospital Location: ${requestData.hospitalLocation.lat}, ${requestData.hospitalLocation.lon}
      - Time of Day: ${requestData.timeOfDay || new Date().toLocaleTimeString()}
      - Weather: ${requestData.weatherConditions || 'Normal'}
      
      Please provide intelligent donor matching considering:
      1. Blood type compatibility and urgency
      2. Geographic proximity and travel time
      3. Donor availability and response patterns
      4. Time-sensitive factors (traffic, weather)
      5. Medical urgency and patient condition
      
      Return structured analysis with confidence scores and reasoning.
    `;

    try {
      const response = await this.queryAI(prompt, { 
        type: 'donor_matching',
        urgency: requestData.urgencyLevel
      });
      
      // Mock response parsing - in a real app, you'd parse the AI response
      return {
        matches: [
          { id: 'donor1', score: 95, distance: 2.3, estimatedTime: 15 },
          { id: 'donor2', score: 87, distance: 3.1, estimatedTime: 22 },
          { id: 'donor3', score: 82, distance: 4.5, estimatedTime: 30 }
        ],
        reasoning: [
          'Blood type compatibility is optimal',
          'Geographic proximity allows for quick response',
          'Donor availability matches urgency level'
        ],
        confidence: 0.92,
        estimatedResponseTime: 20
      };
    } catch (error) {
      console.error('Donor matching failed:', error);
      throw error;
    }
  }

  // Emergency response coordination
  async emergencyResponseCoordination(emergencyData: {
    bloodType: BloodType;
    unitsNeeded: number;
    patientCondition: string;
    hospitalCapacity: number;
    nearbyHospitals: any[];
    availableDonors: any[];
    trafficConditions: string;
    timeConstraints: number;
  }): Promise<{
    strategy: string;
    prioritizedActions: string[];
    alternativeOptions: string[];
    timelineEstimate: number;
    riskAssessment: string;
  }> {
    const prompt = `
      EMERGENCY BLOOD COORDINATION SCENARIO:
      
      Patient Needs:
      - Blood Type: ${emergencyData.bloodType}
      - Units Required: ${emergencyData.unitsNeeded}
      - Medical Condition: ${emergencyData.patientCondition}
      - Time Constraint: ${emergencyData.timeConstraints} minutes
      
      Resources Available:
      - Hospital Capacity: ${emergencyData.hospitalCapacity}% 
      - Nearby Hospitals: ${emergencyData.nearbyHospitals.length || 0}
      - Available Donors: ${emergencyData.availableDonors.length || 0}
      - Traffic Conditions: ${emergencyData.trafficConditions}
      
      Provide emergency coordination strategy including:
      1. Optimal response strategy
      2. Prioritized action sequence
      3. Alternative backup options
      4. Realistic timeline estimate
      5. Risk assessment and mitigation
      
      Consider medical urgency, logistics, and resource optimization.
    `;

    try {
      const response = await this.queryAI(prompt, { 
        type: 'emergency_coordination',
        urgency: 'critical'
      });
      
      // Extract strategy from response
      const strategy = response.split('\n')[0];
      
      // Extract prioritized actions (lines starting with numbers or bullets)
      const prioritizedActions = response
        .split('\n')
        .filter(line => /^\d+\.|\-|\•/.test(line.trim()))
        .map(line => line.replace(/^\d+\.|\-|\•\s*/, '').trim())
        .slice(0, 5);
      
      // Mock the rest of the response structure
      return {
        strategy,
        prioritizedActions,
        alternativeOptions: [
          'Contact blood banks for emergency release',
          'Activate hospital backup reserves',
          'Request emergency transport from neighboring facilities'
        ],
        timelineEstimate: emergencyData.timeConstraints * 0.8,
        riskAssessment: 'Medium risk with contingency plans in place'
      };
    } catch (error) {
      console.error('Emergency coordination failed:', error);
      throw error;
    }
  }

  // Predictive blood demand
  async predictBloodDemand(analyticsData: {
    historicalData: any[];
    seasonalFactors: string;
    localEvents: string[];
    weatherForecast: string;
    hospitalSchedules: any[];
    demographicTrends: any;
  }): Promise<{
    demandForecast: {
      bloodType: BloodType;
      predictedDemand: number;
      confidence: number;
    }[];
    recommendations: string[];
    riskFactors: string[];
    optimalInventoryLevels: any;
  }> {
    const prompt = `
      BLOOD SUPPLY DEMAND PREDICTION:
      
      Seasonal Factors: ${analyticsData.seasonalFactors}
      Upcoming Events: ${analyticsData.localEvents.join(', ')}
      Weather Forecast: ${analyticsData.weatherForecast}
      
      Analyze and predict:
      1. Blood demand by type for next 30 days
      2. Peak demand periods
      3. Supply recommendations
      4. Risk factors and mitigation strategies
      5. Optimal inventory levels
      
      Consider seasonal patterns, local events, weather impact, and medical procedures.
    `;

    try {
      const response = await this.queryAI(prompt, { type: 'demand_prediction' });
      
      // Mock response structure
      return {
        demandForecast: [
          { bloodType: 'O+', predictedDemand: 120, confidence: 0.85 },
          { bloodType: 'A+', predictedDemand: 85, confidence: 0.82 },
          { bloodType: 'B+', predictedDemand: 45, confidence: 0.78 },
          { bloodType: 'AB+', predictedDemand: 20, confidence: 0.75 },
          { bloodType: 'O-', predictedDemand: 40, confidence: 0.88 },
          { bloodType: 'A-', predictedDemand: 25, confidence: 0.80 },
          { bloodType: 'B-', predictedDemand: 15, confidence: 0.76 },
          { bloodType: 'AB-', predictedDemand: 10, confidence: 0.72 }
        ],
        recommendations: [
          'Increase O+ and O- collection drives',
          'Schedule additional donor sessions before festival period',
          'Focus on donor retention for rare blood types',
          'Implement emergency response protocol during peak demand'
        ],
        riskFactors: [
          'Seasonal flu may reduce donor availability',
          'Festival season increases accident rates',
          'Weather conditions may affect donor turnout',
          'Scheduled surgeries will increase demand for AB blood types'
        ],
        optimalInventoryLevels: {
          'O+': 150,
          'A+': 100,
          'B+': 60,
          'AB+': 30,
          'O-': 50,
          'A-': 35,
          'B-': 25,
          'AB-': 15
        }
      };
    } catch (error) {
      console.error('Demand prediction failed:', error);
      throw error;
    }
  }

  // Personalized donor engagement
  async personalizedDonorEngagement(donorProfile: {
    donationHistory: any[];
    preferences: any;
    demographics: any;
    responsePatterns: any;
    motivations: string[];
  }): Promise<{
    engagementStrategy: string;
    personalizedMessages: string[];
    optimalContactTiming: string;
    incentiveRecommendations: string[];
    retentionRisk: number;
  }> {
    const prompt = `
      DONOR ENGAGEMENT OPTIMIZATION:
      
      Donor Profile:
      - Donation History: ${JSON.stringify(donorProfile.donationHistory || [])}
      - Motivations: ${donorProfile.motivations?.join(', ') || 'Helping others'}
      
      Develop personalized engagement strategy:
      1. Tailored communication approach
      2. Personalized messaging content
      3. Optimal contact timing and frequency
      4. Appropriate incentives and recognition
      5. Retention risk assessment
      
      Focus on donor psychology, motivation, and long-term engagement.
    `;

    try {
      const response = await this.queryAI(prompt, { type: 'donor_engagement' });
      
      // Extract engagement strategy from response
      const engagementStrategy = response.split('\n')[0];
      
      // Mock the rest of the response structure
      return {
        engagementStrategy,
        personalizedMessages: [
          'Thank you for being a lifesaver! Your recent donation helped three people in critical need.',
          'Did you know your rare blood type makes your donations especially valuable?',
          'Your consistent donations have placed you in our Gold Donor tier!'
        ],
        optimalContactTiming: 'Weekday evenings, approximately 3 days before eligibility renewal',
        incentiveRecommendations: [
          'Digital achievement badges',
          'Impact stories from recipients',
          'Community recognition events',
          'Health tracking benefits'
        ],
        retentionRisk: 0.15 // 15% risk of not returning
      };
    } catch (error) {
      console.error('Donor engagement optimization failed:', error);
      throw error;
    }
  }

  // Medical consultation
  async medicalConsultation(consultationData: {
    patientSymptoms: string[];
    medicalHistory: string;
    currentMedications: string[];
    vitalSigns?: any;
    urgencyLevel: UrgencyLevel;
    consultationType: 'pre_donation' | 'post_donation' | 'emergency';
  }): Promise<{
    assessment: string;
    recommendations: string[];
    urgencyLevel: UrgencyLevel;
    referralNeeded: boolean;
    followUpRequired: boolean;
    disclaimers: string[];
  }> {
    const prompt = `
      MEDICAL CONSULTATION REQUEST:
      
      Patient Information:
      - Symptoms: ${consultationData.patientSymptoms.join(', ')}
      - Medical History: ${consultationData.medicalHistory}
      - Current Medications: ${consultationData.currentMedications.join(', ')}
      - Vital Signs: ${JSON.stringify(consultationData.vitalSigns || {})}
      - Consultation Type: ${consultationData.consultationType}
      - Reported Urgency: ${consultationData.urgencyLevel}
      
      Provide medical guidance including:
      1. Clinical assessment
      2. Specific recommendations
      3. Urgency level determination
      4. Need for medical referral
      5. Follow-up requirements
      6. Important medical disclaimers
      
      IMPORTANT: This is for informational purposes only and should not replace professional medical advice.
    `;

    try {
      const response = await this.queryAI(prompt, { 
        type: 'medical_consultation',
        urgency: consultationData.urgencyLevel
      });
      
      // Extract assessment from response
      const assessment = response.split('\n')[0];
      
      // Extract recommendations (lines starting with - or • or numbers)
      const recommendations = response
        .split('\n')
        .filter(line => /^[-•\d]/.test(line.trim()))
        .map(line => line.replace(/^[-•\d\s]+/, '').trim());
      
      // Determine if referral is needed based on keywords
      const referralNeeded = response.toLowerCase().includes('see a doctor') || 
                            response.toLowerCase().includes('medical attention') ||
                            response.toLowerCase().includes('consult a healthcare');
      
      // Determine follow-up based on keywords
      const followUpRequired = response.toLowerCase().includes('follow up') || 
                              response.toLowerCase().includes('follow-up') ||
                              response.toLowerCase().includes('monitor');
      
      // Standard medical disclaimers
      const disclaimers = [
        'This information is not a substitute for professional medical advice, diagnosis, or treatment.',
        'Always seek the advice of your physician or other qualified health provider with any questions.',
        'If you think you may have a medical emergency, call your doctor or emergency services immediately.'
      ];
      
      return {
        assessment,
        recommendations,
        urgencyLevel: referralNeeded ? 'high' : consultationData.urgencyLevel,
        referralNeeded,
        followUpRequired,
        disclaimers
      };
    } catch (error) {
      console.error('Medical consultation failed:', error);
      throw error;
    }
  }
}

export const dappierService = new DappierService();