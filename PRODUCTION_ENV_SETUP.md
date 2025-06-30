# PRODUCTION ENVIRONMENT VARIABLES SETUP GUIDE
# Copy these to your Netlify Environment Variables

# ====== REQUIRED FOR PRODUCTION AUTH ======
VITE_SUPABASE_URL=https://obwjwxepubajeomszpei.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9id2p3eGVwdWJhamVvbXN6cGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNzIwNzQsImV4cCI6MjA2NTg0ODA3NH0.7bARwkh507Z7dCHIjDB3BjQhz_WZXRhJSi-y5cXniuc

# ====== SETUP INSTRUCTIONS ======
# 1. Go to your Netlify site dashboard
# 2. Navigate to Site settings > Environment variables
# 3. Add these variables one by one
# 4. Redeploy your site

# ====== VERIFICATION ======
# After setting up, check browser console in production for:
# ✅ "Creating real Supabase client"
# ❌ "Creating mock Supabase client - credentials missing"
