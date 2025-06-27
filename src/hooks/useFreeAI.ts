import { useState, useCallback } from 'react';
import { emergencyMatchingService } from '../services/emergencyMatchingService';
import { freeAIMatchingService } from '../services/freeAIMatchingService';
import { BloodType } from '../lib/supabase';

interface MatchingResult {
  matchesFound: number;
  estimatedResponseTime: number;
  topMatches: any[];
  processingTime: number;
  aiProvider: string;
}

export function useFreeAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<any>(null);

  // Check which AI services are available
  const checkServices = useCallback(async () => {
    try {
      const services = await freeAIMatchingService.checkAvailableServices();
      setAvailableServices(services);
      return services;
    } catch (error) {
      console.error('Failed to check AI services:', error);
      return { googleAI: false, openAI: false, ollama: false };
    }
  }, []);

  // Find matches using free AI stack
  const findMatches = useCallback(async (requestData: {
    bloodType: BloodType;
    urgencyLevel: 'normal' | 'high' | 'critical';
    hospitalLat: number;
    hospitalLon: number;
    requestId: string;
    patientName: string;
    unitsNeeded: number;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const startTime = Date.now();
      console.log('🆓 Starting free AI matching stack...');
      
      // Check available services first
      if (!availableServices) {
        await checkServices();
      }
      
      const matchingResult = await emergencyMatchingService.processEmergencyRequest(requestData);
      
      const totalTime = Date.now() - startTime;
      console.log(`⚡ Free AI matching completed in ${totalTime}ms using ${matchingResult.aiProvider}`);
      
      setResult(matchingResult);
      return matchingResult;
      
    } catch (err: any) {
      const errorMessage = err.message || 'AI matching failed';
      setError(errorMessage);
      console.error('Free AI matching error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [availableServices, checkServices]);

  // Test AI services individually
  const testAIService = useCallback(async (service: 'google' | 'openai' | 'ollama') => {
    try {
      console.log(`🧪 Testing ${service} AI service...`);
      
      const testResult = await freeAIMatchingService.findOptimalMatches(
        'O+',
        'normal',
        19.0760, // Mumbai coordinates
        72.8777,
        3 // Small test
      );
      
      console.log(`✅ ${service} test successful:`, testResult);
      return { success: true, provider: testResult.provider };
      
    } catch (error) {
      console.error(`❌ ${service} test failed:`, error);
      return { success: false, error: error.message };
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    findMatches,
    testAIService,
    checkServices,
    loading,
    result,
    error,
    availableServices,
    reset,
  };
}