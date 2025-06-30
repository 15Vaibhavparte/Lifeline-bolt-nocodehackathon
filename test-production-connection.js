import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : 'NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT SET');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Environment variables not set properly');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('blood_drives')
      .select('*', { count: 'exact' })
      .limit(1);

    if (error) {
      console.error('❌ Connection failed:', error);
      return;
    }

    console.log('✅ Basic connection successful');

    // Test actual data retrieval
    const { data: drives, error: drivesError } = await supabase
      .from('blood_drives')
      .select(`
        id,
        title,
        event_date,
        is_active,
        address
      `)
      .eq('is_active', true)
      .gte('event_date', new Date().toISOString().split('T')[0])
      .order('event_date', { ascending: true })
      .limit(5);

    if (drivesError) {
      console.error('❌ Data retrieval failed:', drivesError);
      return;
    }

    console.log('✅ Data retrieval successful');
    console.log(`📊 Found ${drives?.length || 0} upcoming blood drives`);
    
    if (drives && drives.length > 0) {
      console.log('\n📋 Sample blood drives:');
      drives.forEach((drive, index) => {
        console.log(`${index + 1}. ${drive.title} - ${drive.event_date} at ${drive.address}`);
      });
    } else {
      console.log('⚠️ No upcoming blood drives found');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testConnection();
