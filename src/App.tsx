import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { VoiceAccessibilityProvider } from './components/VoiceAccessibilityProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import LazyComponent from './components/LazyComponent';
import ErrorBoundary from './components/ErrorBoundary';

// Simple inline loading component to avoid import issues
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    <span className="ml-3 text-gray-600">{text}</span>
  </div>
);

// Lazy load all page components with consistent pattern
const HomePage = lazy(() => import('./pages/HomePage'));
const DonorDashboard = lazy(() => import('./pages/DonorDashboard'));
const RecipientDashboard = lazy(() => import('./pages/RecipientDashboard'));
const EmergencyRequest = lazy(() => import('./pages/EmergencyRequest'));
const BloodDrives = lazy(() => import('./pages/BloodDrives'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const VoiceSettings = lazy(() => import('./pages/VoiceSettings'));
const LanguageSettings = lazy(() => import('./pages/LanguageSettings'));
const GeminiDashboard = lazy(() => import('./pages/GeminiDashboard'));
const DiagnosticsPage = lazy(() => import('./pages/DiagnosticsPage'));
// const TestScrollSequence = lazy(() => import('./components/TestScrollSequence'));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TranslationProvider>
          <VoiceAccessibilityProvider>
            <Router>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <main className="flex-1">
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/donor-dashboard" element={<DonorDashboard />} />
                        <Route path="/recipient-dashboard" element={<RecipientDashboard />} />
                        <Route path="/emergency" element={<EmergencyRequest />} />
                        <Route path="/blood-drives" element={<BloodDrives />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/voice-settings" element={<VoiceSettings />} />
                        <Route path="/language-settings" element={<LanguageSettings />} />
                        <Route path="/ai-dashboard" element={<GeminiDashboard />} />
                        <Route path="/diagnostics" element={<DiagnosticsPage />} />
                        {/* <Route path="/test-scroll" element={<TestScrollSequence />} /> */}
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                
                {/* Floating Voice Interface */}
                <ErrorBoundary>
                  <LazyComponent 
                    importComponent={() => import('./components/VoiceInterface').then(m => m.VoiceInterface)}
                    className=""
                  />
                </ErrorBoundary>
              </div>
            </Router>
          </VoiceAccessibilityProvider>
        </TranslationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;