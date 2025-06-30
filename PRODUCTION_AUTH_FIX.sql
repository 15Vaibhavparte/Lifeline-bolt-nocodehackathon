-- CRITICAL: Run this in your Supabase SQL Editor for Production Auth
-- This fixes authentication and profile access issues
-- RUN EACH SECTION SEPARATELY (copy and paste one section at a time)

-- ========================================
-- SECTION 1: Check current auth settings
-- ========================================
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'blood_drives', 'blood_requests');

-- ========================================
-- SECTION 2: Enable RLS on profiles table
-- ========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ========================================
-- SECTION 3: Create policies for profiles table (RUN ONE AT A TIME)
-- ========================================

-- Drop existing policies first (if they exist)
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
-- Create SELECT policy
CREATE POLICY "Users can read their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

-- Create UPDATE policy
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Create INSERT policy
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- ========================================
-- SECTION 4: Blood drives policies (RUN ONE AT A TIME)
-- ========================================

-- Drop existing blood drives policies first
DROP POLICY IF EXISTS "Authenticated users can read blood drives" ON public.blood_drives;
DROP POLICY IF EXISTS "Anonymous users can read blood drives" ON public.blood_drives;

-- Create policy for authenticated users
CREATE POLICY "Authenticated users can read blood drives" 
ON public.blood_drives 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy for anonymous users  
CREATE POLICY "Anonymous users can read blood drives" 
ON public.blood_drives 
FOR SELECT 
TO anon 
USING (true);

-- ========================================
-- SECTION 5: Blood requests policies
-- ========================================

-- First, let's check the structure of blood_requests table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'blood_requests';

-- Drop existing blood requests policy first
DROP POLICY IF EXISTS "Users can manage their own blood requests" ON public.blood_requests;

-- Create policy for blood requests (using correct column name)
-- Note: Replace 'requester_id' with the actual user ID column name from the query above
CREATE POLICY "Users can manage their own blood requests" 
ON public.blood_requests 
FOR ALL 
TO authenticated 
USING (auth.uid() = requester_id);

-- ========================================
-- SECTION 6: Grant permissions
-- ========================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.blood_drives TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.blood_requests TO authenticated;

-- Check if auth.users can be accessed (required for profile creation)
GRANT SELECT ON auth.users TO authenticated;

-- ========================================
-- SECTION 7: Create automatic profile creation function
-- ========================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at, updated_at)
  VALUES (new.id, new.email, now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- SECTION 8: Create trigger for automatic profile creation
-- ========================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ========================================
-- SECTION 9: Check auth settings (Dashboard Only)
-- ========================================
-- Note: auth.config table doesn't exist in newer Supabase versions
-- Email confirmation settings are managed in Supabase Dashboard:
-- Go to: Authentication > Settings > Email confirmation

-- Instead, let's check what auth tables are available:
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth';

-- ========================================
-- SECTION 10: Email confirmation is managed in Dashboard
-- ========================================
-- You cannot disable email confirmation via SQL anymore
-- Instead, go to your Supabase Dashboard:
-- 1. Navigate to Authentication > Settings
-- 2. Find "Enable email confirmations" toggle
-- 3. Turn it OFF for testing (turn back ON for production)
-- 4. Click Save

-- ========================================
-- SECTION 11: Final verification
-- ========================================
-- Check that all policies are created
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename IN ('profiles', 'blood_drives', 'blood_requests');

-- Check RLS status

