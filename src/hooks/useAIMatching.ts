import { useState, useCallback } from 'react';
import { emergencyMatchingService } from '../services/emergencyMatchingService';
import { BloodType, UrgencyLevel } from '../lib/supabase';

interface MatchingResult {
  matchesFound: number;
  estimatedResponseTime: number;
  topMatches: any[];
  processingTime: number;
}

export function useAIMatching() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchingResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const findMatches = useCallback(async (requestData: {
    bloodType: BloodType;
    urgencyLevel: UrgencyLevel;
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
      console.log('🤖 Starting AI-powered matching...');
      
      const matchingResult = await emergencyMatchingService.processEmergencyRequest(requestData);
      
      const totalTime = Date.now() - startTime;
      console.log(`⚡ AI matching completed in ${totalTime}ms`);
      
      setResult(matchingResult);
      return matchingResult;
      
    } catch (err: any) {
      setError(err.message || 'AI matching failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    findMatches,
    loading,
    result,
    error,
    reset,
  };
}