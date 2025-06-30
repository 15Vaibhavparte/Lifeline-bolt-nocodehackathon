
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="py-4 space-y-4">
            {/* Title Section */}
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">AI Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
            </div>
            
            {/* Tab Navigation - Full width on mobile */}
            <div className="w-full">
              <div className="flex bg-gray-100 rounded-lg p-1 w-full">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-red-600 shadow-sm border border-red-200'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                      {tab.icon}
                    </span>
                    <span className="truncate">{tab.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Mobile description */}
              <p className="text-xs text-gray-600 mt-2 text-center sm:hidden">
                {tabs.find(tab => tab.id === activeTab)?.description}
              </p>
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dappier Co-Pilot</h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">Intelligent assistant for blood donation coordination</p>
                </div>
              </div>
              <div className="w-full">
                <DappierCopilot className="w-full" />
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </div>
  );
};

export default GeminiDashboard;
