import React, { useState } from 'react';
import { AlertTriangle, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { geminiAIDirect, BloodType, UrgencyLevel, bloodTypes, urgencyLevels } from '../services/geminiAIDirect';

interface EmergencyRequestFormProps {
  onRequestSubmitted?: (requestId: string) => void;
}

const EmergencyRequestForm: React.FC<EmergencyRequestFormProps> = ({ onRequestSubmitted }) => {
  const [formData, setFormData] = useState({
    bloodType: '' as BloodType,
    hospitalName: '',
    contactInfo: '',
    urgency: 'high' as UrgencyLevel,
    unitsNeeded: 1,
    patientDetails: '',
    additionalNotes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResult(null);

    try {
      // Validate required fields
      if (!formData.bloodType || !formData.hospitalName || !formData.contactInfo) {
        throw new Error('Please fill in all required fields');
      }

      // Submit the emergency request via Gemini AI
      const response = await geminiAIDirect.registerEmergencyRequest({
        bloodType: formData.bloodType,
        hospitalName: formData.hospitalName,
        contactInfo: formData.contactInfo,
        urgency: formData.urgency,
        unitsNeeded: formData.unitsNeeded
      });

      if (response.success) {
        // Extract the function call result
        const emergencyResponse = response.functionCalls?.find(
          (call: any) => call.name === 'registerEmergencyRequest'
        )?.response;

        if (emergencyResponse?.success) {
          setResult(emergencyResponse);
          onRequestSubmitted?.(emergencyResponse.requestId);
          
          // Reset form
          setFormData({
            bloodType: '' as BloodType,
            hospitalName: '',
            contactInfo: '',
            urgency: 'high' as UrgencyLevel,
            unitsNeeded: 1,
            patientDetails: '',
            additionalNotes: ''
          });
        } else {
          throw new Error(emergencyResponse?.error || 'Failed to register emergency request');
        }
      } else {
        throw new Error(response.error || 'Failed to process request');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Request Submitted</h2>
          <div className="text-lg font-medium text-green-600 mb-4">
            Request ID: {result.requestId}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-green-800 mb-2">Request Details:</h3>
            <ul className="space-y-1 text-sm text-green-700">
              <li><strong>Blood Type:</strong> {result.bloodType}</li>
              <li><strong>Hospital:</strong> {result.hospitalName}</li>
              <li><strong>Urgency:</strong> {result.urgency}</li>
              <li><strong>Units Needed:</strong> {result.unitsNeeded}</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <ul className="space-y-2 text-sm text-blue-700">
              {result.nextSteps?.map((step: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setResult(null)}
              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Submit Another Request
            </button>
            
            <p className="text-sm text-gray-600">
              Keep this request ID for reference. You will receive updates on the registered contact information.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emergency Blood Request</h2>
          <p className="text-gray-600">AI-powered urgent blood matching system</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Blood Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blood Type Required *
            </label>
            <select
              value={formData.bloodType}
              onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value as BloodType }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select blood type</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level *
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as UrgencyLevel }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              {urgencyLevels.map(level => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </select>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${getUrgencyColor(formData.urgency)}`}>
              {formData.urgency.toUpperCase()} PRIORITY
            </div>
          </div>
        </div>

        {/* Hospital Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Hospital/Medical Facility Name *
          </label>
          <input
            type="text"
            value={formData.hospitalName}
            onChange={(e) => setFormData(prev => ({ ...prev, hospitalName: e.target.value }))}
            placeholder="e.g., City General Hospital, Mumbai"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-1" />
            Contact Information *
          </label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={(e) => setFormData(prev => ({ ...prev, contactInfo: e.target.value }))}
            placeholder="Phone number or email for urgent contact"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
          />
        </div>

        {/* Units Needed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Units of Blood Needed
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={formData.unitsNeeded}
            onChange={(e) => setFormData(prev => ({ ...prev, unitsNeeded: parseInt(e.target.value) || 1 }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            placeholder="Any additional information that might help with the blood matching..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Processing Emergency Request...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Emergency Request
              </>
            )}
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          This request will be processed immediately by our AI system and relevant medical facilities will be notified.
        </div>
      </form>
    </div>
  );
};

export default EmergencyRequestForm;
