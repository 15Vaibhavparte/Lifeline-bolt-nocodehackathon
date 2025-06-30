// Direct Gemini AI Service for Production (No Backend Server Needed)
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

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

class GeminiAIDirectService {
  private genAI: GoogleGenerativeAI | null = null;
  private supabase: any = null;
  private model: any = null;

  constructor() {
    // Initialize Gemini AI
    const apiKey = import.meta.env.VITE_GOOGLE_AI_KEY;
    if (!apiKey) {
      console.error('Google AI API key not found');
      return;
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Initialize Supabase client
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Send a chat message to Gemini AI directly
   */
  async sendMessage(
    message: string, 
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    try {
      if (!this.model) {
        throw new Error('Gemini AI not initialized');
      }

      // Build conversation history for Gemini
      const prompt = this.buildPrompt(message, history);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Check if this is a blood-related query and try to fetch real data
      const functionCalls = await this.processFunctionCalls(message);

      return {
        success: true,
        message: text,
        functionCalls: functionCalls.length > 0 ? functionCalls : undefined,
        conversationHistory: [...history, 
          { role: 'user', content: message },
          { role: 'assistant', content: text }
        ]
      };

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
   * Build prompt with context for blood donation
   */
  private buildPrompt(message: string, history: ChatMessage[]): string {
    let prompt = `You are an AI assistant for a blood donation platform called "Lifeline". You help with:
- Finding compatible blood donors
- Locating blood drives
- Emergency blood requests
- Blood type compatibility information
- Medical guidance for blood donation

Previous conversation:
${history.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Current question: ${message}

Please provide helpful, accurate information about blood donation. If this is an emergency request, prioritize urgency and provide clear action steps.`;

    return prompt;
  }

  /**
   * Process potential function calls based on the message content
   */
  private async processFunctionCalls(message: string): Promise<Array<{name: string, response: any}>> {
    const functionCalls: Array<{name: string, response: any}> = [];

    // Check for blood donor search
    if (message.toLowerCase().includes('find') && 
        (message.toLowerCase().includes('donor') || message.toLowerCase().includes('blood'))) {
      const donors = await this.findCompatibleDonorsFromDB(message);
      if (donors) {
        functionCalls.push({
          name: 'findCompatibleDonors',
          response: donors
        });
      }
    }

    // Check for blood drives search
    if (message.toLowerCase().includes('blood drive') || 
        message.toLowerCase().includes('drive')) {
      const drives = await this.findBloodDrivesFromDB(message);
      if (drives) {
        functionCalls.push({
          name: 'findBloodDrives',
          response: drives
        });
      }
    }

    return functionCalls;
  }

  /**
   * Find compatible donors from Supabase
   */
  private async findCompatibleDonorsFromDB(query: string): Promise<any> {
    if (!this.supabase) return null;

    try {
      // Extract blood type from query (simple regex)
      const bloodTypeMatch = query.match(/\b(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)\b/i);
      
      if (bloodTypeMatch) {
        const bloodType = bloodTypeMatch[0].toUpperCase();
        
        const { data, error } = await this.supabase
          .from('donors')
          .select('*')
          .eq('blood_type', bloodType)
          .eq('is_available', true)
          .limit(10);

        if (error) {
          console.error('Supabase query error:', error);
          return null;
        }

        return {
          bloodType,
          donors: data || [],
          count: data?.length || 0
        };
      }
    } catch (error) {
      console.error('Error finding donors:', error);
    }

    return null;
  }

  /**
   * Find blood drives from Supabase
   */
  private async findBloodDrivesFromDB(_query: string): Promise<any> {
    if (!this.supabase) return null;

    try {
      const { data, error } = await this.supabase
        .from('blood_drives')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Supabase query error:', error);
        return null;
      }

      return {
        drives: data || [],
        count: data?.length || 0
      };
    } catch (error) {
      console.error('Error finding blood drives:', error);
    }

    return null;
  }

  /**
   * Register emergency request
   */
  async registerEmergencyRequest(request: EmergencyRequest): Promise<any> {
    if (!this.supabase) {
      return this.sendMessage(`EMERGENCY: I need to register an urgent blood request for ${request.bloodType} blood at ${request.hospitalName}. This is a ${request.urgency} priority request.`);
    }

    try {
      const { data, error } = await this.supabase
        .from('emergency_requests')
        .insert([{
          blood_type: request.bloodType,
          hospital_name: request.hospitalName,
          contact_info: request.contactInfo,
          urgency: request.urgency,
          units_needed: request.unitsNeeded || 1,
          status: 'active',
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        console.error('Error registering emergency request:', error);
        return { success: false, error: error.message };
      }

      return {
        success: true,
        requestId: data[0]?.id,
        message: `Emergency request registered successfully. Request ID: ${data[0]?.id}`
      };
    } catch (error) {
      console.error('Error in registerEmergencyRequest:', error);
      return { success: false, error: 'Failed to register emergency request' };
    }
  }

  /**
   * Test the connection (direct mode doesn't need backend)
   */
  async testConnection(): Promise<boolean> {
    try {
      return !!this.model && !!this.genAI;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Test database connection
   */
  async testDatabase(): Promise<boolean> {
    if (!this.supabase) return false;

    try {
      const { error } = await this.supabase
        .from('donors')
        .select('count', { count: 'exact', head: true });

      return !error;
    } catch (error) {
      console.error('Database test failed:', error);
      return false;
    }
  }
}

// Export a singleton instance for direct mode
export const geminiAIDirect = new GeminiAIDirectService();

// Also export the original interface for compatibility
export const geminiAI = geminiAIDirect;

// Re-export utility functions
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
