import { useState, useCallback } from 'react';
import { dappierService } from '../services/dappierService';
import { BloodType, UrgencyLevel } from '../lib/supabase';

export function useDappierAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const intelligentMatching = useCallback(async (requestData: {
    bloodType: BloodType;
    urgencyLevel: UrgencyLevel;
    hospitalLocation: { lat: number; lon: number };
    patientAge?: number;
    medicalCondition?: string;
    unitsNeeded: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.intelligentDonorMatching({
        ...requestData,
        timeOfDay: new Date().toLocaleTimeString(),
        weatherConditions: 'Normal' // Could integrate with weather API
      });

      return result;
    } catch (err: any) {
      setError(err.message || 'AI matching failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const assessEligibility = useCallback(async (donorData: {
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
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.assessDonorEligibility(donorData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Eligibility assessment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const emergencyCoordination = useCallback(async (emergencyData: {
    bloodType: BloodType;
    unitsNeeded: number;
    patientCondition: string;
    hospitalCapacity: number;
    nearbyHospitals: any[];
    availableDonors: any[];
    trafficConditions: string;
    timeConstraints: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.emergencyResponseCoordination(emergencyData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Emergency coordination failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const predictDemand = useCallback(async (analyticsData: {
    historicalData: any[];
    seasonalFactors: string;
    localEvents: string[];
    weatherForecast: string;
    hospitalSchedules: any[];
    demographicTrends: any;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.predictBloodDemand(analyticsData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Demand prediction failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeEngagement = useCallback(async (donorProfile: {
    donationHistory: any[];
    preferences: any;
    demographics: any;
    responsePatterns: any;
    motivations: string[];
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.personalizedDonorEngagement(donorProfile);
      return result;
    } catch (err: any) {
      setError(err.message || 'Engagement optimization failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const medicalConsultation = useCallback(async (consultationData: {
    patientSymptoms: string[];
    medicalHistory: string;
    currentMedications: string[];
    vitalSigns?: any;
    urgencyLevel: UrgencyLevel;
    consultationType: 'pre_donation' | 'post_donation' | 'emergency';
  }) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dappierService.medicalConsultation(consultationData);
      return result;
    } catch (err: any) {
      setError(err.message || 'Medical consultation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const isHealthy = await dappierService.healthCheck();
      return isHealthy;
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      return false;
    }
  }, []);

  return {
    loading,
    error,
    intelligentMatching,
    assessEligibility,
    emergencyCoordination,
    predictDemand,
    optimizeEngagement,
    medicalConsultation,
    checkHealth
  };
}