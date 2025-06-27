// Simple test script to check Supabase connection
import { supabase, isSupabaseConfigured } from './src/lib/supabase.ts';

console.log('Supabase configured:', isSupabaseConfigured);
console.log('Environment variables:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('blood_drives')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Supabase connection successful, data:', data);
    }
  } catch (err) {
    console.error('Connection test failed:', err);
  }
}

testConnection();
