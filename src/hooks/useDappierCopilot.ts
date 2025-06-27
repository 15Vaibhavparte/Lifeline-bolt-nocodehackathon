import { useState, useEffect, useCallback } from 'react';
import { dappierCopilotService } from '../services/dappierCopilotService';
import { useAuthContext } from '../contexts/AuthContext';

export function useDappierCopilot() {
  const { user, profile } = useAuthContext();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize the copilot when user data is available
  useEffect(() => {
    initializeCopilot();
  }, [user, profile]);

  // Initialize the copilot with user context
  const initializeCopilot = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create user context from profile data if available
      const userContext = user && profile ? {
        id: user.id,
        role: profile?.role,
        bloodType: profile?.blood_type,
        location: {
          city: profile?.city || 'Unknown',
          coordinates: profile?.location ? {
            lat: profile.location.lat,
            lng: profile.location.lng
          } : undefined
        },
        preferences: {
          language: 'en' // Default to English
        }
      } : {
        id: 'guest-user',
        role: 'guest',
        preferences: {
          language: 'en'
        }
      };
      
      const initialized = await dappierCopilotService.initialize(userContext);
      setIsInitialized(initialized);
      setIsAvailable(dappierCopilotService.isAvailable());
      
      // Check health status
      const healthy = await dappierCopilotService.healthCheck();
      setIsHealthy(healthy);
      
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Dappier Copilot');
      console.error('Dappier Copilot initialization error:', err);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Send a message to the copilot
  const sendMessage = useCallback(async (message: string) => {
    if (!isInitialized) {
      setError('Dappier Copilot not initialized');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await dappierCopilotService.sendMessage(message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to send message to Dappier Copilot');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  // Update user context
  const updateContext = useCallback((newContext: any) => {
    dappierCopilotService.updateUserContext(newContext);
  }, []);

  // Check health status
  const checkHealth = useCallback(async () => {
    try {
      const healthy = await dappierCopilotService.healthCheck();
      setIsHealthy(healthy);
      return healthy;
    } catch (err: any) {
      setError(err.message || 'Health check failed');
      return false;
    }
  }, []);

  return {
    isInitialized,
    isAvailable,
    isHealthy,
    loading,
    error,
    sendMessage,
    updateContext,
    checkHealth,
    reinitialize: initializeCopilot
  };
}