import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  Clock, 
  Phone,
  Heart,
  User,
  Star,
  Shield,
  Droplets,
  Navigation,
  AlertTriangle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { donorService } from '../services/donorService';
import { notificationService } from '../services/notificationService';
import { bloodRequestService } from '../services/bloodRequestService';
import { useAuthContext } from '../contexts/AuthContext';

export function RecipientDashboard() {
  const [searchFilters, setSearchFilters] = useState({
    bloodType: '',
    distance: '10',
    urgency: 'normal',
  });

  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeRequests, setActiveRequests] = useState([
    {
      id: 1,
      patientName: 'Priya Sharma',
      bloodType: 'O+',
      unitsNeeded: 2,
      urgency: 'high',
      hospital: 'Apollo Hospital',
      requestTime: '2 hours ago',
      status: 'active',
      matchedDonors: 5,
    },
  ]);

  const { user } = useAuthContext();
  const [requestLoading, setRequestLoading] = useState(false);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'normal', label: 'Normal', color: 'text-blue-600' },
    { value: 'high', label: 'High', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-600' },
  ];

  useEffect(() => {
    // Load initial donor data
    searchDonors();
    
    if (user) {
      loadUserRequests();
    }
  }, []);

  const loadUserRequests = async () => {
    try {
      if (!user) return;
      
      const requests = await bloodRequestService.getRequestsByRequester(user.id);
      if (requests && requests.length > 0) {
        // Only show active requests
        const activeReqs = requests
          .filter(req => req.status === 'active')
          .map(req => ({
            id: req.id,
            patientName: req.patient_name,
            bloodType: req.blood_type,
            unitsNeeded: req.units_needed,
            urgency: req.urgency_level,
            hospital: req.hospital_name,
            requestTime: formatTimeAgo(req.created_at),
            status: req.status,
            matchedDonors: req.matched_donors_count || 0
          }));
        
        setActiveRequests(activeReqs);
      }
    } catch (error) {
      console.error('Error loading user requests:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.round(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.round(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  };

  const searchDonors = async () => {
    setLoading(true);
    try {
      const results = await donorService.searchDonors({
        bloodType: searchFilters.bloodType as any || undefined,
        city: 'Mumbai', // Default to Mumbai for demo
        maxDistance: parseInt(searchFilters.distance) || 10,
        userLat: 19.0760, // Mumbai coordinates
        userLon: 72.8777,
        isEligible: true
      });
      
      setSearchResults(results || []);
    } catch (error) {
      console.error('Error searching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEmergencyRequest = async () => {
    try {
      setRequestLoading(true);
      
      // In a real app, this would navigate to the emergency request page
      // For demo purposes, we'll create a mock emergency request
      
      const requestData = {
        requester_id: user?.id || '',
        patient_name: 'Emergency Patient',
        blood_type: searchFilters.bloodType as any || 'O+',
        units_needed: 2,
        urgency_level: 'critical' as any,
        hospital_name: 'Nearest Hospital',
        hospital_address: 'Mumbai, Maharashtra',
        contact_number: '+91 9876543210',
        additional_info: 'Emergency request created from recipient dashboard',
        status: 'active' as any,
      };
      
      const request = await bloodRequestService.createBloodRequest(requestData);
      
      // Send emergency notifications
      await notificationService.sendEmergencyAlert({
        bloodType: requestData.blood_type,
        hospitalName: requestData.hospital_name,
        location: requestData.hospital_address,
        urgencyLevel: requestData.urgency_level,
        requestId: request.id
      });
      
      // Reload user requests
      await loadUserRequests();
      
      alert('Emergency request created! Notifying nearby donors...');
    } catch (error) {
      console.error('Failed to create emergency request:', error);
      alert('Failed to create emergency request. Please try again.');
    } finally {
      setRequestLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Find Blood Donors</h1>
              <p className="text-gray-600 mt-1">Search for compatible blood donors in your area</p>
            </div>
            
            <div className="mt-4 lg:mt-0">
              <button 
                onClick={createEmergencyRequest}
                disabled={requestLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium flex items-center space-x-2"
              >
                <AlertTriangle className="h-5 w-5" />
                <span onClick={createEmergencyRequest}>Emergency Request</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
              <select
                value={searchFilters.bloodType}
                onChange={(e) => handleFilterChange('bloodType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                {bloodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
              <select
                value={searchFilters.distance}
                onChange={(e) => handleFilterChange('distance', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
              <select
                value={searchFilters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {urgencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Donors</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Requests */}
            {activeRequests.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-soft"
              >
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Active Requests</h2>
                </div>
                <div className="p-6">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.patientName}</h3>
                          <p className="text-gray-600">{request.hospital}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">{request.bloodType}</div>
                          <div className="text-sm text-gray-600">Blood Type</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{request.unitsNeeded}</div>
                          <div className="text-sm text-gray-600">Units Needed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{request.matchedDonors}</div>
                          <div className="text-sm text-gray-600">Matched Donors</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-900">{request.requestTime}</div>
                          <div className="text-sm text-gray-600">Request Time</div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          View Matches
                        </button>
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          Update Request
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Nearby Donors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Nearby Donors</h2>
                  <span className="text-sm text-gray-600">{searchResults.length} donors found</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Searching for donors...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No donors found matching your criteria</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search filters</p>
                    </div>
                  ) : (
                    searchResults.map((donor) => (
                    <div key={donor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-medium transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                            {donor.profiles?.first_name?.charAt(0) || 'D'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {donor.profiles?.first_name} {donor.profiles?.last_name}
                              </h3>
                              {donor.profiles?.is_verified && (
                                <Shield className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Droplets className="h-4 w-4 text-red-600" />
                                <span className="font-medium">{donor.blood_type}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{donor.profiles?.city || 'Unknown location'}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span>{(4 + Math.random()).toFixed(1)}</span>
                              </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                              {donor.total_donations} donations • Last donated {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'Unknown'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            donor.availability_status === 'available'
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {donor.availability_status === 'available' ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3 mt-4">
                        <button 
                          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                            donor.availability_status === 'available'
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={donor.availability_status !== 'available'}
                        >
                          <Phone className="h-4 w-4 inline mr-2" />
                          Contact
                        </button>
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          View Profile
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Emergency Request</span>
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Schedule Request</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span onClick={searchDonors}>Search Donors</span>
                </button>
              </div>
            </motion.div>

            {/* Blood Type Compatibility */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Type Guide</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="font-medium text-red-900">Universal Donor</div>
                  <div className="text-sm text-red-700">O- can donate to all types</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">Universal Recipient</div>
                  <div className="text-sm text-blue-700">AB+ can receive from all types</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Compatibility</div>
                  <div className="text-sm text-gray-700">Check donor compatibility before requesting</div>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white"
            >
              <div className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Emergency Contacts</h3>
                <div className="space-y-2">
                  <a
                    href="tel:108"
                    className="block w-full bg-white text-red-600 py-2 px-4 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    Ambulance: 108
                  </a>
                  <a
                    href="tel:+911800LIFELINE"
                    className="block w-full bg-red-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-800 transition-colors"
                  >
                    Lifeline: 1800-LIFELINE
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}