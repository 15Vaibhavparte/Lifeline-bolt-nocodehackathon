import React, { useState } from 'react';
import { AlertCircle, Database, Wifi, Clock, Users } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setTesting(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      environment: {
        mode: import.meta.env.MODE,
        isDev: import.meta.env.DEV,
        isProd: import.meta.env.PROD,
        supabaseConfigured: isSupabaseConfigured,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT_SET',
        supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      },
      database: {
        connectionTest: null,
        bloodDrivesCount: null,
        error: null
      }
    };

    try {
      // Test basic connection
      const { data: connectionData, error: connectionError } = await supabase
        .from('blood_drives')
        .select('count')
        .limit(1);

      if (connectionError) {
        results.database.error = connectionError.message;
        results.database.connectionTest = 'FAILED';
      } else {
        results.database.connectionTest = 'SUCCESS';
      }

      // Get blood drives count
      const { count, error: countError } = await supabase
        .from('blood_drives')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        results.database.error = countError.message;
      } else {
        results.database.bloodDrivesCount = count;
      }

      // Test date range query
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('blood_drives')
        .select('*')
        .eq('is_active', true)
        .gte('event_date', startDate)
        .lte('event_date', endDate);

      if (upcomingError) {
        results.database.upcomingError = upcomingError.message;
      } else {
        results.database.upcomingCount = upcomingData?.length || 0;
        results.database.dateRange = { startDate, endDate };
      }

    } catch (error: any) {
      results.database.error = error.message;
      results.database.connectionTest = 'FAILED';
    }

    setTestResults(results);
    setTesting(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 z-50"
        title="Open Debug Panel"
      >
        <Database className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-xl p-6 max-w-md z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Debug Panel</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Environment</h4>
          <div className="text-sm space-y-1">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${import.meta.env.DEV ? 'bg-blue-500' : 'bg-green-500'}`} />
              <span>Mode: {import.meta.env.MODE}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>Supabase: {isSupabaseConfigured ? 'Configured' : 'Not Configured'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={testing}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {testing ? 'Running Tests...' : 'Run Diagnostics'}
        </button>

        {testResults && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Test Results</h4>
            
            <div className="text-sm bg-gray-50 p-3 rounded">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${testResults.database.connectionTest === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">Database Connection: {testResults.database.connectionTest}</span>
              </div>
              
              {testResults.database.bloodDrivesCount !== null && (
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Total Blood Drives: {testResults.database.bloodDrivesCount}</span>
                </div>
              )}

              {testResults.database.upcomingCount !== undefined && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Upcoming Events: {testResults.database.upcomingCount}</span>
                </div>
              )}

              {testResults.database.error && (
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                  <span className="text-sm text-red-600">{testResults.database.error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
