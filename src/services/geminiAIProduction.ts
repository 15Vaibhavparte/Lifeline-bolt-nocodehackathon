// Production-Ready Gemini AI Service with Automatic Fallback
import { geminiAI as backendService } from './geminiAI';

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

class ProductionGeminiService {
  private useDirectMode = false;
  private directService: any = null;

  constructor() {
    this.checkConnection();
  }

  /**
   * Check if backend is available, otherwise switch to direct mode
   */
  private async checkConnection() {
    try {
      const isBackendAvailable = await backendService.testConnection();
      if (!isBackendAvailable) {
        console.log('🔄 Backend unavailable, switching to direct mode for production...');
        this.useDirectMode = true;
        const { geminiAIDirect } = await import('./geminiAIDirect');
        this.directService = geminiAIDirect;
      }
    } catch (error) {
      console.log('🔄 Backend error, enabling direct mode...', error);
      this.useDirectMode = true;
      const { geminiAIDirect } = await import('./geminiAIDirect');
      this.directService = geminiAIDirect;
    }
  }

  /**
   * Get the appropriate service (backend or direct)
   */
  private async getService() {
    if (this.useDirectMode) {
      if (!this.directService) {
        const { geminiAIDirect } = await import('./geminiAIDirect');
        this.directService = geminiAIDirect;
      }
      return this.directService;
    }
    return backendService;
  }

  /**
   * Send a chat message
   */
  async sendMessage(
    message: string, 
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    const service = await this.getService();
    return service.sendMessage(message, history);
  }

  /**
   * Find compatible donors
   */
  async findCompatibleDonors(query: BloodMatchingQuery): Promise<any> {
    const service = await this.getService();
    return service.findCompatibleDonors(query);
  }

  /**
   * Find blood drives
   */
  async findBloodDrives(location: string, startDate?: string, endDate?: string): Promise<any> {
    const service = await this.getService();
    return service.findBloodDrives(location, startDate, endDate);
  }

  /**
   * Register emergency request
   */
  async registerEmergencyRequest(request: EmergencyRequest): Promise<any> {
    const service = await this.getService();
    return service.registerEmergencyRequest(request);
  }

  /**
   * Test connection
   */
  async testConnection(): Promise<boolean> {
    const service = await this.getService();
    return service.testConnection();
  }

  /**
   * Test database connection
   */
  async testDatabase(): Promise<boolean> {
    const service = await this.getService();
    return service.testDatabase();
  }

  /**
   * Get current mode for debugging
   */
  getCurrentMode(): string {
    return this.useDirectMode ? 'Direct Mode (Production)' : 'Backend Mode (Development)';
  }
}

// Export singleton
export const geminiAIProduction = new ProductionGeminiService();

// Export utility functions
export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = typeof bloodTypes[number];

export const urgencyLevels = ['low', 'medium', 'high', 'critical'] as const;
export type UrgencyLevel = typeof urgencyLevels[number];

export function isValidBloodType(bloodType: string): bloodType is BloodType {
  return bloodTypes.includes(bloodType as BloodType);
}

export function isValidUrgencyLevel(urgency: string): urgency is UrgencyLevel {
  return urgencyLevels.includes(urgency as UrgencyLevel);
}

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
