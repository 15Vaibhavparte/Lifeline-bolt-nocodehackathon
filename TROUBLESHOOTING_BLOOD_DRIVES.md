# Blood Drive Issues Troubleshooting Guide

## Issue: Blood drives not loading in production

### Possible Causes and Solutions:

1. **Environment Variables Not Set in Production**
   - Check if `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in production
   - For hosting platforms like Vercel, Netlify, etc., add these as environment variables in the dashboard
   - Make sure the variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

2. **Check Supabase Database Connection**
   - Open browser dev tools and check the console for errors
   - Look for the environment check logs to see if credentials are detected
   - Check the network tab for failed requests to Supabase

3. **Database Issues**
   - Verify that the blood_drives table exists in Supabase
   - Check if migrations have been run properly
   - Ensure Row Level Security (RLS) policies allow reading blood_drives

4. **Date/Timezone Issues**
   - The app filters blood drives by date range
   - Check if sample data has dates in the correct range
   - Verify timezone handling between client and server

## Quick Debug Steps:

1. Open browser dev tools
2. Go to Console tab
3. Look for "Environment check:" log to see if Supabase credentials are detected
4. Look for "Loading blood drives with date range:" to see query parameters
5. Check for any error messages in the console
6. Go to Network tab and check for failed Supabase API calls

## Testing Commands:

```bash
# Test in development
npm run dev

# Test production build locally
npm run build
npm run preview

# Check environment variables (in production environment)
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

## Common Solutions:

1. **For Vercel deployment:**
   - Go to project settings → Environment Variables
   - Add `VITE_SUPABASE_URL` with your Supabase project URL
   - Add `VITE_SUPABASE_ANON_KEY` with your Supabase anon key
   - Redeploy the application

2. **For Netlify deployment:**
   - Go to Site settings → Environment variables
   - Add the same variables as above
   - Redeploy the application

3. **For other hosting platforms:**
   - Check the platform's documentation for setting environment variables
   - Ensure the variables are available at build time (not just runtime)
