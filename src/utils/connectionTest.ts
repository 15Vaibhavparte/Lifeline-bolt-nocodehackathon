import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function testSupabaseConnection() {
  console.log('🔧 Testing Supabase Connection');
  console.log('===============================');
  console.log('Is Configured:', isSupabaseConfigured);
  console.log('Environment Variables:');
  console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
  console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
  
  try {
    console.log('🔍 Testing basic query...');
    const { data, error } = await supabase
      .from('blood_drives')
      .select('id, title, event_date')
      .limit(1);
    
    if (error) {
      console.error('❌ Query failed:', error);
      return { success: false, error };
    }
    
    console.log('✅ Query successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return { success: false, error };
  }
}
