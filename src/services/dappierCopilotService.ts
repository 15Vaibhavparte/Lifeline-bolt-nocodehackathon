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
  }

  // Initialize the service with user context
  async initialize(userContext?: UserContext): Promise<boolean> {
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isDevelopment) {
      // In development, we'll simulate the connection for testing
      console.log('Development mode: Simulating Dappier connection');
      this.isInitialized = true;
      return true;
    }
    
    if (!this.apiKey || !this.projectId) {
      console.warn('Dappier API key or project ID not configured for production');
      return false;
    }

    try {
      // Store sanitized user context
      if (userContext) {
        this.userContext = this.sanitizeUserContext(userContext);
      }

      // Check if the service is available
      const isHealthy = await this.healthCheck();
      this.isInitialized = isHealthy;
      
      return isHealthy;
    } catch (error) {
      console.error('Failed to initialize Dappier Copilot:', error);
      return false;
    }
  }

  // Send a message to the AI assistant
  async sendMessage(message: string): Promise<MessageResponse> {
    if (!this.isInitialized) {
      throw new Error('Dappier Copilot not initialized');
    }

    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    try {
      if (isDevelopment) {
        // Use mock responses in development
        return this.getMockResponse(message);
      } else {
        // Make real API call in production
        const response = await fetch(`${this.baseUrl}/app/datamodel/${this.projectId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            query: message,
            context: this.userContext
          })
        });
        
        if (!response.ok) {
          throw new Error(`Dappier API error: ${response.status}`);
        }
        
        const data = await response.json();
        return {
          text: data.response || 'No response received',
          intent: this.detectIntent(data.response || '')
        };
      }
    } catch (error: any) {
      console.error('Failed to send message to Dappier:', error);
      throw error;
    }
  }

  // Check if the service is healthy
  async healthCheck(): Promise<boolean> {
    try {
      // Check if we're in development mode
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        // Simulate health check in development
        return true;
      }
      
      // In production, make actual API call to check health
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });
      
      return response.ok;
    } catch (error) {
      console.error('Dappier health check failed:', error);
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