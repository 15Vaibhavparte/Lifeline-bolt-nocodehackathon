// Emergency debugging - test direct API access
// This will bypass the Supabase client and test direct REST API access

export async function testDirectApiAccess() {
  console.log('🚨 Emergency Test: Direct API Access');
  console.log('=====================================');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables');
    return;
  }

  try {
    // Test 1: Direct fetch to the REST API
    console.log('🔍 Test 1: Direct fetch to blood_drives...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/blood_drives?limit=5`, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response statusText:', response.statusText);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ Direct API call failed:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Direct API call successful!');
    console.log('📊 Data received:', data);
    console.log(`📊 Found ${data?.length || 0} blood drives`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Direct API test failed:', error);
  }
}

// Also test with service role key if available
export async function testWithServiceKey() {
  console.log('🔧 Testing with Service Role Key');
  console.log('=================================');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  // Try to get service key from environment
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id2p3eGVwdWJhamVvbXN6cGVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDI3MjA3NCwiZXhwIjoyMDY1ODQ4MDc0fQ.y7T1PgtWKuW8e41rXQOvZMrCXggeSN-XuG-N3POescE';
  
  if (!supabaseUrl || !serviceKey) {
    console.error('❌ Missing service role credentials');
    return;
  }

  try {
    console.log('🔍 Testing with service role key...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/blood_drives?limit=5`, {
      method: 'GET',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Service role response status:', response.status);
    
    if (!response.ok) {
      console.error('❌ Service role API call failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Service role API call successful!');
    console.log('📊 Service role data:', data);
    
    return data;
    
  } catch (error) {
    console.error('❌ Service role test failed:', error);
  }
}
