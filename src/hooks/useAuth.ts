import { useState, useEffect } from 'react';
import { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase, Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // Handle the specific case where profile doesn't exist yet (common during signup)
        if (error.code === 'PGRST116') {
          // Profile doesn't exist yet - this is expected during signup flow
          setProfile(null);
        } else {
          console.error('Error fetching profile:', error);
        }
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      console.log('🔄 Starting signup process for:', email);
      console.log('🔧 Environment check:', {
        hasUrl: !!import.meta.env.VITE_SUPABASE_URL,
        hasKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        mode: import.meta.env.MODE
      });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData // Pass user data to auth metadata for better profile creation
        }
      });

      if (error) {
        console.error('❌ Signup error details:', {
          message: error.message,
          status: error.status,
          code: error.code || 'NO_CODE'
        });
        
        // Handle specific error cases with user-friendly messages
        if (error.message.includes('email_address_invalid')) {
          throw new Error('Please enter a valid email address');
        }
        if (error.message.includes('password_too_short')) {
          throw new Error('Password must be at least 6 characters long');
        }
        if (error.message.includes('signup_disabled')) {
          throw new Error('Account creation is currently disabled. Please contact support.');
        }
        if (error.message.includes('invalid_credentials')) {
          throw new Error('Invalid email or password format');
        }
        
        throw error;
      }

      console.log('✅ Signup successful:', data);

      if (data.user) {
        // Only create profile if user is confirmed or email confirmation is disabled
        if (data.user.email_confirmed_at || !data.user.confirmation_sent_at) {
          console.log('🔄 Creating user profile...');
          
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email!,
                ...userData,
              },
            ]);

          if (profileError) {
            console.error('❌ Profile creation error:', profileError);
            throw profileError;
          }
          
          console.log('✅ Profile created successfully');
        } else {
          console.log('📧 Confirmation email sent. User needs to confirm email before profile creation.');
        }
      }

      return data;
    } catch (error) {
      console.error('❌ SignUp failed:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user logged in');

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    
    setProfile(data);
    return data;
  };

  return {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
}