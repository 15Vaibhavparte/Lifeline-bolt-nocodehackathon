import { supabase } from '../lib/supabase';

export async function testDatabaseAccess() {
  console.log('🔧 Testing Database Access After RLS Fix');
  console.log('==========================================');
  
  try {
    // Test 1: Most basic query possible
    console.log('🔍 Test 1: Basic table access...');
    const { data: basicData, error: basicError } = await supabase
      .from('blood_drives')
      .select('id')
      .limit(1);
    
    if (basicError) {
      console.error('❌ Basic access failed:', basicError);
      return false;
    }
    
    console.log('✅ Basic access successful!');
    
    // Test 2: Get actual data
    console.log('🔍 Test 2: Getting blood drive data...');
    const { data: driveData, error: driveError } = await supabase
      .from('blood_drives')
      .select('id, title, event_date, location')
      .limit(5);
    
    if (driveError) {
      console.error('❌ Data retrieval failed:', driveError);
      return false;
    }
    
    console.log('✅ Data retrieval successful!');
    console.log(`📊 Found ${driveData?.length || 0} blood drives:`, driveData);
    
    return true;
  } catch (error) {
    console.error('❌ Database access test failed:', error);
    return false;
  }
}
