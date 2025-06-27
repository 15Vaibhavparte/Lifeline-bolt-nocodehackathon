import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Lock, Shield, X } from 'lucide-react';

interface DappierConsentDialogProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function DappierConsentDialog({ onAccept, onDecline }: DappierConsentDialogProps) {
  return (
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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Lifeline AI Assistant</h3>
          </div>
          <button
            onClick={onDecline}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Our AI assistant helps you with blood donation queries, emergency requests, and personalized guidance. 
          To provide these services, we need your consent to process certain data.
        </p>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-blue-100 text-blue-600 rounded-lg mt-1">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Data We Process</h4>
              <p className="text-sm text-gray-600">
                Your role (donor/recipient), blood type, city location, and conversation history.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="p-1 bg-green-100 text-green-600 rounded-lg mt-1">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">How We Protect Your Data</h4>
              <p className="text-sm text-gray-600">
                All data is encrypted, anonymized, and stored securely. Conversations are retained for 30 days.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Your Rights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Request deletion of your data</li>
            <li>• Export your conversation history</li>
            <li>• Withdraw consent at any time</li>
            <li>• Opt out of AI processing</li>
          </ul>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onAccept}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Accept & Enable AI
          </button>
          <button
            onClick={onDecline}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Decline
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}