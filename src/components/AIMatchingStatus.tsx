import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Clock, 
  Users, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Cpu,
  Cloud,
  Server,
  Smartphone
} from 'lucide-react';

interface AIMatchingStatusProps {
  loading: boolean;
  result: {
    matchesFound: number;
    estimatedResponseTime: number;
    topMatches: any[];
    processingTime: number;
    aiProvider: string;
  } | null;
  error: string | null;
}

export function AIMatchingStatus({ loading, result, error }: AIMatchingStatusProps) {
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google-ai': return <Cloud className="h-5 w-5" />;
      case 'openai': return <Brain className="h-5 w-5" />;
      case 'ollama': return <Server className="h-5 w-5" />;
      case 'basic': return <Cpu className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google-ai': return 'Google AI (Free)';
      case 'openai': return 'OpenAI';
      case 'ollama': return 'Ollama (Local)';
      case 'basic': return 'Basic Algorithm';
      case 'fallback': return 'Fallback Mode';
      default: return 'Unknown';
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google-ai': return 'text-blue-600 bg-blue-100';
      case 'openai': return 'text-green-600 bg-green-100';
      case 'ollama': return 'text-purple-600 bg-purple-100';
      case 'basic': return 'text-gray-600 bg-gray-100';
      default: return 'text-orange-600 bg-orange-100';
    }
  };

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <div>
            <h3 className="text-lg font-semibold text-red-900">AI Matching Failed</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-1">All AI services unavailable - using basic matching</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Free AI Matching in Progress</h3>
            <p className="text-blue-700">Trying Google AI → OpenAI → Ollama → Basic Algorithm...</p>
            <div className="flex items-center space-x-2 mt-3">
              <div className="flex space-x-1">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-blue-600">Processing with free AI stack...</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (result) {
    const isUnder30Seconds = result.processingTime < 30000;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6"
      >
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-green-900">
                Free AI Matching Complete {isUnder30Seconds && '⚡'}
              </h3>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getProviderColor(result.aiProvider)}`}>
                {getProviderIcon(result.aiProvider)}
                <span>{getProviderName(result.aiProvider)}</span>
              </div>
            </div>
            
            <p className="text-green-700 mb-4">
              Found {result.matchesFound} compatible donors in {result.processingTime}ms
              {isUnder30Seconds && ' - Under 30 seconds! 🎯'}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Matches</span>
                </div>
                <div className="text-2xl font-bold text-green-800 mt-1">
                  {result.matchesFound}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Avg Response</span>
                </div>
                <div className="text-2xl font-bold text-green-800 mt-1">
                  {Math.round(result.estimatedResponseTime)}m
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Processing</span>
                </div>
                <div className="text-2xl font-bold text-green-800 mt-1">
                  {result.processingTime}ms
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">AI Cost</span>
                </div>
                <div className="text-2xl font-bold text-green-800 mt-1">
                  $0.00
                </div>
              </div>
            </div>

            {result.topMatches.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-green-900 mb-3">Top AI-Ranked Matches:</h4>
                <div className="space-y-3">
                  {result.topMatches.slice(0, 3).map((match, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">Match #{index + 1}</span>
                            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                              {Math.round(match.confidenceScore)}% confidence
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Distance: {match.distance?.toFixed(1) || 'Unknown'}km • 
                            Est. response: {Math.round(match.estimatedResponseTime)} min
                          </div>
                          {match.reasoning && (
                            <div className="text-xs text-gray-500 mt-1">
                              AI Reasoning: {match.reasoning.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Free AI Stack Status */}
            <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
              <div className="text-sm text-gray-600">
                <strong>Free AI Stack Status:</strong> Using {getProviderName(result.aiProvider)} 
                {result.aiProvider === 'google-ai' && ' (60 req/min free)'}
                {result.aiProvider === 'ollama' && ' (unlimited local)'}
                {result.aiProvider === 'basic' && ' (always available)'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}