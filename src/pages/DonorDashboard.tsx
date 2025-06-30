import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Award, 
  Bell,
  Calendar,
  Users,
  Settings,
  Shield,
  Droplets,
  Phone,
  CheckCircle
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';
import { donorService } from '../services/donorService';

export function DonorDashboard() {
  const [isAvailable, setIsAvailable] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      loadDonorProfile();
      loadNotifications();
      
      // Setup realtime notifications and store the cleanup function
      const unsubscribe = setupRealtimeNotifications();
      
      // Cleanup function to unsubscribe when component unmounts or user changes
      return () => {
        if (unsubscribe && typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [user]);

  const loadDonorProfile = async () => {
    try {
      if (user) {
        const donor = await donorService.getDonorByUserId(user.id);
        setDonorProfile(donor);
        setIsAvailable(donor?.availability_status === 'available');
      }
    } catch (error) {
      console.error('Error loading donor profile:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      setLoading(true);
      if (user) {
        const userNotifications = await notificationService.getUserNotifications(user.id, 10);
        
        // Transform notifications to the format expected by the UI
        const formattedNotifications = userNotifications.map((notification: any) => ({
          id: notification.id,
          type: notification.type.includes('emergency') ? 'urgent' : 'normal',
          message: notification.message,
          time: formatTimeAgo(notification.created_at),
          distance: notification.data?.distance || 'Unknown',
          requestId: notification.data?.requestId,
          is_read: notification.is_read
        }));
        
        setNotifications(formattedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeNotifications = (): (() => void) | null => {
    if (!user) return null;
    
    return notificationService.subscribeToNotifications(user.id, (newNotification) => {
      // Add the new notification to the list
      const formattedNotification = {
        id: newNotification.id,
        type: newNotification.type.includes('emergency') ? 'urgent' : 'normal',
        message: newNotification.message,
        time: 'Just now',
        distance: newNotification.data?.distance || 'Unknown',
        requestId: newNotification.data?.requestId,
        is_read: false
      };
      
      setNotifications(prev => [formattedNotification, ...prev]);
      
      // Play sound for urgent notifications
      if (newNotification.type.includes('emergency')) {
        const sound = new Audio('/sounds/emergency-alert.mp3');
        sound.play().catch(e => console.log('Audio play failed:', e));
      }
    });
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

  const handleAvailabilityToggle = async () => {
    try {
      if (!donorProfile) return;
      
      const newStatus = isAvailable ? 'unavailable' : 'available';
      await donorService.updateAvailability(donorProfile.id, newStatus as any);
      
      setIsAvailable(!isAvailable);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const handleAcceptRequest = async (notification: any) => {
    try {
      // In a real app, this would accept the blood request match
      // For now, just mark the notification as read
      await notificationService.markAsRead(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      
      // Show confirmation
      alert('Request accepted! The recipient will be notified.');
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleDeclineRequest = async (notification: any) => {
    try {
      // In a real app, this would decline the blood request match
      // For now, just mark the notification as read
      await notificationService.markAsRead(notification.id);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n.id !== notification.id)
      );
    } catch (error) {
      console.error('Failed to decline request:', error);
    }
  };

  const donationHistory = [
    { date: '2024-01-15', location: 'City Hospital', type: 'O+', status: 'Completed' },
    { date: '2023-11-20', location: 'Red Cross Center', type: 'O+', status: 'Completed' },
    { date: '2023-08-10', location: 'Apollo Hospital', type: 'O+', status: 'Completed' },
  ];

  const stats = [
    { label: 'Total Donations', value: '12', icon: Heart, color: 'text-red-600 bg-red-100' },
    { label: 'Lives Saved', value: '36', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { label: 'Donation Points', value: '2,400', icon: Award, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Next Eligible', value: '45 days', icon: Calendar, color: 'text-green-600 bg-green-100' },
  ];

  const upcomingEvents = [
    {
      title: 'Community Blood Drive',
      date: '2024-02-15',
      time: '9:00 AM - 5:00 PM',
      location: 'Central Community Center',
      distance: '1.2 km',
    },
    {
      title: 'Corporate Blood Camp',
      date: '2024-02-20',
      time: '10:00 AM - 4:00 PM',
      location: 'Tech Park Convention Hall',
      distance: '3.5 km',
    },
  ];

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
              <h1 className="text-3xl font-bold text-gray-900">Donor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, Rahul! Ready to save lives today?</p>
            </div>
            
            {/* Availability Toggle */}
            <div className="mt-4 lg:mt-0 flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">Availability Status:</span>
                <button
                  onClick={handleAvailabilityToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    isAvailable ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      isAvailable ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Requests */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Active Blood Requests</h2>
                  <Bell className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading notifications...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          notification.type === 'urgent'
                            ? 'bg-red-50 border-red-500'
                            : 'bg-blue-50 border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-medium ${
                              notification.type === 'urgent' ? 'text-red-900' : 'text-blue-900'
                            }`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <span className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{notification.time}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{notification.distance}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              onClick={() => handleAcceptRequest(notification)}>
                              Accept
                            </button>
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                              onClick={() => handleDeclineRequest(notification)}>
                              Decline
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No active blood requests at the moment</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Donation History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Donation History</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {donationHistory.map((donation, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <Droplets className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{donation.location}</p>
                          <p className="text-sm text-gray-600">{donation.date} • {donation.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-600">{donation.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-soft p-6"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {donorProfile?.profiles?.first_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'D'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {donorProfile?.profiles?.first_name} {donorProfile?.profiles?.last_name || ''}
                </h3>
                <p className="text-gray-600">Blood Type: {donorProfile?.blood_type || 'Unknown'}</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600 font-medium">Verified Donor</span>
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  Update Profile
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
              </div>
            </motion.div>

            {/* Upcoming Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-soft"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                        Register
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white"
            >
              <div className="text-center">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <h3 className="text-lg font-semibold mb-2">Emergency Hotline</h3>
                <p className="text-red-100 text-sm mb-4">
                  Available 24/7 for urgent blood requests
                </p>
                <a
                  href="tel:108"
                  className="block w-full bg-white text-red-600 py-3 px-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
                >
                  Call 108
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}