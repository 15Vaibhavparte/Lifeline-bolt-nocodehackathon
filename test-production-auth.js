// Production Authentication Test Script
// Run this in your browser console on the production site to debug auth issues

console.log('🔧 Production Authentication Debug Test');
console.log('=====================================');

// Step 1: Check environment variables
console.log('\n1. Environment Variables:');
const hasSupabaseUrl = window.location.hostname !== 'localhost' ? 
  'CHECK_DEPLOYMENT_VARS' : 
  !!import.meta?.env?.VITE_SUPABASE_URL;
const hasSupabaseKey = window.location.hostname !== 'localhost' ? 
  'CHECK_DEPLOYMENT_VARS' : 
  !!import.meta?.env?.VITE_SUPABASE_ANON_KEY;

console.log('Hostname:', window.location.hostname);
console.log('VITE_SUPABASE_URL:', hasSupabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY:', hasSupabaseKey);

// Step 2: Test Supabase API directly
console.log('\n2. Testing Supabase API Direct Connection:');

const testSignup = async () => {
  try {
    // Replace with your actual Supabase project URL and anon key
    const SUPABASE_URL = 'https://obwjwxepubajeomszpei.supabase.co';
    const SUPABASE_ANON_KEY = 'your-anon-key-here'; // Replace with actual key
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        email: 'test-' + Date.now() + '@example.com',
        password: 'testpassword123'
      })
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseData = await response.json();
    console.log('Response Data:', responseData);
    
    if (!response.ok) {
      console.error('❌ API Error:', responseData);
      
      // Analyze specific error types
      if (response.status === 400) {
        console.log('\n🔍 400 Error Analysis:');
        if (responseData.error?.includes('invalid_credentials')) {
          console.log('- Issue: Invalid credentials format');
          console.log('- Fix: Check email/password validation');
        }
        if (responseData.error?.includes('signup_disabled')) {
          console.log('- Issue: Signup is disabled in Supabase');
          console.log('- Fix: Enable signup in Auth settings');
        }
        if (responseData.error?.includes('email_address_invalid')) {
          console.log('- Issue: Email format invalid');
          console.log('- Fix: Use proper email format');
        }
      }
    } else {
      console.log('✅ API Test Successful');
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error);
    console.log('- Check if CORS is configured correctly');
    console.log('- Verify your domain is whitelisted in Supabase');
  }
};

// Step 3: Check domain configuration
console.log('\n3. Domain Configuration Check:');
console.log('Current Domain:', window.location.origin);
console.log('Protocol:', window.location.protocol);
console.log('Is HTTPS:', window.location.protocol === 'https:');

if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
  console.warn('⚠️ Not using HTTPS in production - this may cause auth issues');
}

// Step 4: Check for existing Supabase client
console.log('\n4. Supabase Client Check:');
if (window.supabase) {
  console.log('✅ Supabase client found in window');
} else {
  console.log('❌ No Supabase client found - check if app loaded properly');
}

// Step 5: Run the test
console.log('\n5. Running API Test...');
testSignup();

// Step 6: Manual test instructions
console.log('\n6. Manual Test Instructions:');
console.log('=====================================');
console.log('After fixing the issues above:');
console.log('1. Try creating an account through the UI');
console.log('2. Check Network tab for the signup request');
console.log('3. Look for specific error messages in response');
console.log('4. Verify the request headers include proper apikey');
console.log('');
console.log('Common Fixes:');
console.log('- Add your domain to Supabase Auth URLs');
console.log('- Check environment variables in deployment');
console.log('- Verify signup is enabled in Supabase settings');
console.log('- Ensure CORS is configured for your domain');

export {};
