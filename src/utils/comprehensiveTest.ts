import { supabase } from '../lib/supabase';

export async function comprehensiveDatabaseTest() {
  console.log('🔧 Comprehensive Database Test');
  console.log('===============================');
  
  const tests = [
    {
      name: 'Test 1: Check if blood_drives table exists',
      test: async () => {
        const { data, error } = await supabase
          .from('blood_drives')
          .select('count', { count: 'exact', head: true });
        return { data, error };
      }
    },
    {
      name: 'Test 2: Simple select with no filters',
      test: async () => {
        const { data, error } = await supabase
          .from('blood_drives')
          .select('*')
          .limit(1);
        return { data, error };
      }
    },
    {
      name: 'Test 3: Select specific columns only',
      test: async () => {
        const { data, error } = await supabase
          .from('blood_drives')
          .select('id, title')
          .limit(1);
        return { data, error };
      }
    },
    {
      name: 'Test 4: Check table schema info',
      test: async () => {
        const { data, error } = await supabase.rpc('get_table_info', { table_name: 'blood_drives' });
        return { data, error };
      }
    },
    {
      name: 'Test 5: Count total records',
      test: async () => {
        const { count, error } = await supabase
          .from('blood_drives')
          .select('*', { count: 'exact', head: true });
        return { data: { count }, error };
      }
    }
  ];

  for (const testCase of tests) {
    try {
      console.log(`\n🔍 ${testCase.name}...`);
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Test timeout after 5 seconds')), 5000)
      );
      
      const result = await Promise.race([testCase.test(), timeoutPromise]);
      
      if (result.error) {
        console.error(`❌ ${testCase.name} failed:`, result.error);
      } else {
        console.log(`✅ ${testCase.name} passed:`, result.data);
      }
    } catch (error) {
      console.error(`❌ ${testCase.name} errored:`, error);
    }
  }

  // Final comprehensive test with debugging
  console.log('\n🔍 Final Test: Blood drives with active filter...');
  try {
    const { data, error, status, statusText } = await supabase
      .from('blood_drives')
      .select('id, title, event_date, is_active')
      .eq('is_active', true)
      .limit(5);
    
    console.log('Response status:', status);
    console.log('Response statusText:', statusText);
    
    if (error) {
      console.error('❌ Final test failed:', error);
    } else {
      console.log('✅ Final test passed:', data);
      console.log(`📊 Found ${data?.length || 0} active blood drives`);
    }
  } catch (error) {
    console.error('❌ Final test errored:', error);
  }
}
