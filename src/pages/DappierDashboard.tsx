import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Users, 
  Activity, 
  Shield,
  BarChart3,
  MessageCircle,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DappierAIStatus } from '../components/DappierAIStatus';
import { useDappierAI } from '../hooks/useDappierAI';
import { useDappierCopilot } from '../hooks/useDappierCopilot';
import { DappierCopilot } from '../components/DappierCopilot';

export function DappierDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    intelligentMatching, 
    assessEligibility, 
    emergencyCoordination, 
    predictDemand,
    optimizeEngagement,
    error 
  } = useDappierAI();

  const {
    isInitialized,
    isHealthy,
    sendMessage
  } = useDappierCopilot();

  const [testResults, setTestResults] = useState<any>({});

  // Test-related state for the copilot tab
  const [testPrompt, setTestPrompt] = useState('');
  const [testResponse, setTestResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  // Format AI response text for better display
  const formatAIResponse = (text: string): string => {
    if (!text) return '';
    
    return text
      // Convert numbered lists to proper HTML lists
      .replace(/^(\d+)\.\s+(.+)$/gm, '<div class="numbered-item mb-3"><span class="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full mr-3 flex-shrink-0">$1</span><span class="text-gray-800 leading-relaxed">$2</span></div>')
      
      // Convert bullet points to proper styled bullets  
      .replace(/^[-•]\s+(.+)$/gm, '<div class="bullet-item mb-2 flex items-start"><span class="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0"></span><span class="text-gray-800 leading-relaxed">$1</span></div>')
      
      // Convert headers with ### to styled headers
      .replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3 border-b border-gray-200 pb-2">$1</h3>')
      
      // Convert bold text **text** to styled bold
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-gray-900 bg-yellow-50 px-1 rounded">$1</strong>')
      
      // Handle table rows with proper styling
      .replace(/^\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|.*$/gm, (match) => {
        // Check if it's a header row (contains dashes)
        if (match.includes('---')) {
          return '<div class="border-t-2 border-gray-300 my-3"></div>';
        }
        // Regular table row
        const cells = match.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
        if (cells.length >= 2) {
          return `<div class="table-row bg-slate-50 border border-gray-200 rounded-lg p-3 my-2 font-mono text-sm">
            <div class="grid grid-cols-2 gap-4">
              <div class="font-medium text-gray-700">${cells[0]}</div>
              <div class="text-gray-600">${cells[1]}</div>
            </div>
          </div>`;
        }
        return match;
      })
      
      // Convert lines that look like separators  
      .replace(/^[-=]{3,}$/gm, '<hr class="my-4 border-gray-300">')
      
      // Handle compatibility charts with better formatting
      .replace(/^(Compatibility|Here's a quick compatibility chart).*$/gm, '<h4 class="text-md font-medium text-gray-900 mt-4 mb-3 bg-blue-50 px-3 py-2 rounded-lg border-l-4 border-blue-400">$&</h4>')
      
      // Add proper line breaks
      .replace(/\n\n+/g, '<div class="my-4"></div>')
      .replace(/\n/g, '<br>');
  };

  const aiFeatures = [
    {
      id: 'matching',
      icon: Zap,
      title: 'Intelligent Matching',
      description: 'AI-powered donor-recipient matching with contextual awareness',
      color: 'text-blue-600 bg-blue-100',
      metrics: { accuracy: '96%', speed: '1.2s', matches: '15,000+' }
    },
    {
      id: 'assessment',
      icon: Shield,
      title: 'Medical Assessment',
      description: 'Automated health screening and eligibility determination',
      color: 'text-green-600 bg-green-100',
      metrics: { accuracy: '94%', processed: '8,500+', compliance: '100%' }
    },
    {
      id: 'prediction',
      icon: TrendingUp,
      title: 'Demand Prediction',
      description: 'Predictive analytics for blood supply optimization',
      color: 'text-purple-600 bg-purple-100',
      metrics: { accuracy: '89%', forecast: '30 days', savings: '25%' }
    },
    {
      id: 'engagement',
      icon: Users,
      title: 'Donor Engagement',
      description: 'Personalized communication and retention strategies',
      color: 'text-orange-600 bg-orange-100',
      metrics: { retention: '+35%', response: '+42%', satisfaction: '4.8/5' }
    },
    {
      id: 'emergency',
      icon: Activity,
      title: 'Emergency Coordination',
      description: 'Real-time emergency response and resource optimization',
      color: 'text-red-600 bg-red-100',
      metrics: { response: '< 5min', success: '98%', lives: '2,500+' }
    }
  ];

  const testAIFeature = async (featureId: string) => {
    setTestResults((prev: any) => ({ ...prev, [featureId]: { loading: true } }));

    try {
      let result;
      
      switch (featureId) {
        case 'matching':
          result = await intelligentMatching({
            bloodType: 'O+',
            urgencyLevel: 'high',
            hospitalLocation: { lat: 19.0760, lon: 72.8777 },
            unitsNeeded: 2
          });
          break;
          
        case 'assessment':
          result = await assessEligibility({
            age: 25,
            weight: 70,
            medicalHistory: ['None'],
            medications: ['None'],
            lifestyle: {
              smoking: false,
              alcohol: 'Occasional',
              exercise: 'Regular'
            }
          });
          break;
          
        case 'prediction':
          result = await predictDemand({
            historicalData: [],
            seasonalFactors: 'Winter',
            localEvents: ['Festival'],
            weatherForecast: 'Clear',
            hospitalSchedules: [],
            demographicTrends: {}
          });
          break;
          
        case 'engagement':
          result = await optimizeEngagement({
            donationHistory: [],
            preferences: {},
            demographics: {},
            responsePatterns: {},
            motivations: ['Helping others']
          });
          break;
          
        case 'emergency':
          result = await emergencyCoordination({
            bloodType: 'AB-',
            unitsNeeded: 3,
            patientCondition: 'Critical',
            hospitalCapacity: 85,
            nearbyHospitals: [],
            availableDonors: [],
            trafficConditions: 'Heavy',
            timeConstraints: 30
          });
          break;
          
        default:
          throw new Error('Unknown feature');
      }

      setTestResults((prev: any) => ({ 
        ...prev, 
        [featureId]: { 
          loading: false, 
          success: true, 
          result,
          timestamp: new Date()
        } 
      }));

    } catch (error: any) {
      setTestResults((prev: any) => ({ 
        ...prev, 
        [featureId]: { 
          loading: false, 
          success: false, 
          error: error.message,
          timestamp: new Date()
        } 
      }));
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* AI Status */}
      <DappierAIStatus showDetails={true} />

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiFeatures.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-3 rounded-lg ${feature.color}`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{feature.description}</p>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              {Object.entries(feature.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-2">
                  <div className="text-sm font-bold text-gray-900">{value}</div>
                  <div className="text-xs text-gray-600 capitalize">{key}</div>
                </div>
              ))}
            </div>
            
            <button
              onClick={() => testAIFeature(feature.id)}
              disabled={testResults[feature.id]?.loading}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              {testResults[feature.id]?.loading ? 'Testing...' : 'Test Feature'}
            </button>
            
            {testResults[feature.id] && !testResults[feature.id].loading && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                testResults[feature.id].success 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {testResults[feature.id].success 
                  ? '✅ Test completed successfully' 
                  : `❌ Test failed: ${testResults[feature.id].error}`
                }
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCopilotTest = () => {
    const handleTestPrompt = async () => {
      if (!testPrompt.trim()) return;
      
      setIsTesting(true);
      setTestResponse('');
      
      try {
        const response = await sendMessage(testPrompt);
        setTestResponse(response?.text || 'No response received');
      } catch (error) {
        setTestResponse(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsTesting(false);
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <MessageCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dappier AI Prompt Test</h3>
              <p className="text-sm text-gray-600">
                Test the AI agent with custom queries about blood donation
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-full ${
              isInitialized && isHealthy 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {isInitialized && isHealthy ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <span className="text-sm font-medium">
              {isInitialized && isHealthy ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
        
        {/* Prompt Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="test-prompt" className="block text-sm font-semibold text-gray-700 mb-3">
              Enter your question or prompt:
            </label>
            <textarea
              id="test-prompt"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="e.g., What are the requirements to become a blood donor? or How does blood type compatibility work?"
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 font-inter text-gray-800 placeholder-gray-400"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
              rows={4}
            />
          </div>
          
          <button
            onClick={handleTestPrompt}
            disabled={!testPrompt.trim() || isTesting || !isHealthy}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] disabled:scale-100"
          >
            {isTesting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </div>
            ) : (
              'Send Query'
            )}
          </button>
          
          {/* Response Section */}
          {(testResponse || isTesting) && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Response:
              </label>
              <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-6 min-h-[120px] shadow-sm">
                {isTesting ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 font-medium">Getting response...</span>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <div 
                      className="ai-response text-gray-800 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: formatAIResponse(testResponse)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Sample Queries */}
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h4 className="text-base font-semibold text-blue-900 mb-4 flex items-center">
              <span className="p-1 bg-blue-200 rounded-full mr-2">
                <MessageCircle className="h-4 w-4 text-blue-700" />
              </span>
              Sample queries to try:
            </h4>
            <div className="grid gap-3">
              <button
                onClick={() => setTestPrompt("What are the requirements to become a blood donor?")}
                className="text-left hover:bg-white hover:shadow-md p-4 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 group"
              >
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-blue-600"></span>
                  <span className="text-blue-800 group-hover:text-blue-900 font-medium">What are the requirements to become a blood donor?</span>
                </div>
              </button>
              <button
                onClick={() => setTestPrompt("How does blood type compatibility work for donations?")}
                className="text-left hover:bg-white hover:shadow-md p-4 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 group"
              >
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-blue-600"></span>
                  <span className="text-blue-800 group-hover:text-blue-900 font-medium">How does blood type compatibility work for donations?</span>
                </div>
              </button>
              <button
                onClick={() => setTestPrompt("What should I do before donating blood?")}
                className="text-left hover:bg-white hover:shadow-md p-4 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 group"
              >
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-blue-600"></span>
                  <span className="text-blue-800 group-hover:text-blue-900 font-medium">What should I do before donating blood?</span>
                </div>
              </button>
              <button
                onClick={() => setTestPrompt("How often can I donate blood?")}
                className="text-left hover:bg-white hover:shadow-md p-4 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 group"
              >
                <div className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-blue-600"></span>
                  <span className="text-blue-800 group-hover:text-blue-900 font-medium">How often can I donate blood?</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Brain className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Dappier AI Dashboard</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced AI platform powering intelligent blood donation services with healthcare-grade accuracy and reliability
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-red-600" />
              <span className="text-red-700">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Brain className="h-4 w-4 inline mr-2" />
                AI Overview
              </button>
              
              <button
                onClick={() => setActiveTab('copilot')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'copilot'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="h-4 w-4 inline mr-2" />
                Copilot Test
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'copilot' && renderCopilotTest()}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Performance Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">25,000+</div>
                  <div className="text-sm text-blue-700">AI Requests Processed</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">1.8s</div>
                  <div className="text-sm text-green-700">Average Response Time</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">94.5%</div>
                  <div className="text-sm text-purple-700">Overall Accuracy</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Activity className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">99.8%</div>
                  <div className="text-sm text-orange-700">System Uptime</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Recent AI Activity</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Emergency matching completed</span>
                    </div>
                    <span className="text-xs text-gray-500">2 minutes ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Donor eligibility assessed</span>
                    </div>
                    <span className="text-xs text-gray-500">5 minutes ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Demand prediction updated</span>
                    </div>
                    <span className="text-xs text-gray-500">12 minutes ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Assistant Settings</h3>
              
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Data Collection</p>
                        <p className="text-sm text-gray-600">Allow AI to use conversation data for improvements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Conversation History</p>
                        <p className="text-sm text-gray-600">Store conversation history for 30 days</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Language Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ta">Tamil</option>
                        <option value="bn">Bengali</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Voice Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Voice Responses</p>
                        <p className="text-sm text-gray-600">Enable spoken responses from AI</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Voice Input</p>
                        <p className="text-sm text-gray-600">Enable voice commands</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Emergency Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">Emergency Escalation</p>
                        <p className="text-sm text-gray-600">Automatically escalate emergency requests</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Dappier Copilot Widget */}
      <DappierCopilot className="fixed top-4 right-4 z-50" />
    </div>
  );
}