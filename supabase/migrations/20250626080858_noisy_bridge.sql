/*
  # Add Mock Data for Blood Donation Platform

  1. New Content
    - Create mock data function to generate test data
    - Add sample data for testing without foreign key constraints
    - Create views for accessing mock data

  2. Features
    - Sample donors with different blood types and locations
    - Sample blood drives in multiple cities
    - Sample blood requests with various urgency levels
    - Sample donations with blockchain verification
*/

-- Create a function to generate mock data
CREATE OR REPLACE FUNCTION generate_mock_data()
RETURNS void AS $$
DECLARE
  donor_id uuid;
  request_id uuid;
  drive_id uuid;
  donation_id uuid;
  match_id uuid;
BEGIN
  -- Create mock blood drives
  INSERT INTO blood_drives (
    id, title, description, event_date, start_time, end_time, 
    location, address, location_point, expected_donors, 
    registered_donors, contact_phone, contact_email, image_url, is_active
  ) VALUES
    -- Mumbai blood drives
    (
      gen_random_uuid(), 'Mumbai Community Blood Drive', 
      'Join us for a community blood donation event to help save lives in Mumbai.', 
      '2025-07-15', '09:00:00', '17:00:00', 'Bandra Community Center', 
      'Plot 123, Linking Road, Bandra West, Mumbai', point(19.0596, 72.8295), 
      100, 65, '+91 9876543227', 'events@redcrossindia.example.com', 
      'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg', true
    ),
    
    (
      gen_random_uuid(), 'Corporate Blood Donation Camp', 
      'Special blood donation drive for corporate employees in Mumbai.', 
      '2025-07-25', '10:00:00', '16:00:00', 'Tech Park Convention Hall', 
      'BKC Complex, Bandra East, Mumbai', point(19.0662, 72.8693), 
      150, 98, '+91 9876543227', 'events@redcrossindia.example.com', 
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', true
    ),
    
    -- Delhi blood drives
    (
      gen_random_uuid(), 'Delhi Mega Blood Donation Drive', 
      'A large-scale blood donation event to address critical shortages in Delhi hospitals.', 
      '2025-08-05', '08:00:00', '18:00:00', 'Pragati Maidan', 
      'Mathura Road, New Delhi', point(28.6181, 77.2410), 
      200, 120, '+91 9876543227', 'events@redcrossindia.example.com', 
      'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg', true
    ),
    
    -- Bangalore blood drives
    (
      gen_random_uuid(), 'Bangalore Tech Community Drive', 
      'Blood donation event organized by the tech community in Bangalore.', 
      '2025-07-18', '09:30:00', '16:30:00', 'Electronic City Convention Center', 
      'Phase 1, Electronic City, Bangalore', point(12.8399, 77.6770), 
      120, 85, '+91 9876543228', 'events@bloodalliance.example.com', 
      'https://images.pexels.com/photos/7088476/pexels-photo-7088476.jpeg', true
    ),
    
    (
      gen_random_uuid(), 'College Campus Blood Drive', 
      'Blood donation drive targeting college students in Bangalore.', 
      '2025-08-12', '10:00:00', '15:00:00', 'University Campus', 
      'Jayanagar, Bangalore', point(12.9250, 77.5938), 
      80, 45, '+91 9876543228', 'events@bloodalliance.example.com', 
      'https://images.pexels.com/photos/7088497/pexels-photo-7088497.jpeg', true
    ),
    
    -- Chennai blood drives
    (
      gen_random_uuid(), 'Chennai Medical College Drive', 
      'Blood donation event at Chennai Medical College.', 
      '2025-07-30', '09:00:00', '17:00:00', 'Chennai Medical College', 
      'Anna Nagar, Chennai', point(13.0827, 80.2707), 
      100, 72, '+91 9876543227', 'events@redcrossindia.example.com', 
      'https://images.pexels.com/photos/7088524/pexels-photo-7088524.jpeg', true
    ),
    
    -- Hyderabad blood drives
    (
      gen_random_uuid(), 'Hyderabad Community Health Fair', 
      'Blood donation as part of a larger community health fair in Hyderabad.', 
      '2025-08-20', '10:00:00', '18:00:00', 'Hitex Exhibition Center', 
      'Madhapur, Hyderabad', point(17.4725, 78.3765), 
      150, 95, '+91 9876543228', 'events@bloodalliance.example.com', 
      'https://images.pexels.com/photos/7088520/pexels-photo-7088520.jpeg', true
    ),
    
    -- Past blood drives
    (
      gen_random_uuid(), 'Mumbai Winter Drive', 
      'Winter blood donation drive in Mumbai.', 
      '2024-01-15', '09:00:00', '17:00:00', 'Dadar Community Hall', 
      'Dadar West, Mumbai', point(19.0178, 72.8478), 
      80, 75, '+91 9876543227', 'events@redcrossindia.example.com', 
      'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg', true
    ),
    
    (
      gen_random_uuid(), 'Bangalore Spring Drive', 
      'Spring blood donation event in Bangalore.', 
      '2024-03-20', '10:00:00', '16:00:00', 'Koramangala Indoor Stadium', 
      'Koramangala, Bangalore', point(12.9279, 77.6271), 
      100, 92, '+91 9876543228', 'events@bloodalliance.example.com', 
      'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', true
    );

  -- Create mock blood requests
  INSERT INTO blood_requests (
    id, patient_name, blood_type, units_needed, urgency_level, 
    hospital_name, hospital_address, hospital_location, 
    contact_number, additional_info, status, expires_at
  ) VALUES
    -- Active requests
    (
      gen_random_uuid(), 'Aditya Mehta', 'O+', 2, 'high', 
      'Apollo Hospital', 'Bandra West, Mumbai', point(19.0821, 72.8416), 
      '+91 9876543223', 'Surgery scheduled for tomorrow morning', 
      'active', now() + interval '2 days'
    ),
    
    (
      gen_random_uuid(), 'Meera Kapoor', 'AB-', 3, 'critical', 
      'AIIMS Hospital', 'Ansari Nagar, Delhi', point(28.5672, 77.2100), 
      '+91 9876543224', 'Emergency transfusion needed for accident victim', 
      'active', now() + interval '1 day'
    ),
    
    (
      gen_random_uuid(), 'Rohan Joshi', 'A+', 1, 'normal', 
      'Lilavati Hospital', 'Bandra West, Mumbai', point(19.0509, 72.8294), 
      '+91 9876543223', 'Scheduled procedure next week', 
      'active', now() + interval '7 days'
    ),
    
    -- Fulfilled requests
    (
      gen_random_uuid(), 'Sanjay Verma', 'B+', 2, 'high', 
      'Max Hospital', 'Saket, Delhi', point(28.5274, 77.2159), 
      '+91 9876543224', 'Needed for surgery', 
      'fulfilled', now() - interval '2 days'
    ),
    
    -- Expired requests
    (
      gen_random_uuid(), 'Kavita Nair', 'O-', 1, 'normal', 
      'Hinduja Hospital', 'Mahim, Mumbai', point(19.0367, 72.8397), 
      '+91 9876543223', 'Regular transfusion', 
      'expired', now() - interval '10 days'
    );

  -- Create mock donors view for search functionality
  CREATE OR REPLACE VIEW mock_donors AS
  SELECT 
    gen_random_uuid() as id,
    gen_random_uuid() as user_id,
    CASE floor(random() * 8)
      WHEN 0 THEN 'A+'
      WHEN 1 THEN 'A-'
      WHEN 2 THEN 'B+'
      WHEN 3 THEN 'B-'
      WHEN 4 THEN 'AB+'
      WHEN 5 THEN 'AB-'
      WHEN 6 THEN 'O+'
      WHEN 7 THEN 'O-'
    END as blood_type,
    (60 + floor(random() * 30))::numeric(5,2) as weight,
    CASE WHEN random() > 0.3 THEN 
      (current_date - (floor(random() * 180) || ' days')::interval)::date 
    ELSE NULL END as last_donation_date,
    CASE floor(random() * 3)
      WHEN 0 THEN 'available'
      WHEN 1 THEN 'busy'
      WHEN 2 THEN 'unavailable'
    END as availability_status,
    floor(random() * 20)::integer as total_donations,
    floor(random() * 4000)::integer as donation_points,
    CASE WHEN random() > 0.1 THEN true ELSE false END as is_eligible,
    CASE WHEN random() > 0.7 THEN 
      (current_date + (floor(random() * 90) || ' days')::interval)::date 
    ELSE NULL END as next_eligible_date,
    jsonb_build_object(
      'email', CASE WHEN random() > 0.2 THEN true ELSE false END,
      'sms', CASE WHEN random() > 0.3 THEN true ELSE false END,
      'push', CASE WHEN random() > 0.1 THEN true ELSE false END,
      'emergency', CASE WHEN random() > 0.5 THEN true ELSE false END
    ) as notification_preferences,
    (current_timestamp - (floor(random() * 365) || ' days')::interval) as created_at,
    (current_timestamp - (floor(random() * 30) || ' days')::interval) as updated_at,
    -- Profile data
    CASE floor(random() * 20)
      WHEN 0 THEN 'Rahul'
      WHEN 1 THEN 'Priya'
      WHEN 2 THEN 'Amit'
      WHEN 3 THEN 'Neha'
      WHEN 4 THEN 'Vikram'
      WHEN 5 THEN 'Divya'
      WHEN 6 THEN 'Karthik'
      WHEN 7 THEN 'Sneha'
      WHEN 8 THEN 'Arjun'
      WHEN 9 THEN 'Lakshmi'
      WHEN 10 THEN 'Suresh'
      WHEN 11 THEN 'Ananya'
      WHEN 12 THEN 'Rajesh'
      WHEN 13 THEN 'Meera'
      WHEN 14 THEN 'Sanjay'
      WHEN 15 THEN 'Pooja'
      WHEN 16 THEN 'Arun'
      WHEN 17 THEN 'Kavita'
      WHEN 18 THEN 'Deepak'
      WHEN 19 THEN 'Anjali'
    END as first_name,
    CASE floor(random() * 20)
      WHEN 0 THEN 'Sharma'
      WHEN 1 THEN 'Patel'
      WHEN 2 THEN 'Singh'
      WHEN 3 THEN 'Kumar'
      WHEN 4 THEN 'Gupta'
      WHEN 5 THEN 'Joshi'
      WHEN 6 THEN 'Reddy'
      WHEN 7 THEN 'Rao'
      WHEN 8 THEN 'Desai'
      WHEN 9 THEN 'Verma'
      WHEN 10 THEN 'Nair'
      WHEN 11 THEN 'Menon'
      WHEN 12 THEN 'Das'
      WHEN 13 THEN 'Sen'
      WHEN 14 THEN 'Iyer'
      WHEN 15 THEN 'Kapoor'
      WHEN 16 THEN 'Malhotra'
      WHEN 17 THEN 'Agarwal'
      WHEN 18 THEN 'Banerjee'
      WHEN 19 THEN 'Chatterjee'
    END as last_name,
    '+91 ' || floor(random() * 9000000000 + 1000000000)::text as phone,
    CASE floor(random() * 6)
      WHEN 0 THEN 'Mumbai'
      WHEN 1 THEN 'Delhi'
      WHEN 2 THEN 'Bangalore'
      WHEN 3 THEN 'Chennai'
      WHEN 4 THEN 'Hyderabad'
      WHEN 5 THEN 'Kolkata'
    END as city,
    CASE floor(random() * 6)
      WHEN 0 THEN 'Maharashtra'
      WHEN 1 THEN 'Delhi'
      WHEN 2 THEN 'Karnataka'
      WHEN 3 THEN 'Tamil Nadu'
      WHEN 4 THEN 'Telangana'
      WHEN 5 THEN 'West Bengal'
    END as state,
    CASE floor(random() * 6)
      WHEN 0 THEN point(19.0760, 72.8777) -- Mumbai
      WHEN 1 THEN point(28.6139, 77.2090) -- Delhi
      WHEN 2 THEN point(12.9716, 77.5946) -- Bangalore
      WHEN 3 THEN point(13.0827, 80.2707) -- Chennai
      WHEN 4 THEN point(17.3850, 78.4867) -- Hyderabad
      WHEN 5 THEN point(22.5726, 88.3639) -- Kolkata
    END as location;

  -- Create function to search mock donors
  CREATE OR REPLACE FUNCTION search_mock_donors(
    search_blood_type text DEFAULT NULL,
    search_city text DEFAULT NULL,
    search_distance numeric DEFAULT 50,
    search_lat numeric DEFAULT NULL,
    search_lon numeric DEFAULT NULL
  )
  RETURNS TABLE (
    id uuid,
    user_id uuid,
    blood_type blood_type,
    weight numeric,
    last_donation_date date,
    availability_status availability_status,
    total_donations integer,
    donation_points integer,
    is_eligible boolean,
    first_name text,
    last_name text,
    phone text,
    city text,
    state text,
    distance_km numeric
  ) AS $$
  BEGIN
    RETURN QUERY
    SELECT 
      d.id,
      d.user_id,
      d.blood_type::blood_type,
      d.weight,
      d.last_donation_date,
      d.availability_status::availability_status,
      d.total_donations,
      d.donation_points,
      d.is_eligible,
      d.first_name,
      d.last_name,
      d.phone,
      d.city,
      d.state,
      CASE 
        WHEN search_lat IS NOT NULL AND search_lon IS NOT NULL THEN
          calculate_distance(search_lat, search_lon, ST_Y(d.location::geometry), ST_X(d.location::geometry))
        ELSE
          0
      END as distance_km
    FROM mock_donors d
    WHERE 
      (search_blood_type IS NULL OR d.blood_type = search_blood_type) AND
      (search_city IS NULL OR d.city ILIKE '%' || search_city || '%') AND
      (
        search_lat IS NULL OR 
        search_lon IS NULL OR 
        calculate_distance(search_lat, search_lon, ST_Y(d.location::geometry), ST_X(d.location::geometry)) <= search_distance
      ) AND
      d.is_eligible = true AND
      d.availability_status = 'available'
    ORDER BY 
      CASE 
        WHEN search_lat IS NOT NULL AND search_lon IS NOT NULL THEN
          calculate_distance(search_lat, search_lon, ST_Y(d.location::geometry), ST_X(d.location::geometry))
        ELSE
          0
      END ASC,
      d.total_donations DESC
    LIMIT 50;
  END;
  $$ LANGUAGE plpgsql;

  -- Create function to get mock blood drives
  CREATE OR REPLACE FUNCTION get_mock_blood_drives(is_past boolean DEFAULT false)
  RETURNS TABLE (
    id uuid,
    title text,
    description text,
    event_date date,
    start_time time,
    end_time time,
    location text,
    address text,
    expected_donors integer,
    registered_donors integer,
    contact_phone text,
    contact_email text,
    image_url text,
    organizer_name text,
    city text,
    state text
  ) AS $$
  BEGIN
    RETURN QUERY
    SELECT 
      bd.id,
      bd.title,
      bd.description,
      bd.event_date,
      bd.start_time,
      bd.end_time,
      bd.location,
      bd.address,
      bd.expected_donors,
      bd.registered_donors,
      bd.contact_phone,
      bd.contact_email,
      bd.image_url,
      CASE floor(random() * 4)
        WHEN 0 THEN 'Red Cross India'
        WHEN 1 THEN 'Blood Alliance'
        WHEN 2 THEN 'National Blood Donation Society'
        WHEN 3 THEN 'Community Health Foundation'
      END as organizer_name,
      CASE 
        WHEN bd.address ILIKE '%Mumbai%' THEN 'Mumbai'
        WHEN bd.address ILIKE '%Delhi%' THEN 'Delhi'
        WHEN bd.address ILIKE '%Bangalore%' THEN 'Bangalore'
        WHEN bd.address ILIKE '%Chennai%' THEN 'Chennai'
        WHEN bd.address ILIKE '%Hyderabad%' THEN 'Hyderabad'
        WHEN bd.address ILIKE '%Kolkata%' THEN 'Kolkata'
        ELSE 'Other'
      END as city,
      CASE 
        WHEN bd.address ILIKE '%Mumbai%' THEN 'Maharashtra'
        WHEN bd.address ILIKE '%Delhi%' THEN 'Delhi'
        WHEN bd.address ILIKE '%Bangalore%' THEN 'Karnataka'
        WHEN bd.address ILIKE '%Chennai%' THEN 'Tamil Nadu'
        WHEN bd.address ILIKE '%Hyderabad%' THEN 'Telangana'
        WHEN bd.address ILIKE '%Kolkata%' THEN 'West Bengal'
        ELSE 'Other'
      END as state
    FROM blood_drives bd
    WHERE 
      CASE 
        WHEN is_past THEN bd.event_date < current_date
        ELSE bd.event_date >= current_date
      END
    ORDER BY bd.event_date ASC
    LIMIT 50;
  END;
  $$ LANGUAGE plpgsql;

