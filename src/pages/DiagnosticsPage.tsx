import React, { Suspense } from 'react';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Test lazy loading without the complex routing
const TestHomePage = React.lazy(() => import('../pages/HomePage'));
const TestGeminiDashboard = React.lazy(() => import('../pages/GeminiDashboard'));
const TestAIBloodMatchingDashboard = React.lazy(() => import('../components/AIBloodMatchingDashboard'));

function DiagnosticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Component Loading Diagnostics</h1>
        
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">HomePage Test</h2>
            <Suspense fallback={<LoadingSpinner text="Loading HomePage..." />}>
              <div className="p-4 border rounded">
                <TestHomePage />
              </div>
            </Suspense>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Gemini Dashboard Test</h2>
            <Suspense fallback={<LoadingSpinner text="Loading Gemini Dashboard..." />}>
              <div className="p-4 border rounded">
                <TestGeminiDashboard />
              </div>
            </Suspense>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AIBloodMatchingDashboard Test</h2>
            <Suspense fallback={<LoadingSpinner text="Loading AIBloodMatchingDashboard..." />}>
              <div className="p-4 border rounded">
                <TestAIBloodMatchingDashboard />
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticsPage;
