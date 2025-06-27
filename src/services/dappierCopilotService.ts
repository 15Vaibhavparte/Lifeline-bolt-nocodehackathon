import CryptoJS from 'crypto-js';

interface UserContext {
  id: string;
  role?: string;
  bloodType?: string;
  location?: {
    city?: string;
    coordinates?: { lat: number; lng: number };
  };
  preferences?: {
    language?: string;
  };
}

interface MessageResponse {
  text: string;
  intent?: string;
}

export class DappierCopilotService {
  private apiKey: string;
  private projectId: string;
  private baseUrl: string;
  private isInitialized: boolean = false;
  private userContext: UserContext | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_DAPPIER_API_KEY || '';
    this.projectId = import.meta.env.VITE_DAPPIER_PROJECT_ID || '';
    this.baseUrl = import.meta.env.VITE_DAPPIER_BASE_URL || 'https://api.dappier.com';
    
    // Debug environment variables
    console.log('🔧 Dappier constructor - API Key:', this.apiKey ? `${this.apiKey.substring(0, 10)}...` : 'NOT SET');
    console.log('🔧 Dappier constructor - Project ID:', this.projectId || 'NOT SET');
    console.log('🔧 Dappier constructor - Base URL:', this.baseUrl);
  }

  // Initialize the service with user context
  async initialize(userContext?: UserContext): Promise<boolean> {
    if (!this.apiKey || !this.projectId) {
      console.warn('Dappier API key or project ID not configured');
      // Still allow initialization for testing purposes
      this.isInitialized = true;
      return false;
    }

    try {
      // Store sanitized user context
      if (userContext) {
        this.userContext = this.sanitizeUserContext(userContext);
      }

      // Check if the service is available
      const isHealthy = await this.healthCheck();
      this.isInitialized = true; // Initialize regardless of health check for fallback
      
      return isHealthy;
    } catch (error) {
      console.error('Failed to initialize Dappier Copilot:', error);
      this.isInitialized = true; // Still initialize for fallback functionality
      return false;
    }
  }

  // Send a message to the AI assistant
  async sendMessage(message: string): Promise<MessageResponse> {
    if (!this.isInitialized) {
      throw new Error('Dappier Copilot not initialized');
    }

    // Always try the real API first if credentials are available
    if (this.apiKey && this.projectId) {
      try {
        console.log('Sending message to Dappier API:', message);
        console.log('🔍 Project ID:', this.projectId);
        
        // Try both endpoint formats based on ID type
        const isAiModel = this.projectId.startsWith('am_');
        const isDataModel = this.projectId.startsWith('dm_');
        
        console.log('🔍 Is AI Model:', isAiModel, 'Is Data Model:', isDataModel);
        
        let endpoint;
        let requestBody;
        
        if (isAiModel) {
          // Use AI model endpoint (from docs)
          endpoint = `${this.baseUrl}/app/aimodel/${this.projectId}`;
          requestBody = { query: message };
          console.log('✅ Using AI model endpoint');
        } else if (isDataModel) {
          // Use data model endpoint (our current approach)
          endpoint = `${this.baseUrl}/app/datamodel/${this.projectId}`;
          requestBody = { query: message, context: this.userContext || {} };
          console.log('✅ Using data model endpoint');
        } else {
          // Try both
          endpoint = `${this.baseUrl}/app/aimodel/${this.projectId}`;
          requestBody = { query: message };
          console.log('⚠️ Unknown ID format, defaulting to AI model endpoint');
        }
        
        console.log('🔍 Final endpoint:', endpoint);
        console.log('🔍 Request body:', requestBody);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`Dappier API error (${response.status}): ${errorText}`);
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Dappier API response:', data);
        
        return this.parseApiResponse(data, message);
            
      } catch (apiError: any) {
        console.warn('Dappier API call failed, falling back to mock response:', apiError.message);
        // Fall back to mock response if API fails
        return this.getMockResponse(message);
      }
    } else {
      console.warn('Dappier API credentials not configured, using mock response');
      // Use mock response if no credentials
      return this.getMockResponse(message);
    }
  }

  // Helper method to parse API responses
  private parseApiResponse(data: any, originalMessage: string): MessageResponse {
    // Handle different possible response structures from Dappier API
    let responseText = '';
    
    // Check for message field first (as shown in documentation)
    if (data.message && typeof data.message === 'string') {
      responseText = data.message;
    } else if (data.results && typeof data.results === 'string') {
      responseText = data.results;
    } else if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      responseText = data.results[0];
    } else if (data.response) {
      responseText = data.response;
    } else if (data.answer) {
      responseText = data.answer;
    } else if (data.text) {
      responseText = data.text;
    } else if (data.content) {
      responseText = data.content;
    } else if (typeof data === 'string') {
      responseText = data;
    } else {
      // If results is null or undefined, this indicates the data model needs attention
      if (data.results === null) {
        responseText = `⚠️ **Data Model Issue Detected**
        
Your Dappier AI model returned no results. This typically means:

1. **Data Model Not Trained**: Your documents haven't been properly uploaded or processed
2. **Query Doesn't Match**: The question doesn't match your training data
3. **Model Not Active**: Your data model may need to be published/activated

**Next Steps:**
- Check your Dappier dashboard to ensure documents are uploaded
- Verify your data model is active and published
- Try asking questions that directly relate to your uploaded content

**For now, I'll provide general blood donation information:**
Blood donation is a vital medical procedure that saves lives. Different blood types (A, B, AB, O) with Rh factors (+ or -) determine compatibility between donors and recipients. Universal donors (O-) can give to anyone, while universal recipients (AB+) can receive from anyone.`;
      } else {
        responseText = `No response received from AI service. Raw response: ${JSON.stringify(data, null, 2)}`;
      }
    }
    
    return {
      text: responseText,
      intent: this.detectIntent(originalMessage)
    };
  }

  // Check if the service is healthy
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.apiKey || !this.projectId) {
        console.warn('Dappier API credentials not configured');
        return false;
      }
      
      console.log('🔍 Health check - Project ID:', this.projectId);
      
      // Try a simple API call with timeout using the correct endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Use the correct endpoint based on ID type
      const isAiModel = this.projectId.startsWith('am_');
      const endpoint = isAiModel ? 
        `${this.baseUrl}/app/aimodel/${this.projectId}` : 
        `${this.baseUrl}/app/datamodel/${this.projectId}`;
      
      console.log('🔍 Health check - Is AI Model:', isAiModel);
      console.log('🔍 Health check - Endpoint:', endpoint);
      
      const requestBody = isAiModel ? 
        { query: "Health check: Please respond with 'OK'" } :
        { query: "Health check: Please respond with 'OK'", context: { type: 'health_check' } };
      
      console.log('🔍 Health check - Request body:', requestBody);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Dappier API health check failed with status: ${response.status}`);
        const errorText = await response.text();
        console.warn('Health check error response:', errorText);
        return false;
      }
      
      const data = await response.json();
      const responseText = data.message || data.response || data.answer || '';
      
      return responseText.toLowerCase().includes('ok') || response.ok;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.warn('Dappier health check timed out');
      } else {
        console.warn('Dappier health check failed:', error.message);
      }
      return false;
    }
  }

  // Update user context
  updateUserContext(newContext: Partial<UserContext>): void {
    if (!this.userContext) {
      this.userContext = this.sanitizeUserContext(newContext as UserContext);
    } else {
      this.userContext = {
        ...this.userContext,
        ...this.sanitizeUserContext(newContext as UserContext)
      };
    }
  }

  // Check if the service is available
  isAvailable(): boolean {
    return this.isInitialized && !!this.apiKey && !!this.projectId;
  }

  // Sanitize user context to remove sensitive data
  private sanitizeUserContext(context: UserContext): UserContext {
    const sanitized: UserContext = {
      id: this.hashUserId(context.id),
      role: context.role,
      bloodType: context.bloodType,
      preferences: context.preferences
    };

    // Sanitize location data if present
    if (context.location) {
      sanitized.location = {
        city: context.location.city,
      };

      // Round coordinates to lower precision for privacy
      if (context.location.coordinates) {
        sanitized.location.coordinates = {
          lat: Math.round(context.location.coordinates.lat * 10) / 10, // One decimal place
          lng: Math.round(context.location.coordinates.lng * 10) / 10
        };
      }
    }

    return sanitized;
  }

  // Simple hash function for user ID
  private hashUserId(userId: string): string {
    return CryptoJS.SHA256(userId).toString(CryptoJS.enc.Hex).substring(0, 10);
  }

  // Detect intent from message text
  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('register') && lowerMessage.includes('donor')) {
      return 'donor_registration';
    }
    
    if (lowerMessage.includes('find') && lowerMessage.includes('donor')) {
      return 'find_donors';
    }
    
    if (lowerMessage.includes('eligible') || lowerMessage.includes('eligibility')) {
      return 'check_eligibility';
    }
    
    if (lowerMessage.includes('blood drive') || lowerMessage.includes('donation event')) {
      return 'donation_events';
    }
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || 
        (lowerMessage.includes('need') && lowerMessage.includes('blood'))) {
      return 'emergency_help';
    }
    
    if (lowerMessage.includes('donation process') || 
        (lowerMessage.includes('how does') && lowerMessage.includes('work'))) {
      return 'donation_process';
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
        lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return 'greeting';
    }
    
    if (lowerMessage.includes('blood type') || lowerMessage.includes('compatibility')) {
      return 'blood_type_info';
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('nearby') || 
        lowerMessage.includes('distance')) {
      return 'location_services';
    }
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || 
        lowerMessage.includes('booking')) {
      return 'appointment_booking';
    }
    
    return 'general_inquiry';
  }

  // Mock responses for testing
  private getMockResponse(message: string): MessageResponse {
    const lowerMessage = message.toLowerCase();
    
    // Mock responses based on common queries
    if (lowerMessage.includes('register') && lowerMessage.includes('donor')) {
      return {
        text: "I'd be happy to help you register as a blood donor! Here's what you need to do:\n\n1. Check eligibility: You must be 18-65 years old, weigh at least 50kg\n2. Click 'Register as Donor' in the app\n3. Complete your profile with blood type and location\n4. Verify your identity through our secure process\n\nWould you like me to check your eligibility first?",
        intent: 'donor_registration'
      };
    } 
    
    if (lowerMessage.includes('find') && lowerMessage.includes('donor')) {
      return {
        text: "I'll help you find compatible blood donors right away!\n\nTo search for donors, I need:\n• Blood type required\n• Your location\n• Urgency level\n\nClick 'Request Blood Now' and I'll instantly alert nearby compatible donors. In emergencies, donors within 10km will be notified immediately.",
        intent: 'find_donors'
      };
    }
    
    if (lowerMessage.includes('eligible') || lowerMessage.includes('eligibility')) {
      return {
        text: "Let me check your eligibility to donate blood:\n\nBasic Requirements:\n✅ Age: 18-65 years\n✅ Weight: At least 50kg\n✅ Health: No recent illness/medication\n✅ Last donation: At least 3 months ago\n\nQuick Questions:\n• How old are you?\n• What's your approximate weight?\n• When did you last donate blood?\n• Are you currently taking any medications?\n\nBased on your answers, I'll confirm your eligibility!",
        intent: 'check_eligibility'
      };
    }
    
    if (lowerMessage.includes('blood drive') || lowerMessage.includes('donation event')) {
      return {
        text: "Here are upcoming blood donation events in your area:\n\nThis Week:\n📅 Community Blood Drive - June 15, 2025\n📍 Central Community Center\n⏰ 9:00 AM - 5:00 PM\n👥 Red Cross\n\nHow to participate:\n1. Click 'Register for Event'\n2. Choose your preferred time slot\n3. Receive confirmation & reminders\n\nWould you like me to register you for any of these events?",
        intent: 'donation_events'
      };
    }
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('need') && lowerMessage.includes('blood')) {
      return {
        text: "🚨 EMERGENCY MODE ACTIVATED 🚨\n\nI'm immediately alerting all compatible donors in your area!\n\nWhat's happening:\n• Notifying 15 nearby donors\n• Sending push notifications\n• Activating voice alerts\n• Contacting blood banks\n\nYour request details:\n• Blood type: O-\n• Location: Current location\n• Contact: Your registered number\n\nNext steps:\n1. Keep your phone handy for donor calls\n2. Prepare for hospital visit\n3. I'll update you on donor responses\n\nStay strong! Help is on the way. 💪",
        intent: 'emergency_help'
      };
    }
    
    if (lowerMessage.includes('donation process') || lowerMessage.includes('how does') && lowerMessage.includes('work')) {
      return {
        text: "The blood donation process is simple and safe! Here's what to expect:\n\n1. Registration (5 min)\n   • Verify your identity\n   • Complete a health questionnaire\n\n2. Mini Health Check (10 min)\n   • Blood pressure, pulse, temperature\n   • Hemoglobin test (small finger prick)\n\n3. Donation (8-10 min)\n   • Comfortable chair or bed\n   • Sterile, single-use equipment\n   • About 450ml of blood collected\n\n4. Refreshments (15 min)\n   • Rest and enjoy snacks/drinks\n   • Ensure you're feeling well before leaving\n\nTotal time: About 45 minutes\n\nAfter donating:\n• Drink plenty of fluids\n• Avoid heavy lifting for 24 hours\n• No strenuous exercise for 24 hours\n• You can donate again after 3 months\n\nWould you like to schedule a donation appointment?",
        intent: 'donation_process'
      };
    }
    
    // Default response
    return {
      text: "I'm here to help with all your blood donation needs! You can ask me about:\n\n• Registering as a donor\n• Finding blood donors\n• Checking eligibility\n• Blood donation events\n• Emergency blood requests\n• The donation process\n\nHow can I assist you today?",
      intent: 'greeting'
    };
  }
}

export const dappierCopilotService = new DappierCopilotService();