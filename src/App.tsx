import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VoiceAccessibilityProvider } from './components/VoiceAccessibilityProvider';
import { TranslationProvider } from './components/TranslationProvider';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { VoiceInterface } from './components/VoiceInterface';
import { HomePage } from './pages/HomePage';
import { DonorDashboard } from './pages/DonorDashboard';
import { RecipientDashboard } from './pages/RecipientDashboard';
import { EmergencyRequest } from './pages/EmergencyRequest';
import { BloodDrives } from './pages/BloodDrives';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { VoiceSettings } from './pages/VoiceSettings';
import { LanguageSettings } from './pages/LanguageSettings';
import { DappierDashboard } from './pages/DappierDashboard';

function App() {
  return (
    <AuthProvider>
      <TranslationProvider>
        <VoiceAccessibilityProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Header />
              <main className="flex-1">
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
                <Route path="/ai-dashboard" element={<DappierDashboard />} />
                </Routes>
              </main>
              <Footer />
              
              {/* Floating Voice Interface */}
              <VoiceInterface />
            </div>
          </Router>
        </VoiceAccessibilityProvider>
      </TranslationProvider>
    </AuthProvider>
  );
}

export default App;