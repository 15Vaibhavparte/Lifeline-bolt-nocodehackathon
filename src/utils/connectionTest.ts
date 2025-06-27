import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔧 Testing Supabase Connection');
  console.log('===============================');
  console.log('Is Configured:', isSupabaseConfigured);
  console.log('Environment Variables:');
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
  
  try {
    console.log('🔍 Testing most basic query (SELECT *)...');
    
    // Test 1: Most basic query
    const basicQuery = supabase
      .from('blood_drives')
      .select('*')
      .limit(1);
    
    const timeoutPromise1 = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Basic query timeout after 5 seconds')), 5000)
    );
    
    const { data: basicData, error: basicError } = await Promise.race([basicQuery, timeoutPromise1]) as any;
    
    if (basicError) {
      console.error('❌ Basic query failed:', basicError);
      return { success: false, error: basicError };
    }
    
    console.log('✅ Basic query successful:', basicData);
    
    // Test 2: Try with specific columns
    console.log('🔍 Testing specific columns query...');
    const specificQuery = supabase
      .from('blood_drives')
      .select('id, title, event_date')
      .limit(1);
    
    const timeoutPromise2 = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Specific query timeout after 5 seconds')), 5000)
    );
    
    const { data: specificData, error: specificError } = await Promise.race([specificQuery, timeoutPromise2]) as any;
    
    if (specificError) {
      console.error('❌ Specific query failed:', specificError);
      return { success: false, error: specificError };
    }
    
    console.log('✅ Specific query successful:', specificData);
    return { success: true, data: specificData };
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
}
