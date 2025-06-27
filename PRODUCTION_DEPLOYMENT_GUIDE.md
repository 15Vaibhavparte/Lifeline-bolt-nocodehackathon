# Production Deployment Checklist for Blood Drive App

## ✅ Environment Variables Setup

### Required Environment Variables:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Platform-Specific Setup:

#### Vercel:
1. Go to Project Settings → Environment Variables
2. Add both variables with Production scope
3. Redeploy the project

#### Netlify:
1. Go to Site Settings → Environment Variables  
2. Add both variables
3. Trigger a new deploy

#### Other Platforms:
- Check platform documentation for environment variable setup
- Ensure variables are available at BUILD TIME, not just runtime

## ✅ Database Setup

### Supabase Configuration:
1. Ensure your Supabase project is active
2. **CRITICAL**: Run database migrations to create tables AND insert sample data
3. Check that migrations have been applied:
   ```sql
   -- Verify blood_drives table exists and has data
   SELECT count(*) FROM blood_drives;
   SELECT * FROM blood_drives WHERE is_active = true ORDER BY event_date LIMIT 5;
   ```

### ⚠️ MOST COMMON ISSUE: Empty Database
If blood drives don't load, the table is likely empty. Run this SQL in Supabase:

```sql
-- Insert sample blood drives
INSERT INTO blood_drives (
  id, title, description, event_date, start_time, end_time, 
  location, address, expected_donors, registered_donors, 
  contact_phone, contact_email, is_active
) VALUES 
(gen_random_uuid(), 'Community Blood Drive', 'Join us for a community blood donation event.', '2025-07-15', '09:00:00', '17:00:00', 'Community Center', '123 Main Street', 100, 0, '+1-555-0123', 'events@community.org', true),
(gen_random_uuid(), 'Hospital Emergency Drive', 'Emergency blood collection drive.', '2025-08-01', '10:00:00', '16:00:00', 'City Hospital', '456 Hospital Avenue', 150, 0, '+1-555-0456', 'blood@hospital.org', true);
```

4. Verify Row Level Security policies allow public read access to blood_drives:
   ```sql
   -- Check RLS policies
   SELECT * FROM pg_policies WHERE tablename = 'blood_drives';
   ```

### Sample Data:
Run these commands in Supabase SQL Editor to add sample events:

```sql
-- Insert sample upcoming blood drives
INSERT INTO blood_drives (id, organizer_id, title, description, event_date, start_time, end_time, location, address, expected_donors, registered_donors, contact_phone, contact_email, is_active)
VALUES
(gen_random_uuid(), (SELECT id FROM profiles WHERE role = 'organizer' LIMIT 1), 'Community Blood Drive', 'Join us for a community blood donation event.', '2025-07-15', '09:00:00', '17:00:00', 'Community Center', '123 Main St, Your City', 100, 0, '+1234567890', 'contact@example.com', true),
(gen_random_uuid(), (SELECT id FROM profiles WHERE role = 'organizer' LIMIT 1), 'Hospital Blood Camp', 'Emergency blood collection drive.', '2025-08-01', '10:00:00', '16:00:00', 'City Hospital', '456 Hospital Rd, Your City', 150, 0, '+1234567891', 'hospital@example.com', true);
```

## ✅ Common Issues & Solutions

### Issue 1: "No upcoming blood drives found"

**Debugging Steps:**
1. Open browser dev tools (F12)
2. Check Console tab for errors
3. Look for the Debug Panel (blue database icon in bottom-right)
4. Click "Run Diagnostics" to see detailed info

**Common Causes:**
- Environment variables not set correctly
- Database connection issues
- Date filtering problems
- No data in the database

### Issue 2: Supabase Connection Errors

**Check:**
- Supabase project URL is correct
- Anon key is valid and not expired
- Project is not paused/disabled
- Network connectivity to Supabase

### Issue 3: Date Range Issues

**Verify:**
- Sample data has event_date in the future
- Timezone handling is correct
- Date format is YYYY-MM-DD

## ✅ Pre-Deployment Testing

### Local Production Build:
```bash
# Test production build locally
npm run build
npm run preview

# Check for console errors
# Verify environment variables are loaded
# Test blood drives page functionality
```

### Environment Variable Test:
```javascript
// Add to browser console to verify:
console.log('Environment check:', {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET'
});
```

## ✅ Post-Deployment Verification

1. Visit the blood drives page: `/blood-drives`
2. Check for sample events or "No upcoming blood drives found"
3. Open debug panel and run diagnostics
4. Verify console shows no errors
5. Test search and filtering functionality

## 🚨 Emergency Fix

If blood drives still don't load in production:

1. **Quick Database Check:**
   ```sql
   -- In Supabase SQL Editor
   SELECT count(*) FROM blood_drives WHERE is_active = true;
   SELECT * FROM blood_drives WHERE event_date >= CURRENT_DATE ORDER BY event_date LIMIT 5;
   ```

2. **Add Debug Info Temporarily:**
   - The app includes a debug panel (blue database icon)
   - Use it to check environment and database status

3. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for API errors or failed queries

4. **Verify RLS Policies:**
   ```sql
   -- Temporarily disable RLS for testing (NOT for production!)
   ALTER TABLE blood_drives DISABLE ROW LEVEL SECURITY;
   ```

## 📞 Support

If issues persist:
1. Check the debug panel output
2. Copy console errors
3. Verify all environment variables are set
4. Test the production build locally first
