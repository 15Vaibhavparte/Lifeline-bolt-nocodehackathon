// AI Service for Gemini Blood Matching Integration

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  functionCalls?: Array<{
    name: string;
    response: any;
  }>;
  conversationHistory?: any[];
  error?: string;
}

export interface EmergencyRequest {
  bloodType: string;
  hospitalName: string;
  contactInfo: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  unitsNeeded?: number;
}

export interface BloodMatchingQuery {
  requiredBloodType: string;
  hospitalLocation: string;
  urgency?: 'low' | 'medium' | 'high' | 'critical';
  maxDistance?: number;
}

class GeminiAIService {
  private baseURL: string;

  constructor(baseURL = 'http://localhost:3002/api') {
    this.baseURL = baseURL;
  }

  /**
   * Send a chat message to the Gemini AI backend
   */
  async sendMessage(
    message: string, 
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          history
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      return data;

    } catch (error) {
      console.error('Error in sendMessage:', error);
      return {
        success: false,
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Find compatible blood donors
   */
  async findCompatibleDonors(query: BloodMatchingQuery): Promise<any> {
    const message = `I need ${query.requiredBloodType} blood ${query.urgency === 'critical' ? 'urgently' : 'soon'} at ${query.hospitalLocation}. ${query.maxDistance ? `Please search within ${query.maxDistance} kilometers.` : ''}`;
    
    return this.sendMessage(message);
  }

  /**
   * Find blood drives in an area
   */
  async findBloodDrives(location: string, startDate?: string, endDate?: string): Promise<any> {
    let message = `Find blood drives in ${location}`;
    
    if (startDate && endDate) {
      message += ` between ${startDate} and ${endDate}`;
    } else if (startDate) {
      message += ` starting from ${startDate}`;
    }

    return this.sendMessage(message);
  }

  /**
   * Get blood type compatibility information
   */
  async getBloodCompatibility(bloodType: string, checkType: 'canDonateTo' | 'canReceiveFrom'): Promise<any> {
    const message = checkType === 'canDonateTo' 
      ? `What blood types can ${bloodType} donate to?`
      : `What blood types can ${bloodType} receive from?`;
    
    return this.sendMessage(message);
  }

  /**
   * Register an emergency blood request
   */
  async registerEmergencyRequest(request: EmergencyRequest): Promise<any> {
    const message = `EMERGENCY: I need to register an urgent blood request for ${request.bloodType} blood at ${request.hospitalName}. This is a ${request.urgency} priority request. ${request.unitsNeeded ? `We need ${request.unitsNeeded} units.` : ''} Contact: ${request.contactInfo}`;
    
    return this.sendMessage(message);
  }

  /**
   * Test the connection to the backend
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Test database connection
   */
  async testDatabase(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/test-db`);
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Database test failed:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const geminiAI = new GeminiAIService();

// Export utility functions
export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = typeof bloodTypes[number];

export const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;
export type UrgencyLevel = typeof urgencyLevels[number];

/**
 * Validate blood type format
 */
export function isValidBloodType(bloodType: string): bloodType is BloodType {
  return bloodTypes.includes(bloodType as BloodType);
}

/**
 * Validate urgency level
 */
export function isValidUrgencyLevel(urgency: string): urgency is UrgencyLevel {
  return urgencyLevels.includes(urgency as UrgencyLevel);
}

/**
 * Get blood type compatibility matrix (client-side fallback)
 */
export const getBloodCompatibility = (bloodType: BloodType) => {
  const compatibility = {
    'O-': { canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-'] },
    'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
    'A-': { canDonateTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
    'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
    'B-': { canDonateTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
    'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
    'AB-': { canDonateTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
    'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
  };

  return compatibility[bloodType];
};
