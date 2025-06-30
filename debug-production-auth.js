// Production Authentication Error Diagnostics
// Copy and paste this into your browser console on the production site

console.log('🔧 Production Auth Diagnostics');
console.log('============================');

// Test 1: Check environment variables in production
console.log('\n1. Environment Variables Check:');
console.log('Domain:', window.location.hostname);
console.log('Protocol:', window.location.protocol);
console.log('Full URL:', window.location.href);

// Test 2: Direct API test with your actual credentials
const SUPABASE_URL = 'https://obwjwxepubajeomszpei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id2p3eGVwdWJhamVvbXN6cGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzIwNzQsImV4cCI6MjA2NTg0ODA3NH0.7bARwkh507Z7dCHIjDB3BjQhz_WZXRhJSi-y5cXniuc';

console.log('\n2. Direct API Test:');

async function testAuth() {
  try {
    const testEmail = `test-${Date.now()}@test.com`;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Origin': window.location.origin,
        'Referer': window.location.href
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'TestPassword123!'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Response Headers:', headers);

    const responseText = await response.text();
    console.log('Raw Response:', responseText);

    try {
      const responseJson = JSON.parse(responseText);
      console.log('Parsed Response:', responseJson);
      
      if (!response.ok) {
        console.log('\n🔍 Error Analysis:');
        if (responseJson.error_description) {
          console.log('Error Description:', responseJson.error_description);
        }
        if (responseJson.error) {
          console.log('Error Type:', responseJson.error);
        }
        
        // Specific 400 error analysis
        if (response.status === 400) {
          console.log('\n❌ 400 Bad Request Specific Analysis:');
          const errorMsg = responseJson.error_description || responseJson.msg || responseJson.message || 'Unknown error';
          
          if (errorMsg.includes('email_address_invalid')) {
            console.log('🔧 Fix: Email validation issue');
          } else if (errorMsg.includes('password_too_short')) {
            console.log('🔧 Fix: Password too short');
          } else if (errorMsg.includes('signup_disabled')) {
            console.log('🔧 Fix: Signup disabled in Supabase settings');
            console.log('   Go to Supabase Dashboard > Auth > Settings');
            console.log('   Enable "Allow new users to sign up"');
          } else if (errorMsg.includes('invalid_request')) {
            console.log('🔧 Fix: Request format issue');
          } else if (errorMsg.includes('domain_not_allowed')) {
            console.log('🔧 Fix: Domain not whitelisted');
            console.log('   Add your domain to Supabase Auth URLs');
          } else {
            console.log('🔧 Generic 400 error:', errorMsg);
            console.log('   Most likely: Signup disabled or domain not allowed');
          }
        }
      } else {
        console.log('✅ API Test Successful!');
      }
    } catch (parseError) {
      console.log('Response is not JSON:', responseText);
    }

  } catch (networkError) {
    console.error('❌ Network Error:', networkError);
    console.log('This could indicate:');
    console.log('- CORS issues');
    console.log('- Network connectivity problems');
    console.log('- Firewall blocking the request');
  }
}

// Test 3: Check CORS preflight
console.log('\n3. CORS Preflight Test:');
fetch(`${SUPABASE_URL}/auth/v1/signup`, {
  method: 'OPTIONS',
  headers: {
    'Origin': window.location.origin,
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'Content-Type, apikey, Authorization'
  }
}).then(response => {
  console.log('CORS Preflight Status:', response.status);
  console.log('CORS Headers:', Object.fromEntries(response.headers.entries()));
}).catch(error => {
  console.log('CORS Preflight Failed:', error);
});

// Test 4: Check if Supabase client exists and is configured
console.log('\n4. Supabase Client Check:');
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client found');
} else {
  console.log('❌ No Supabase client found');
}

// Run the main test
console.log('\n🚀 Running Auth Test...');
testAuth();

console.log('\n📋 Next Steps:');
console.log('1. Check the error analysis above');
console.log('2. Go to Supabase Dashboard > Authentication > Settings');
console.log('3. Ensure "Allow new users to sign up" is enabled');
console.log('4. Add your production domain to Site URL and Redirect URLs');
console.log('5. If using email confirmation, configure it properly');
console.log('6. Try the signup again after making changes');

export {};
