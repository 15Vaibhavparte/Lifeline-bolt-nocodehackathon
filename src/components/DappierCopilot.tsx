import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  AlertCircle, 
  CheckCircle, 
  Loader,
  X,
  Settings
} from 'lucide-react';
import { useDappierCopilot } from '../hooks/useDappierCopilot';

interface DappierCopilotProps {
  className?: string;
}

export function DappierCopilot({ className = '' }: DappierCopilotProps) {
  const { 
    isInitialized, 
    isAvailable, 
    isHealthy, 
    loading, 
    error, 
    checkHealth,
    reinitialize 
  } = useDappierCopilot();

  const [showStatus, setShowStatus] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem('dappier_consent');
    if (consent) {
      const consentData = JSON.parse(consent);
      setHasConsent(consentData.aiAssistant === true);
    } else {
      // Only show consent dialog in production or when explicitly testing
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (!isDevelopment) {
        setShowConsentDialog(true);
      } else {
        // Auto-consent in development for easier testing
        setHasConsent(true);
      }
    }
  }, []);

  const handleConsent = (granted: boolean) => {
    const consentData = {
      aiAssistant: granted,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem('dappier_consent', JSON.stringify(consentData));
    setHasConsent(granted);
    setShowConsentDialog(false);

    if (granted) {
      reinitialize();
    }
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600 bg-blue-100';
    if (error) return 'text-red-600 bg-red-100';
    if (isInitialized && isHealthy) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStatusIcon = () => {
    if (loading) return Loader;
    if (error) return AlertCircle;
    if (isInitialized && isHealthy) return CheckCircle;
    return Brain;
  };

  const StatusIcon = getStatusIcon();

  // Don't render if user hasn't consented
  if (!hasConsent && !showConsentDialog) {
    return null;
  }

  return (
    <>
      {/* Consent Dialog */}
      <AnimatePresence>
        {showConsentDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-strong"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant Privacy</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Our AI assistant helps you with blood donation queries and emergency requests. 
                We process your data to provide personalized assistance while maintaining your privacy.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-blue-900 mb-2">What we collect:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your role (donor/recipient)</li>
                  <li>• Blood type (for matching)</li>
                  <li>• General location (city only)</li>
                  <li>• Conversation history (30 days)</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleConsent(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Accept & Continue
                </button>
                <button
                  onClick={() => handleConsent(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                  Decline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copilot Widget Container */}
      {hasConsent && (
        <div className={`${className}`}>
          {/* Status Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowStatus(!showStatus)}
              className={`p-2 rounded-lg transition-colors ${getStatusColor()}`}
              title="AI Assistant Status"
            >
              <StatusIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Status Dropdown */}
            <AnimatePresence>
              {showStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full mb-2 right-0 bg-white rounded-lg shadow-medium border border-gray-200 p-4 w-64 z-10"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">AI Assistant Status</h4>
                    <button
                      onClick={() => setShowStatus(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Connection:</span>
                      <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Health:</span>
                      <span className={`text-sm font-medium ${isHealthy ? 'text-green-600' : 'text-yellow-600'}`}>
                        {isHealthy ? 'Operational' : 'Degraded'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`text-sm font-medium ${
                        error ? 'text-red-600' : isInitialized ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {error ? 'Error' : isInitialized ? 'Ready' : 'Initializing'}
                      </span>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        checkHealth();
                        reinitialize();
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Refresh Connection
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Dappier Copilot Container */}
          <div id="dappier-copilot" className="fixed bottom-4 right-4 z-50"></div>
        </div>
      )}
    </>
  );
}