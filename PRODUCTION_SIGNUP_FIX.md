# Production Signup 400 Error Fix

## Problem
Getting `400 Bad Request` error when trying to sign up in production:
```
POST https://obwjwxepubajeomszpei.supabase.co/auth/v1/signup 400 (Bad Request)
```

## Root Causes
This error typically occurs due to:
1. **Email confirmation settings** - Production requires email confirmation but development doesn't
2. **CORS/Domain validation** - Production domain not whitelisted in Supabase
3. **Authentication policies** - RLS policies blocking user creation
4. **Environment variables** - Missing or incorrect credentials

## 🚨 IMMEDIATE FIXES (Choose One)

### Option A: Quick Fix - Disable Email Confirmation
**Best for immediate deployment**

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Under **Email Auth**, find "**Confirm email**"
4. **Disable** "Confirm email" setting
5. Save changes
6. Redeploy your application

### Option B: Proper Fix - Configure Email Confirmation
**Best for production security**

1. Go to your Supabase Dashboard
2. Navigate to **Authentication > Settings**
3. Under **Email Auth**:
   - Enable "Confirm email"
   - Set **Site URL** to your production domain (e.g., `https://your-app.netlify.app`)
   - Add **Redirect URLs** for your production domain
4. Configure **Email Templates** if needed
5. Save changes

## 🔧 DETAILED FIXES

### 1. Fix Domain Configuration

#### In Supabase Dashboard:
1. Go to **Authentication > URL Configuration**
2. Add your production domain to **Site URL**:
   ```
   https://your-app.netlify.app
   ```
3. Add redirect URLs:
   ```
   https://your-app.netlify.app/**
   https://your-app.netlify.app/auth/callback
   ```

### 2. Fix Authentication Policies

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Check if profiles table exists
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create proper policies
CREATE POLICY "Users can read their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- Grant necessary permissions
GRANT ALL ON public.profiles TO authenticated;
```

### 3. Fix Environment Variables

#### For Netlify:
1. Go to **Site Settings > Environment Variables**
2. Ensure these are set:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. **Redeploy** the site after adding variables

#### For Vercel:
1. Go to **Project Settings > Environment Variables**
2. Add the same variables with **Production** scope
3. **Redeploy** the project

### 4. Update Authentication Flow

Add better error handling to the signup process:

```typescript
// In src/hooks/useAuth.ts
const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
  try {
    console.log('🔄 Starting signup process for:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData // Pass user data to auth metadata
      }
    });

    if (error) {
      console.error('❌ Signup error:', error);
      
      // Handle specific error cases
      if (error.message.includes('email_address_invalid')) {
        throw new Error('Please enter a valid email address');
      }
      if (error.message.includes('password_too_short')) {
        throw new Error('Password must be at least 6 characters long');
      }
      if (error.message.includes('signup_disabled')) {
        throw new Error('Account creation is currently disabled');
      }
      
      throw error;
    }

    console.log('✅ Signup successful:', data);
    return data;
    
  } catch (error) {
    console.error('❌ SignUp failed:', error);
    throw error;
  }
};
```

## 🧪 TESTING

### Test in Development:
```bash
npm run dev
# Try to create an account
```

### Test Production Build Locally:
```bash
npm run build
npm run preview
# Try to create an account
```

### Test Production:
1. Deploy to your hosting platform
2. Try to create an account
3. Check browser console for detailed error messages

## 🔍 DEBUGGING

### Check Browser Console:
Look for these messages:
- `Environment check:` - Shows if Supabase is configured
- `❌ Signup error:` - Shows the actual error details
- Network tab - Check the failed request details

### Check Supabase Logs:
1. Go to Supabase Dashboard
2. Navigate to **Logs > Auth Logs**
3. Look for failed signup attempts
4. Check error details

## 🎯 QUICK TEST

Run this in your browser console on the production site:

```javascript
// Test Supabase connection
console.log('Testing Supabase connection...');
console.log('URL:', window.ENV?.VITE_SUPABASE_URL || 'NOT_SET');
console.log('Key:', window.ENV?.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET');

// Test signup API directly
fetch('https://your-project.supabase.co/auth/v1/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': 'your-anon-key-here'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'testpassword123'
  })
}).then(response => {
  console.log('Response status:', response.status);
  return response.json();
}).then(data => {
  console.log('Response data:', data);
}).catch(error => {
  console.error('Error:', error);
});
```

## ✅ SUCCESS INDICATORS

After applying the fixes, you should see:
- ✅ No more 400 errors during signup
- ✅ Users can successfully create accounts
- ✅ Email confirmation works (if enabled)
- ✅ User profiles are created properly

## 🆘 STILL NOT WORKING?

If the issue persists:

1. **Check Supabase Service Status**: https://status.supabase.com/
2. **Contact Support**: Include the exact error message and your project ID
3. **Try Alternative**: Use social authentication (Google, GitHub) as a temporary workaround

## 📞 EMERGENCY WORKAROUND

If you need to deploy immediately and can't fix the issue:

1. **Disable Authentication** temporarily:
   ```typescript
   // In your component
   const handleSignup = () => {
     alert('Account creation is temporarily disabled. Please try again later.');
   };
   ```

2. **Use Social Auth** instead:
   ```typescript
   const signUpWithGoogle = async () => {
     const { data, error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
         redirectTo: `${window.location.origin}/auth/callback`
       }
     });
   };
   ```

Remember to re-enable normal authentication once the issue is resolved!
