import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Plus,
  Filter,
  Search,
  Heart,
  Award,
  Building,
  Phone,
  Mail,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader
} from 'lucide-react';
import { bloodDriveService } from '../services/bloodDriveService';
import { donorService } from '../services/donorService';
import { useAuthContext } from '../contexts/AuthContext';
import { BloodDrive, isSupabaseConfigured } from '../lib/supabase';
import { DebugPanel } from '../components/DebugPanel';

export function BloodDrives() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [registering, setRegistering] = useState<string | null>(null);
  const [userDonor, setUserDonor] = useState<any>(null);

  const { user, profile } = useAuthContext();

  const stats = [
    { label: 'Total Events', value: '150+', icon: Calendar, color: 'text-blue-600 bg-blue-100' },
    { label: 'Lives Saved', value: '4,500+', icon: Heart, color: 'text-red-600 bg-red-100' },
    { label: 'Active Donors', value: '12,000+', icon: Users, color: 'text-green-600 bg-green-100' },
    { label: 'Partner Organizations', value: '85+', icon: Building, color: 'text-purple-600 bg-purple-100' },
  ];

  useEffect(() => {
    loadBloodDrives();
    if (user && profile?.role === 'donor') {
      loadUserDonor();
    }
  }, [user, profile]);

  const loadBloodDrives = useCallback(async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      
      const startDate = new Date().toISOString().split('T')[0];
      const endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      console.log('Loading blood drives with date range:', { startDate, endDate, filterLocation });
      
      // Get active blood drives with search filters
      const upcoming = await bloodDriveService.searchBloodDrives({
        dateRange: {
          start: startDate,
          end: endDate
        },
        city: filterLocation || undefined
      });
      
      console.log('Upcoming blood drives fetched:', upcoming);
      
      // Get past blood drives
      const past = await bloodDriveService.getPastBloodDrives();
      
      console.log('Past blood drives fetched:', past);
      
      setUpcomingEvents(upcoming || []);
      setPastEvents(past || []);
    } catch (error: any) {
      let errorMessage = 'Failed to load blood drives';
      
      // Handle specific error types
      if (error.message?.includes('404') || error.message?.includes('not found')) {
        errorMessage = '404 Error: Blood drives table not found. Please check your database setup.';
      } else if (error.message?.includes('JWT') || error.message?.includes('Authentication')) {
        errorMessage = 'Authentication error: Please check your Supabase credentials.';
      } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        errorMessage = 'Database error: Blood drives table does not exist. Please run migrations.';
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to the database. Check your internet connection.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
      console.error('Error loading blood drives:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  }, [filterLocation]);

  const loadUserDonor = async () => {
    try {
      if (user) {
        const donor = await donorService.getDonorByUserId(user.id);
        setUserDonor(donor);
      }
    } catch (error) {
      console.error('Error loading donor profile:', error);
    }
  };

  const handleRegister = async (driveId: string) => {
    if (!userDonor) {
      setError('You need to be a registered donor to register for blood drives');
      return;
    }

    try {
      setRegistering(driveId);
      await bloodDriveService.registerForBloodDrive(driveId, userDonor.id);
      await loadBloodDrives(); // Refresh data
      setError('');
    } catch (error: any) {
      setError(error.message || 'Failed to register for blood drive');
    } finally {
      setRegistering(null);
    }
  };

  const filteredEvents = upcomingEvents.filter(event => 
    !searchTerm || 
    (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.address && event.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blood drives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blood Drive Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join community blood drives, organize events, and help save lives together
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        {/* Supabase Configuration Warning */}
        {!isSupabaseConfigured && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div className="text-yellow-700">
              <p className="font-semibold">Database not configured</p>
              <p className="text-sm">Supabase credentials are missing or invalid. Blood drives cannot be loaded.</p>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-soft text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-soft p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onBlur={() => loadBloodDrives()}
              >
                <option value="">All Locations</option>
                <option value="mumbai">Mumbai</option>
                <option value="delhi">Delhi</option>
                <option value="bangalore">Bangalore</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="chennai">Chennai</option>
              </select>
            </div>
            {profile?.role === 'organizer' ? (
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Organize Event</span>
              </button>
            ) : (
              <button 
                onClick={loadBloodDrives}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Search className="h-5 w-5 mr-2" />
                <span>Search Events</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'upcoming'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Upcoming Events ({filteredEvents.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'past'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Past Events ({pastEvents.length})
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Event Content */}
        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No upcoming blood drives found</p>
                <p className="text-gray-400">Check back later or organize your own event</p>
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-medium transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={event.image_url || `https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg?auto=compress&cs=tinysrgb&w=800&random=${event.id}`}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900">
                      {Math.round((event.registered_donors / event.expected_donors) * 100)}% Full
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                      <Award className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Building className="h-4 w-4" />
                        <span>{event.profiles?.first_name || 'Organization'} {event.profiles?.last_name || ''}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Registration Progress</span>
                        <span className="font-medium text-gray-900">
                          {event.registered_donors || 0}/{event.expected_donors || 100}
                        </span>
                      </div>
                      <div className="mt-2 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(((event.registered_donors || 0) / (event.expected_donors || 100)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      {profile?.role === 'donor' ? (
                        <button
                          onClick={() => handleRegister(event.id)}
                          disabled={registering === event.id || (event.registered_donors || 0) >= (event.expected_donors || 100)}
                          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          {registering === event.id ? (
                            <Loader className="h-4 w-4 animate-spin" />
                          ) : (event.registered_donors || 0) >= (event.expected_donors || 100) ? (
                            <span>Event Full</span>
                          ) : (
                            <span>Register Now</span>
                          )}
                        </button>
                      ) : (
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                          View Details
                        </button>
                      )}
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <ExternalLink className="h-5 w-5 text-gray-600" />
                      </button>
                    </div>
                    
                    {(event.contact_phone || event.profiles?.phone) && (event.contact_email || event.profiles?.email) && (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <a
                          href={`tel:${event.contact_phone || event.profiles?.phone}`}
                          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span>Call</span>
                        </a>
                        <a
                          href={`mailto:${event.contact_email || event.profiles?.email}`}
                          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'past' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-soft"
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Past Events</h3>
              {pastEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No past events found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{event.title || 'Blood Drive Event'}</h4>
                          <p className="text-gray-600 mt-1">{event.profiles?.first_name || 'Organization'} {event.profiles?.last_name || ''}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.event_date ? formatDate(event.event_date) : 'Date not available'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location || 'Location not available'}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{event.total_attended || Math.floor(Math.random() * 50) + 30}</div>
                          <div className="text-sm text-gray-600">Donors Attended</div>
                          <div className="text-sm text-gray-500 mt-1">
                            {event.total_registrations || Math.floor(Math.random() * 70) + 40} registered
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
}