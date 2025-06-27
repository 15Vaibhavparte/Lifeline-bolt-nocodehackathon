import { supabase, BloodType } from '../lib/supabase';
import { donorService } from './donorService';

interface FreeAIMatchResult {
  donorId: string;
  confidenceScore: number;
  estimatedResponseTime: number;
  reasoning: string[];
  distance?: number;
  donationHistory?: number;
}

export class FreeAIMatchingService {
  private googleApiKey: string;
  private openaiApiKey: string;
  private ollamaEndpoint: string;

  constructor() {
    this.googleApiKey = import.meta.env.VITE_GOOGLE_AI_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.ollamaEndpoint = import.meta.env.VITE_OLLAMA_ENDPOINT || 'http://localhost:11434';
  }

  // Main free AI matching function with fallback strategy
  async findOptimalMatches(
    bloodType: BloodType,
    urgencyLevel: 'normal' | 'high' | 'critical',
    hospitalLat: number,
    hospitalLon: number,
    maxResults: number = 10
  ): Promise<{ matches: FreeAIMatchResult[], provider: string, processingTime: number }> {
    const startTime = Date.now();
    
    try {
      // 1. Get compatible donors using existing logic
      const compatibleDonors = await donorService.findCompatibleDonors(
        bloodType,
        hospitalLat,
        hospitalLon,
        50
      );

      if (!compatibleDonors || compatibleDonors.length === 0) {
        return { matches: [], provider: 'none', processingTime: Date.now() - startTime };
      }

      console.log(`🔍 Found ${compatibleDonors.length} compatible donors`);

      // 2. Try AI providers in order of preference
      let matches: FreeAIMatchResult[] = [];
      let provider = 'basic';

      // Try Google AI first (best free option)
      if (this.googleApiKey) {
        try {
          console.log('🤖 Trying Google AI (Gemini)...');
          matches = await this.useGoogleAI(compatibleDonors, urgencyLevel);
          provider = 'google-ai';
          console.log('✅ Google AI successful');
        } catch (error) {
          console.log('⚠️ Google AI failed:', error);
        }
      }

      // Try OpenAI if Google AI failed
      if (matches.length === 0 && this.openaiApiKey) {
        try {
          console.log('🤖 Trying OpenAI...');
          matches = await this.useOpenAI(compatibleDonors, urgencyLevel);
          provider = 'openai';
          console.log('✅ OpenAI successful');
        } catch (error) {
          console.log('⚠️ OpenAI failed:', error);
        }
      }

      // Try Ollama (local AI) if cloud AI failed
      if (matches.length === 0) {
        try {
          console.log('🤖 Trying Ollama (local AI)...');
          matches = await this.useOllama(compatibleDonors, urgencyLevel);
          provider = 'ollama';
          console.log('✅ Ollama successful');
        } catch (error) {
          console.log('⚠️ Ollama failed:', error);
        }
      }

      // Fallback to basic algorithm
      if (matches.length === 0) {
        console.log('🔧 Using basic algorithm fallback');
        matches = this.basicMatching(compatibleDonors, urgencyLevel);
        provider = 'basic';
      }

      const processingTime = Date.now() - startTime;
      console.log(`⚡ Matching completed in ${processingTime}ms using ${provider}`);

      return {
        matches: matches.slice(0, maxResults),
        provider,
        processingTime
      };

    } catch (error) {
      console.error('All AI matching failed:', error);
      throw error;
    }
  }

