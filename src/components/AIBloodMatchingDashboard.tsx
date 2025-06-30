import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  AlertTriangle, 
  Search, 
  Calendar,
  Users,
  Activity,
  CheckCircle,
  Clock,
  Phone
} from 'lucide-react';
import GeminiBloodMatchingChat from './GeminiBloodMatchingChat';
import EmergencyRequestForm from './EmergencyRequestForm';
import { geminiAIDirect } from '../services/geminiAIDirect';

interface DashboardTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

interface EmergencyAlert {
  id: string;
  bloodType: string;
  hospitalName: string;
  urgency: string;
  timestamp: Date;
  status: 'active' | 'processing' | 'fulfilled';
}

const AIBloodMatchingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    aiOnline: false,
    databaseOnline: false,
    checking: true
  });

  // Check system status on mount
  useEffect(() => {
    const checkSystemStatus = async () => {
      setSystemStatus(prev => ({ ...prev, checking: true }));
      
      // Use direct connection for production reliability
      console.log('🔄 Using direct Supabase + Gemini AI connection (Production Mode)');
      
      const [aiStatus, dbStatus] = await Promise.all([
        geminiAIDirect.testConnection(),
        geminiAIDirect.testDatabase()
      ]);

      console.log('✅ AI Status:', aiStatus ? 'Online' : 'Offline');
      console.log('✅ DB Status:', dbStatus ? 'Online' : 'Offline');

      setSystemStatus({
        aiOnline: aiStatus,
        databaseOnline: dbStatus,
        checking: false
      });
    };

    checkSystemStatus();
  }, []);

  const handleEmergencyAlert = (alertData: any) => {
    const newAlert: EmergencyAlert = {
      id: alertData.response?.requestId || Date.now().toString(),
      bloodType: alertData.response?.bloodType || 'Unknown',
      hospitalName: alertData.response?.hospitalName || 'Unknown Hospital',
      urgency: alertData.response?.urgency || 'medium',
      timestamp: new Date(),
      status: 'active'
    };

    setEmergencyAlerts(prev => [newAlert, ...prev.slice(0, 9)]); // Keep last 10 alerts
  };

  const handleEmergencyRequestSubmitted = (requestId: string) => {
    // This could trigger additional actions like notifications
    console.log('Emergency request submitted:', requestId);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-red-500 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'fulfilled': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs: DashboardTab[] = [
    {
      id: 'chat',
      name: 'AI Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      component: <GeminiBloodMatchingChat onEmergencyAlert={handleEmergencyAlert} />
    },
    {
      id: 'emergency',
      name: 'Emergency Request',
      icon: <AlertTriangle className="w-5 h-5" />,
      component: <EmergencyRequestForm onRequestSubmitted={handleEmergencyRequestSubmitted} />
    },
    {
      id: 'search',
      name: 'Blood Search',
      icon: <Search className="w-5 h-5" />,
      component: (
        <div className="p-6 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Advanced Blood Search</h3>
          <p className="text-gray-600 mb-4">
            Use the AI Assistant to search for compatible donors, blood drives, and compatibility information.
          </p>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Go to AI Assistant
          </button>
        </div>
      )
    },
    {
      id: 'drives',
      name: 'Blood Drives',
      icon: <Calendar className="w-5 h-5" />,
      component: (
        <div className="p-6 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Find Blood Drives</h3>
          <p className="text-gray-600 mb-4">
            Ask the AI Assistant to find upcoming blood drives in your area.
          </p>
          <button
            onClick={() => setActiveTab('chat')}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Find Blood Drives
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* System Status Header */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Gemini AI System</h2>
                <p className="text-sm text-gray-600">Blood Matching & Emergency Response</p>
              </div>
            </div>

            {/* System Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.aiOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  AI {systemStatus.checking ? 'Checking...' : systemStatus.aiOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${systemStatus.databaseOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">
                  DB {systemStatus.checking ? 'Checking...' : systemStatus.databaseOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border mb-4 sm:mb-6">
              <div className="border-b border-gray-200 overflow-x-auto">
                <nav className="flex min-w-max">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600 bg-red-50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                        {tab.icon}
                      </span>
                      <span className="hidden sm:inline">{tab.name}</span>
                      <span className="sm:hidden text-xs">{tab.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-0">
                {tabs.find(tab => tab.id === activeTab)?.component}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:w-80 space-y-4 sm:space-y-6">
            {/* Emergency Alerts */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0" />
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Emergency Alerts</h3>
                </div>
              </div>
              
              <div className="p-3 sm:p-4">
                {emergencyAlerts.length === 0 ? (
                  <p className="text-gray-500 text-xs sm:text-sm text-center py-4">
                    No active emergency alerts
                  </p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {emergencyAlerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1 sm:gap-2 mb-1">
                              <span className="font-medium text-red-800 text-sm truncate">{alert.bloodType}</span>
                              <span className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(alert.urgency)} flex-shrink-0`}>
                                {alert.urgency}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-red-700 mb-1 truncate">{alert.hospitalName}</p>
                            <div className="flex items-center gap-1 sm:gap-2">
                              <Clock className="w-3 h-3 text-red-500 flex-shrink-0" />
                              <span className="text-xs text-red-600">
                                {alert.timestamp.toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className={`px-1 sm:px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)} flex-shrink-0`}>
                            {alert.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-3 sm:p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">System Overview</h3>
              </div>
              
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">AI Responses</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm flex-shrink-0">Real-time</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">Donor Network</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm flex-shrink-0">Active</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-gray-600 truncate">Blood Drives</span>
                  </div>
                  <span className="font-medium text-xs sm:text-sm flex-shrink-0">Available</span>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-1 sm:gap-2 mb-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <h3 className="font-semibold text-red-800 text-sm sm:text-base">Emergency Hotline</h3>
              </div>
              <p className="text-xs sm:text-sm text-red-700 mb-3">
                For life-threatening emergencies, call immediately:
              </p>
              <div className="text-center">
                <a
                  href="tel:108"
                  className="text-xl sm:text-2xl font-bold text-red-800 hover:text-red-900 transition-colors"
                >
                  108
                </a>
                <p className="text-xs text-red-600 mt-1">National Emergency Number</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBloodMatchingDashboard;
