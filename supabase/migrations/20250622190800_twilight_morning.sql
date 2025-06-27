/*
  # Lifeline Blood Donation Platform Database Schema

  1. New Tables
    - `profiles` - User profiles with role-based information
    - `donors` - Donor-specific information and availability
    - `blood_requests` - Blood donation requests
    - `donations` - Completed donation records
    - `blood_drives` - Community blood drive events
    - `notifications` - User notifications
    - `matches` - Donor-recipient matches

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access based on user roles

  3. Features
    - Blood type compatibility checking
    - Location-based matching
    - Real-time notifications
    - Donation history tracking
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('donor', 'recipient', 'hospital', 'organizer');
CREATE TYPE blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE urgency_level AS ENUM ('normal', 'high', 'critical');
CREATE TYPE request_status AS ENUM ('active', 'fulfilled', 'cancelled', 'expired');
CREATE TYPE donation_status AS ENUM ('scheduled', 'completed', 'cancelled');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  date_of_birth date,
  gender gender_type,
  role user_role NOT NULL DEFAULT 'donor',
  address text,
  city text,
  state text,
  pincode text,
  location point, -- PostGIS point for lat/lng
  profile_picture_url text,
  is_verified boolean DEFAULT false,
  emergency_contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donors table
CREATE TABLE IF NOT EXISTS donors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  blood_type blood_type NOT NULL,
  weight numeric(5,2),
  last_donation_date date,
  medical_conditions text,
  availability_status availability_status DEFAULT 'available',
  total_donations integer DEFAULT 0,
  donation_points integer DEFAULT 0,
  is_eligible boolean DEFAULT true,
  next_eligible_date date,
  notification_preferences jsonb DEFAULT '{"email": true, "sms": true, "push": true, "emergency": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  patient_name text NOT NULL,
  blood_type blood_type NOT NULL,
  units_needed integer NOT NULL CHECK (units_needed > 0),
  urgency_level urgency_level DEFAULT 'normal',
  hospital_name text NOT NULL,
  hospital_address text NOT NULL,
  hospital_location point,
  contact_number text NOT NULL,
  additional_info text,
  status request_status DEFAULT 'active',
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  matched_donors_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
  request_id uuid REFERENCES blood_requests(id) ON DELETE SET NULL,
  blood_type blood_type NOT NULL,
  donation_date date NOT NULL,
  location text NOT NULL,
  units_donated integer DEFAULT 1,
  status donation_status DEFAULT 'completed',
  notes text,
  verified_by uuid REFERENCES profiles(id),
  blockchain_hash text, -- For blockchain verification
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blood drives table
CREATE TABLE IF NOT EXISTS blood_drives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  location_point point,
  expected_donors integer DEFAULT 0,
  registered_donors integer DEFAULT 0,
  contact_phone text,
  contact_email text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Blood drive registrations
CREATE TABLE IF NOT EXISTS blood_drive_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id uuid REFERENCES blood_drives(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
  registered_at timestamptz DEFAULT now(),
  attended boolean DEFAULT false,
  UNIQUE(drive_id, donor_id)
);

-- Matches table (donor-recipient matching)
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES blood_requests(id) ON DELETE CASCADE,
  donor_id uuid REFERENCES donors(id) ON DELETE CASCADE,
  distance_km numeric(8,2),
  compatibility_score integer CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  donor_response text CHECK (donor_response IN ('pending', 'accepted', 'declined')),
  responded_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(request_id, donor_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL, -- 'blood_request', 'match_found', 'donation_reminder', etc.
  data jsonb, -- Additional data for the notification
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_drive_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for donors
CREATE POLICY "Donors can view own data"
  ON donors
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Donors can update own data"
  ON donors
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Donors can insert own data"
  ON donors
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Recipients can view available donors"
  ON donors
  FOR SELECT
  TO authenticated
  USING (availability_status = 'available' AND is_eligible = true);

-- RLS Policies for blood requests
CREATE POLICY "Users can view own requests"
  ON blood_requests
  FOR SELECT
  TO authenticated
  USING (requester_id = auth.uid());

CREATE POLICY "Users can create requests"
  ON blood_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update own requests"
  ON blood_requests
  FOR UPDATE
  TO authenticated
  USING (requester_id = auth.uid());

CREATE POLICY "Donors can view active requests"
  ON blood_requests
  FOR SELECT
  TO authenticated
  USING (status = 'active' AND expires_at > now());

-- RLS Policies for donations
CREATE POLICY "Donors can view own donations"
  ON donations
  FOR SELECT
  TO authenticated
  USING (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

CREATE POLICY "Donors can insert own donations"
  ON donations
  FOR INSERT
  TO authenticated
  WITH CHECK (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

-- RLS Policies for blood drives
CREATE POLICY "Anyone can view active blood drives"
  ON blood_drives
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Organizers can manage own drives"
  ON blood_drives
  FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid());

-- RLS Policies for blood drive registrations
CREATE POLICY "Users can view own registrations"
  ON blood_drive_registrations
  FOR SELECT
  TO authenticated
  USING (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

CREATE POLICY "Donors can register for drives"
  ON blood_drive_registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

-- RLS Policies for matches
CREATE POLICY "Users can view own matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    request_id IN (SELECT id FROM blood_requests WHERE requester_id = auth.uid()) OR
    donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid())
  );

CREATE POLICY "System can create matches"
  ON matches
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Donors can update match responses"
  ON matches
  FOR UPDATE
  TO authenticated
  USING (donor_id IN (SELECT id FROM donors WHERE user_id = auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_donors_availability ON donors(availability_status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_blood_requests_blood_type ON blood_requests(blood_type);
CREATE INDEX IF NOT EXISTS idx_blood_requests_urgency ON blood_requests(urgency_level);
CREATE INDEX IF NOT EXISTS idx_blood_requests_location ON blood_requests USING GIST(hospital_location);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_blood_drives_date ON blood_drives(event_date);
CREATE INDEX IF NOT EXISTS idx_blood_drives_location ON blood_drives USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_matches_request_id ON matches(request_id);
CREATE INDEX IF NOT EXISTS idx_matches_donor_id ON matches(donor_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Create functions for blood type compatibility
CREATE OR REPLACE FUNCTION is_compatible_blood_type(donor_type blood_type, recipient_type blood_type)
RETURNS boolean AS $$
BEGIN
  -- Universal donor O- can donate to anyone
  IF donor_type = 'O-' THEN
    RETURN true;
  END IF;
  
  -- Universal recipient AB+ can receive from anyone
  IF recipient_type = 'AB+' THEN
    RETURN true;
  END IF;
  
  -- Same blood type is always compatible
  IF donor_type = recipient_type THEN
    RETURN true;
  END IF;
  
  -- Specific compatibility rules
  CASE recipient_type
    WHEN 'A+' THEN
      RETURN donor_type IN ('A+', 'A-', 'O+', 'O-');
    WHEN 'A-' THEN
      RETURN donor_type IN ('A-', 'O-');
    WHEN 'B+' THEN
      RETURN donor_type IN ('B+', 'B-', 'O+', 'O-');
    WHEN 'B-' THEN
      RETURN donor_type IN ('B-', 'O-');
    WHEN 'AB-' THEN
      RETURN donor_type IN ('AB-', 'A-', 'B-', 'O-');
    WHEN 'O+' THEN
      RETURN donor_type IN ('O+', 'O-');
    WHEN 'O-' THEN
      RETURN donor_type = 'O-';
    ELSE
      RETURN false;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 float, lon1 float, lat2 float, lon2 float)
RETURNS float AS $$
BEGIN
  -- Haversine formula for calculating distance in kilometers
  RETURN (
    6371 * acos(
      cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lon2) - radians(lon1)) +
      sin(radians(lat1)) * sin(radians(lat2))
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to find compatible donors for a blood request
CREATE OR REPLACE FUNCTION find_compatible_donors(
  request_blood_type blood_type,
  hospital_lat float,
  hospital_lon float,
  max_distance_km float DEFAULT 50
)
RETURNS TABLE (
  donor_id uuid,
  user_id uuid,
  donor_name text,
  blood_type blood_type,
  distance_km float,
  total_donations integer,
  last_donation_date date
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.user_id,
    (p.first_name || ' ' || p.last_name) as donor_name,
    d.blood_type,
    calculate_distance(
      hospital_lat, 
      hospital_lon, 
      ST_Y(p.location::geometry), 
      ST_X(p.location::geometry)
    ) as distance_km,
    d.total_donations,
    d.last_donation_date
  FROM donors d
  JOIN profiles p ON d.user_id = p.id
  WHERE 
    d.availability_status = 'available'
    AND d.is_eligible = true
    AND is_compatible_blood_type(d.blood_type, request_blood_type)
    AND p.location IS NOT NULL
    AND calculate_distance(
      hospital_lat, 
      hospital_lon, 
      ST_Y(p.location::geometry), 
      ST_X(p.location::geometry)
    ) <= max_distance_km
  ORDER BY distance_km ASC, d.total_donations DESC;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_drives_updated_at BEFORE UPDATE ON blood_drives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();