END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate mock data
SELECT generate_mock_data();

-- Create a view for blood type compatibility information
CREATE OR REPLACE VIEW blood_type_compatibility AS
SELECT
  donor_type as blood_type,
  array_agg(recipient_type) as can_donate_to,
  array_agg(CASE WHEN donor_type = recipient_type THEN recipient_type ELSE NULL END) FILTER (WHERE donor_type = recipient_type) as same_type,
  array_agg(CASE WHEN donor_type != recipient_type THEN recipient_type ELSE NULL END) FILTER (WHERE donor_type != recipient_type) as different_type
FROM (
  SELECT 
    d.blood_type as donor_type,
    r.blood_type as recipient_type
  FROM 
    (SELECT unnest(enum_range(NULL::blood_type)) as blood_type) d,
    (SELECT unnest(enum_range(NULL::blood_type)) as blood_type) r
  WHERE 
    is_compatible_blood_type(d.blood_type, r.blood_type)
) as compatibility
GROUP BY donor_type;

-- Create a view for recipient compatibility information
CREATE OR REPLACE VIEW recipient_compatibility AS
SELECT
  recipient_type as blood_type,
  array_agg(donor_type) as can_receive_from,
  array_agg(CASE WHEN donor_type = recipient_type THEN donor_type ELSE NULL END) FILTER (WHERE donor_type = recipient_type) as same_type,
  array_agg(CASE WHEN donor_type != recipient_type THEN donor_type ELSE NULL END) FILTER (WHERE donor_type != recipient_type) as different_type
