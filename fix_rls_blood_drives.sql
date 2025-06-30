@-- Fix Row Level Security for blood_drives table
-- Run this in your Supabase SQL Editor

-- 1. First, let's check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'blood_drives';

-- 2. Disable RLS temporarily to test (you can re-enable later with proper policies)
ALTER TABLE public.blood_drives DISABLE ROW LEVEL SECURITY;

-- 3. Or if you want to keep RLS enabled, create a policy for anonymous read access
-- ALTER TABLE public.blood_drives ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anonymous users to read blood drives
-- CREATE POLICY "Allow anonymous read access to blood drives" 
-- ON public.blood_drives 
-- FOR SELECT 
-- TO anon 
-- USING (true);

-- 4. Grant necessary permissions to anonymous users
GRANT SELECT ON public.blood_drives TO anon;
GRANT USAGE ON SCHEMA public TO anon;
