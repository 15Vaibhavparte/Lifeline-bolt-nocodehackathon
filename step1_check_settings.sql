-- Step 1: Check current settings
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'blood_drives', 'blood_requests');