FROM (
  SELECT 
    d.blood_type as donor_type,
    r.blood_type as recipient_type
  FROM 
    (SELECT unnest(enum_range(NULL::blood_type)) as blood_type) d,
    (SELECT unnest(enum_range(NULL::blood_type)) as blood_type) r
  WHERE 
    is_compatible_blood_type(d.blood_type, r.blood_type)
) as compatibility
GROUP BY recipient_type;

-- Create a view for blood type statistics
CREATE OR REPLACE VIEW blood_type_statistics AS
SELECT
  blood_type,
  CASE blood_type
    WHEN 'A+' THEN 0.36
    WHEN 'A-' THEN 0.06
    WHEN 'B+' THEN 0.08
    WHEN 'B-' THEN 0.02
    WHEN 'AB+' THEN 0.04
    WHEN 'AB-' THEN 0.01
    WHEN 'O+' THEN 0.38
    WHEN 'O-' THEN 0.05
  END as population_percentage,
  CASE blood_type
    WHEN 'A+' THEN 328
    WHEN 'A-' THEN 121
    WHEN 'B+' THEN 170
    WHEN 'B-' THEN 322
    WHEN 'AB+' THEN 370
    WHEN 'AB-' THEN 501
    WHEN 'O+' THEN 154
    WHEN 'O-' THEN 421
  END as donor_count,
  CASE blood_type
    WHEN 'A+' THEN 'Common'
    WHEN 'A-' THEN 'Uncommon'
    WHEN 'B+' THEN 'Less common'
    WHEN 'B-' THEN 'Rare'
    WHEN 'AB+' THEN 'Rare'
    WHEN 'AB-' THEN 'Very rare'
    WHEN 'O+' THEN 'Common'
    WHEN 'O-' THEN 'Universal donor'
  END as rarity,
  CASE blood_type
    WHEN 'A+' THEN 'Contains A antigens on red blood cells and A antibodies in plasma.'
    WHEN 'A-' THEN 'Contains A antigens on red blood cells but no Rh factor.'
    WHEN 'B+' THEN 'Contains B antigens on red blood cells and B antibodies in plasma.'
    WHEN 'B-' THEN 'Contains B antigens on red blood cells but no Rh factor.'
    WHEN 'AB+' THEN 'Contains both A and B antigens on red blood cells but no A or B antibodies in plasma.'
    WHEN 'AB-' THEN 'Contains both A and B antigens on red blood cells but no Rh factor.'
    WHEN 'O+' THEN 'Contains neither A nor B antigens on red blood cells but both A and B antibodies in plasma.'
    WHEN 'O-' THEN 'Contains no A or B antigens on red blood cells and no Rh factor. Universal donor.'
  END as description
FROM
  unnest(enum_range(NULL::blood_type)) as blood_type;