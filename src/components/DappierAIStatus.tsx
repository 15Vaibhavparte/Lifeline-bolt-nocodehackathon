import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  TrendingUp,
  Users,
  Activity,
  Shield,
  Loader
} from 'lucide-react';
import { useDappierAI } from '../hooks/useDappierAI';

interface DappierAIStatusProps {
  showDetails?: boolean;
}

export function DappierAIStatus({ showDetails = false }: DappierAIStatusProps) {
  const { checkHealth, loading } = useDappierAI();
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    performHealthCheck();
    
    // Check health every 5 minutes
    const interval = setInterval(performHealthCheck, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const performHealthCheck = async () => {
    try {
      const healthy = await checkHealth();
      setIsHealthy(healthy);
      setLastCheck(new Date());
    } catch (error) {
      setIsHealthy(false);
      setLastCheck(new Date());
    }
  };

  const getStatusColor = () => {
    if (isHealthy === null) return 'text-gray-600 bg-gray-100';
    if (isHealthy) return 'text-green-600 bg-green-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusIcon = () => {
    if (loading) return Loader;
    if (isHealthy === null) return Brain;
    if (isHealthy) return CheckCircle;
    return AlertCircle;
  };

  const StatusIcon = getStatusIcon();

  const aiCapabilities = [
    {
      icon: Zap,
      title: 'Intelligent Matching',
      description: 'AI-powered donor-recipient matching with 95%+ accuracy',
      status: isHealthy
    },
    {
      icon: Shield,
      title: 'Medical Assessment',
      description: 'Automated donor eligibility and health screening',
      status: isHealthy
    },
    {
      icon: TrendingUp,
      title: 'Demand Prediction',
      description: 'Predictive analytics for blood supply management',
      status: isHealthy
    },
    {
      icon: Users,
      title: 'Donor Engagement',
      description: 'Personalized communication and retention strategies',
      status: isHealthy
    },
    {
      icon: Activity,
      title: 'Emergency Coordination',
      description: 'Real-time emergency response optimization',
      status: isHealthy
    }
  ];

  if (!showDetails) {
    // Compact status indicator
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center space-x-2"
      >
        <div className={`p-2 rounded-lg ${getStatusColor()}`}>
          <StatusIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </div>
        <div className="text-sm">
          <span className="font-medium">Dappier AI</span>
          <span className={`ml-2 ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
            {isHealthy === null ? 'Checking...' : isHealthy ? 'Active' : 'Offline'}
          </span>
        </div>
      </motion.div>
    );
  }

  // Detailed status panel
  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${getStatusColor()}`}>
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Dappier AI Platform</h3>
            <p className="text-sm text-gray-600">
              Advanced healthcare AI for intelligent blood donation services
            </p>
          </div>
        </div>
        
        <button
          onClick={performHealthCheck}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {/* Overall Status */}
      <div className={`mb-6 p-4 rounded-lg border-2 ${
        isHealthy === null 
          ? 'border-gray-200 bg-gray-50' 
          : isHealthy 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center space-x-3">
          <StatusIcon className={`h-6 w-6 ${
            isHealthy === null 
              ? 'text-gray-600' 
              : isHealthy 
                ? 'text-green-600' 
                : 'text-red-600'
          } ${loading ? 'animate-spin' : ''}`} />
          <div>
            <h4 className={`font-semibold ${
              isHealthy === null 
                ? 'text-gray-900' 
                : isHealthy 
                  ? 'text-green-900' 
                  : 'text-red-900'
            }`}>
              {isHealthy === null 
                ? 'Status Unknown' 
                : isHealthy 
                  ? 'AI Platform Online' 
                  : 'AI Platform Offline'
              }
            </h4>
            <p className={`text-sm ${
              isHealthy === null 
                ? 'text-gray-600' 
                : isHealthy 
                  ? 'text-green-700' 
                  : 'text-red-700'
            }`}>
              {isHealthy === null 
                ? 'Checking AI platform connectivity...' 
                : isHealthy 
                  ? 'All AI services operational and ready' 
                  : 'AI services unavailable - using fallback algorithms'
              }
            </p>
            {lastCheck && (
              <p className="text-xs text-gray-500 mt-1">
                Last checked: {lastCheck.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* AI Capabilities */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-4">AI Capabilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiCapabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  capability.status 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <capability.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{capability.title}</h5>
                  <p className="text-sm text-gray-600 mt-1">{capability.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${
                      capability.status ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-xs text-gray-500">
                      {capability.status ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      {isHealthy && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{'< 2s'}</div>
              <div className="text-sm text-blue-700">Response Time</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">95%+</div>
              <div className="text-sm text-green-700">Accuracy Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">99.9%</div>
              <div className="text-sm text-purple-700">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Configuration</h5>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Model:</strong> Lifeline Healthcare AI</p>
          <p><strong>Version:</strong> 2.0</p>
          <p><strong>Specialization:</strong> Blood donation, medical assessment, emergency coordination</p>
          <p><strong>Compliance:</strong> HIPAA, FDA guidelines, medical best practices</p>
        </div>
      </div>
    </div>
  );
}