import { supabase, Notification } from '../lib/supabase';

export const notificationService = {
  // Subscribe to real-time notifications with retry mechanism
  subscribeToNotifications(userId: string, callback: (notification: any) => void) {
    let retryCount = 0;
    const maxRetries = 3;
    
    const createSubscription = () => {
      console.log(`📡 Creating notification subscription for user ${userId} (attempt ${retryCount + 1}/${maxRetries + 1})`);
      
      const channel = supabase
        .channel(`public:notifications:user_id=eq.${userId}`)
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${userId}`
          }, 
          (payload: any) => {
            console.log('📨 Received notification:', payload.new);
            callback(payload.new);
          }
        )
        .subscribe((status: any) => {
          console.log(`📡 Subscription status: ${status}`);
          
          if (status === 'SUBSCRIPTION_ERROR' && retryCount < maxRetries) {
            console.log(`❌ Subscription error, retrying in 2 seconds... (${retryCount + 1}/${maxRetries})`);
            retryCount++;
            setTimeout(() => {
              supabase.removeChannel(channel);
              createSubscription();
            }, 2000);
          } else if (status === 'SUBSCRIBED') {
            console.log('✅ Successfully subscribed to notifications');
            retryCount = 0; // Reset retry count on success
          }
        });

      return channel;
    };

    const channel = createSubscription();

    // Return a cleanup function that unsubscribes from the channel
    return () => {
      console.log('🧹 Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  },

  // Create a new notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'created_at' | 'is_read'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert([{ ...notificationData, is_read: false }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get notifications for a user
  async getUserNotifications(userId: string, limit: number = 50) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Mark all notifications as read for a user
  async markAllAsRead(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return data;
  },

  // Get unread notification count
  async getUnreadCount(userId: string) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  },

  // Delete notification
  async deleteNotification(notificationId: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) throw error;
  },

  // Create bulk notifications (for emergency broadcasts)
  async createBulkNotifications(notifications: Omit<Notification, 'id' | 'created_at' | 'is_read'>[]) {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notifications.map(n => ({ 
        ...n, 
        is_read: false,
        // Add a small delay between notifications to ensure they're processed in order
        created_at: new Date(Date.now() + Math.random() * 1000).toISOString()
      })))
      .select();

    if (error) throw error;
    return data;
  },

  // Send emergency notification to all eligible donors
  async sendEmergencyAlert(data: {
    bloodType: string;
    hospitalName: string;
    location: string;
    urgencyLevel: string;
    requestId: string;
  }) {
    try {
      // In a real app, this would query eligible donors and send them notifications
      // For demo purposes, we'll just create a notification for the current user
      
      const { data: eligibleDonors } = await supabase
        .from('donors')
        .select('user_id')
        .eq('blood_type', data.bloodType)
        .eq('is_eligible', true)
        .eq('availability_status', 'available')
        .limit(20);
      
      if (!eligibleDonors || eligibleDonors.length === 0) {
        console.log('No eligible donors found');
        return [];
      }
      
      // Create notifications for all eligible donors
      const notifications = eligibleDonors.map((donor: any) => ({
        user_id: donor.user_id,
        title: `🚨 EMERGENCY: ${data.bloodType} Blood Needed`,
        message: `Urgent request at ${data.hospitalName}. Your blood type is needed immediately.`,
        type: 'emergency_request',
        data: { 
          requestId: data.requestId,
          urgencyLevel: data.urgencyLevel,
          hospitalName: data.hospitalName,
          location: data.location
        },
      }));
      
      return await notificationService.createBulkNotifications(notifications);
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      throw error;
    }
  },
};