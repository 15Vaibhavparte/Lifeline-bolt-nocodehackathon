
import { Suspense, useState } from 'react';
import { Brain, MessageCircle } from 'lucide-react';
import AIBloodMatchingDashboard from '../components/AIBloodMatchingDashboard';
import { DappierCopilot } from '../components/DappierCopilot';

const GeminiDashboard = () => {
  const [activeTab, setActiveTab] = useState<'gemini' | 'dappier'>('gemini');

  const tabs = [
    {
      id: 'gemini' as const,
      name: 'Gemini AI',
      icon: <Brain className="w-5 h-5" />,
      description: 'AI-powered blood matching and emergency response system'
    },
    {
      id: 'dappier' as const,
      name: 'Dappier Co-Pilot',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'Intelligent assistant for blood donation coordination'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Tab Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">AI Dashboard</h1>
              <p className="text-gray-600 mt-1">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-red-600 shadow-sm border border-red-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading AI Dashboard...</p>
          </div>
        </div>
      }>
        {activeTab === 'gemini' && <AIBloodMatchingDashboard />}
        {activeTab === 'dappier' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Dappier Co-Pilot</h2>
                  <p className="text-sm text-gray-600">Intelligent assistant for blood donation coordination</p>
                </div>
              </div>
              <DappierCopilot className="w-full" />
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default GeminiDashboard;
