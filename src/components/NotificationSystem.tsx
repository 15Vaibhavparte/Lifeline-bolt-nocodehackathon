import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, CheckCircle, Info, Clock, Heart, Calendar } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { notificationService } from '../services/notificationService';
import { supabase } from '../lib/supabase';

interface NotificationSystemProps {
  className?: string;
}

export function NotificationSystem({ className = '' }: NotificationSystemProps) {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotification, setNewNotification] = useState<any | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [channel, setChannel] = useState<any>(null);

  // Load initial notifications
  useEffect(() => {
    if (user) {
      loadNotifications();
      setupRealtimeSubscription();
    }
    
    return () => {
      // Clean up subscription properly
      if (channel) {
        console.log('Cleaning up notification channel');
        supabase.removeChannel(channel);
        setChannel(null);
      }
    };
  }, [user]); // Remove channel from dependency to avoid infinite loops

  const loadNotifications = async () => {
    try {
      const userNotifications = await notificationService.getUserNotifications(user?.id || '');
      setNotifications(userNotifications || []);
      
      const count = userNotifications?.filter((n: any) => !n.is_read).length || 0;
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user || channel) return; // Don't create multiple subscriptions
    
    // Create a unique channel name to avoid conflicts
    const channelName = `notifications:${user.id}:${Date.now()}`;
    
    // Subscribe to notifications table for real-time updates
    const newChannel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, 
        (payload: any) => {
          handleNewNotification(payload.new);
        }
      )
      .subscribe();
      
    setChannel(newChannel);
    console.log('Subscribed to real-time notifications with channel:', channelName);
  };

  const handleNewNotification = (notification: any) => {
    // Update notifications list
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    setNewNotification(notification);
    setShowToast(true);
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
    
    // Play notification sound
    playNotificationSound(notification.type);
  };

  const playNotificationSound = (type: string) => {
    let sound: HTMLAudioElement;
    
    if (type.includes('emergency')) {
      sound = new Audio('/sounds/emergency-alert.mp3');
    } else if (type.includes('match')) {
      sound = new Audio('/sounds/match-found.mp3');
    } else {
      sound = new Audio('/sounds/notification.mp3');
    }
    
    sound.play().catch(e => console.log('Audio play failed:', e));
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(user?.id || '');
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes('emergency')) return AlertTriangle;
    if (type.includes('match') || type.includes('donor_accepted')) return CheckCircle;
    if (type.includes('blood_drive')) return Calendar;
    if (type.includes('donation')) return Heart;
    return Info;
  };

  const getNotificationColor = (type: string) => {
    if (type.includes('emergency')) return 'text-red-600 bg-red-100';
    if (type.includes('match') || type.includes('donor_accepted')) return 'text-green-600 bg-green-100';
    if (type.includes('blood_drive')) return 'text-blue-600 bg-blue-100';
    if (type.includes('donation')) return 'text-purple-600 bg-purple-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors rounded-full hover:bg-gray-100"
        aria-label="Notifications"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setShowNotifications(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Mark all as read
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      We'll notify you about blood requests, matches, and important updates
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => {
                      const NotificationIcon = getNotificationIcon(notification.type);
                      const colorClass = getNotificationColor(notification.type);
                      
                      return (
                        <div 
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50' : ''}`}
                          onClick={() => !notification.is_read && markAsRead(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full ${colorClass} flex-shrink-0`}>
                              <NotificationIcon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                              <div className="flex items-center mt-2 text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatTime(notification.created_at)}</span>
                              </div>
                            </div>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && newNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${getNotificationColor(newNotification.type)} flex-shrink-0`}>
                  {React.createElement(getNotificationIcon(newNotification.type), { className: "h-5 w-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900 text-sm">{newNotification.title}</p>
                    <button
                      onClick={() => setShowToast(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{newNotification.message}</p>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="h-1 bg-primary-600"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}