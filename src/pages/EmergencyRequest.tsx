import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Heart,
  User,
  Calendar,
  Droplets,
  Send,
  Mic,
  MicOff,
  Brain
} from 'lucide-react';
import { useFreeAI } from '../hooks/useFreeAI';
import { AIMatchingStatus } from '../components/AIMatchingStatus';
import { bloodRequestService } from '../services/bloodRequestService';
import { notificationService } from '../services/notificationService';
import { useAuthContext } from '../contexts/AuthContext';

export function EmergencyRequest() {
  const [isListening, setIsListening] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState('high');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: '',
    unitsNeeded: '',
    hospitalName: '',
    hospitalAddress: '',
    contactNumber: '',
    additionalInfo: '',
  });

  const { findMatches, loading: aiLoading, result: aiResult, error: aiError } = useFreeAI();
  const { user } = useAuthContext();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal', color: 'bg-blue-500', description: 'Within 24 hours' },
    { value: 'high', label: 'High', color: 'bg-orange-500', description: 'Within 6 hours' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500', description: 'Immediate' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create blood request
      const requestData = {
        requester_id: user?.id || '',
        patient_name: formData.patientName,
        blood_type: formData.bloodType as any,
        units_needed: parseInt(formData.unitsNeeded),
        urgency_level: urgencyLevel as any,
        hospital_name: formData.hospitalName,
        hospital_address: formData.hospitalAddress,
        contact_number: formData.contactNumber,
        additional_info: formData.additionalInfo,
        status: 'active' as any,
      };

      const bloodRequest = await bloodRequestService.createBloodRequest(requestData);
      
      // Use free AI for matching
      const requestDetails = {
        bloodType: formData.bloodType as any,
        urgencyLevel: urgencyLevel as any,
        hospitalLat: 19.0760, // Default Mumbai coordinates - in real app, geocode the address
        hospitalLon: 72.8777,
        requestId: bloodRequest.id,
        patientName: formData.patientName,
        unitsNeeded: parseInt(formData.unitsNeeded),
      };

      // Send emergency notifications to eligible donors
      await notificationService.sendEmergencyAlert({
        bloodType: formData.bloodType,
        hospitalName: formData.hospitalName,
        location: formData.hospitalAddress,
        urgencyLevel: urgencyLevel,
        requestId: bloodRequest.id
      });

      await findMatches(requestDetails);

    } catch (error: any) {
      console.error('Emergency request failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleVoiceInput = () => {
    setIsListening(!isListening);
    // Implement voice recognition logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-4 animate-pulse-slow">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Emergency Blood Request</h1>
          <p className="text-lg text-gray-600">
            AI-powered matching finds donors in under 30 seconds
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-gray-500">
            <Brain className="h-4 w-4" />
            <span>Free AI Stack: Google AI → OpenAI → Ollama → Basic</span>
          </div>
        </motion.div>

        {/* Emergency Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{"< 30 sec"}</div>
            <div className="text-gray-600">AI Matching Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">2,500+</div>
            <div className="text-gray-600">Lives Saved</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft text-center">
            <User className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15,000+</div>
            <div className="text-gray-600">Active Donors</div>
          </div>
        </motion.div>

        {/* AI Matching Status */}
        {(aiLoading || aiResult || aiError) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <AIMatchingStatus 
              loading={aiLoading} 
              result={aiResult} 
              error={aiError} 
            />
          </motion.div>
        )}

        {/* Emergency Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-medium p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Urgency Level *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setUrgencyLevel(level.value)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      urgencyLevel === level.value
                        ? `${level.color} text-white border-transparent`
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{level.label}</div>
                    <div className={`text-sm ${urgencyLevel === level.value ? 'text-white' : 'text-gray-500'}`}>
                      {level.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter patient's full name"
                />
              </div>

              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type Required *
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select blood type</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="unitsNeeded" className="block text-sm font-medium text-gray-700 mb-2">
                  Units Needed *
                </label>
                <input
                  type="number"
                  id="unitsNeeded"
                  name="unitsNeeded"
                  value={formData.unitsNeeded}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Number of units"
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Hospital Information */}
            <div>
              <label htmlFor="hospitalName" className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Name *
              </label>
              <input
                type="text"
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter hospital name"
              />
            </div>

            <div>
              <label htmlFor="hospitalAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Address *
              </label>
              <input
                type="text"
                id="hospitalAddress"
                name="hospitalAddress"
                value={formData.hospitalAddress}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter complete hospital address"
              />
            </div>

            {/* Additional Information */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="additionalInfo" className="block text-sm font-medium text-gray-700">
                  Additional Information
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                    isListening
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  <span>{isListening ? 'Stop' : 'Voice Input'}</span>
                </button>
              </div>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Any additional medical information, special requirements, or notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting || aiLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-medium flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing with AI...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Emergency Request</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200"
              >
                <Phone className="h-5 w-5" />
                <span>Call 108</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Emergency Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Free AI Matching Process</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <span>🤖 <strong>Google AI (Free):</strong> Primary matching with 60 requests/minute limit</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <span>🧠 <strong>OpenAI Fallback:</strong> $5 free credit for testing and emergencies</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <span>🖥️ <strong>Ollama Local:</strong> 100% free local AI (if installed)</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <span>⚡ <strong>Basic Algorithm:</strong> Always available rule-based matching</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

// Default export for lazy loading
export default EmergencyRequest;