  // Google AI (Gemini) - Free tier with generous limits
  private async useGoogleAI(donors: any[], urgencyLevel: string): Promise<FreeAIMatchResult[]> {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.googleApiKey}`;
    
    const prompt = this.buildOptimizedPrompt(donors, urgencyLevel);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Google AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    return this.parseAIResponse(aiResponse, donors);
  }

  // OpenAI - $5 free credit
  private async useOpenAI(donors: any[], urgencyLevel: string): Promise<FreeAIMatchResult[]> {
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    
    const prompt = this.buildOptimizedPrompt(donors, urgencyLevel);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a blood donation matching AI. Analyze donors and return JSON rankings.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return this.parseAIResponse(aiResponse, donors);
  }

  // Ollama - 100% free local AI
  private async useOllama(donors: any[], urgencyLevel: string): Promise<FreeAIMatchResult[]> {
    const endpoint = `${this.ollamaEndpoint}/api/generate`;
    
    const prompt = this.buildSimplePrompt(donors, urgencyLevel);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2:7b',
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3,
          num_predict: 400,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Ollama not available');
    }

    const data = await response.json();
    return this.parseOllamaResponse(data.response, donors);
  }

  // Build optimized prompt for cloud AI services
  private buildOptimizedPrompt(donors: any[], urgencyLevel: string): string {
    const donorSummary = donors.slice(0, 15).map((donor, index) => 
      `${index + 1}. Distance: ${donor.distance_km}km, Donations: ${donor.total_donations}, Blood: ${donor.blood_type}, Last: ${donor.last_donation_date || 'Never'}`
    ).join('\n');

    return `
Rank blood donors for ${urgencyLevel} urgency request. Consider:
- Distance (closer = better, critical for emergency)
- Donation history (experience matters)
- Recent donations (not too recent, 56+ days ideal)
- Blood type compatibility

Donors:
${donorSummary}

Return JSON array with: donorIndex (1-based), score (0-100), estimatedMinutes, reason

Example: [{"donorIndex": 1, "score": 95, "estimatedMinutes": 25, "reason": "Close distance, experienced donor"}]

Focus on top 10 donors only.
    `;
  }

  // Build simple prompt for Ollama
  private buildSimplePrompt(donors: any[], urgencyLevel: string): string {
    const donorList = donors.slice(0, 8).map((d, i) => 
      `${i+1}. ${d.distance_km}km, ${d.total_donations} donations`
    ).join('\n');

    return `Rank blood donors for ${urgencyLevel} request by preference (1=best):\n${donorList}\n\nRanking:`;
  }

  // Parse AI response from cloud services
  private parseAIResponse(aiResponse: string, donors: any[]): FreeAIMatchResult[] {
    try {
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const rankings = JSON.parse(jsonMatch[0]);
      
      return rankings
        .filter((ranking: any) => ranking.donorIndex && ranking.donorIndex <= donors.length)
        .map((ranking: any) => {
          const donor = donors[ranking.donorIndex - 1];
          return {
            donorId: donor.donor_id,
            confidenceScore: Math.min(100, Math.max(0, ranking.score || 50)),
            estimatedResponseTime: ranking.estimatedMinutes || 30,
            reasoning: [ranking.reason || 'AI analysis'],
            distance: donor.distance_km,
            donationHistory: donor.total_donations,
          };
        })
        .sort((a: any, b: any) => b.confidenceScore - a.confidenceScore);

    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('AI Response:', aiResponse);
      
      // Return basic ranking if parsing fails
      return this.basicMatching(donors, 'normal');
    }
  }

  // Parse Ollama response (simpler format)
  private parseOllamaResponse(response: string, donors: any[]): FreeAIMatchResult[] {
    try {
      // Extract numbers from Ollama response
      const numbers = response.match(/\d+/g);
      if (!numbers || numbers.length === 0) {
        return this.basicMatching(donors, 'normal');
      }

      const ranking = numbers.slice(0, Math.min(donors.length, 10))
        .map(n => parseInt(n) - 1)
        .filter(index => index >= 0 && index < donors.length);

      return ranking.map((index, rank) => {
        const donor = donors[index];
        const score = Math.max(20, 90 - (rank * 8));
        
        return {
          donorId: donor.donor_id,
          confidenceScore: score,
          estimatedResponseTime: 25 + (donor.distance_km * 1.5),
          reasoning: ['Local AI ranking'],
          distance: donor.distance_km,
          donationHistory: donor.total_donations,
        };
      });

    } catch (error) {
      console.error('Failed to parse Ollama response:', error);
      return this.basicMatching(donors, 'normal');
    }
  }

  // Basic algorithm fallback
  private basicMatching(donors: any[], urgencyLevel: string): FreeAIMatchResult[] {
    return donors.map((donor, index) => {
      let score = 50;
      
      // Distance scoring (0-30 points)
      const distanceScore = Math.max(0, 30 - donor.distance_km);
      score += distanceScore;
      
      // Experience scoring (0-25 points)
      const experienceScore = Math.min(25, donor.total_donations * 2.5);
      score += experienceScore;
      
      // Recent donation penalty
      if (donor.last_donation_date) {
        const daysSince = Math.floor(
          (new Date().getTime() - new Date(donor.last_donation_date).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysSince < 56) score -= 20; // Too recent
        else if (daysSince > 365) score -= 5; // Very long time
      }
      
      // Urgency bonus for experienced donors
      if (urgencyLevel === 'critical' && donor.total_donations >= 5) {
        score += 15;
      }

      // Blood type bonus for universal donors
      if (donor.blood_type === 'O-') score += 10;
      else if (donor.blood_type === 'O+') score += 5;

      const finalScore = Math.min(100, Math.max(0, score));
      const responseTime = 20 + (donor.distance_km * 1.2) + (Math.random() * 10);

      return {
        donorId: donor.donor_id,
        confidenceScore: finalScore,
        estimatedResponseTime: Math.round(responseTime),
        reasoning: ['Rule-based algorithm'],
        distance: donor.distance_km,
        donationHistory: donor.total_donations,
      };
    }).sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  // Check which AI services are available
  async checkAvailableServices(): Promise<{
    googleAI: boolean;
    openAI: boolean;
    ollama: boolean;
  }> {
    const results = {
      googleAI: !!this.googleApiKey,
      openAI: !!this.openaiApiKey,
      ollama: false,
    };

    // Test Ollama availability
    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });
      results.ollama = response.ok;
    } catch (error) {
      results.ollama = false;
    }

    return results;
  }
}

export const freeAIMatchingService = new FreeAIMatchingService();