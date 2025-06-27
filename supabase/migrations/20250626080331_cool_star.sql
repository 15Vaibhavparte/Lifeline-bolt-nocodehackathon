/*
  # Add Mock Data for Lifeline Blood Donation Platform

  1. New Data
    - Sample donor profiles from different regions
    - Blood drive events in various locations
    - Blood requests with different urgency levels
    - Sample donations with history

  2. Features
    - Diverse blood types distribution
    - Geographic diversity for location-based matching
    - Various donation histories and frequencies
    - Realistic blood drive events with registration data
*/

-- Insert sample profiles
INSERT INTO profiles (id, email, first_name, last_name, phone, date_of_birth, gender, role, address, city, state, pincode, location, is_verified, created_at)
VALUES
  -- Donors from Mumbai
  ('d0a7f1e2-3b4c-5d6e-7f8a-9b0c1d2e3f4a', 'rahul.sharma@example.com', 'Rahul', 'Sharma', '+91 9876543210', '1990-05-15', 'male', 'donor', '123 Bandra West', 'Mumbai', 'Maharashtra', '400050', point(19.0596, 72.8295), true, now()),
  ('e1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'priya.patel@example.com', 'Priya', 'Patel', '+91 9876543211', '1992-08-23', 'female', 'donor', '456 Andheri East', 'Mumbai', 'Maharashtra', '400069', point(19.1136, 72.8697), true, now()),
  ('f2e3d4c5-6b7a-8c9d-0e1f-2a3b4c5d6e7f', 'amit.desai@example.com', 'Amit', 'Desai', '+91 9876543212', '1985-11-30', 'male', 'donor', '789 Juhu Beach', 'Mumbai', 'Maharashtra', '400049', point(19.0883, 72.8264), true, now()),
  
  -- Donors from Delhi
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'vikram.singh@example.com', 'Vikram', 'Singh', '+91 9876543213', '1988-04-12', 'male', 'donor', '101 Connaught Place', 'Delhi', 'Delhi', '110001', point(28.6329, 77.2195), true, now()),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'neha.gupta@example.com', 'Neha', 'Gupta', '+91 9876543214', '1993-07-19', 'female', 'donor', '202 Hauz Khas', 'Delhi', 'Delhi', '110016', point(28.5494, 77.2001), true, now()),
  
  -- Donors from Bangalore
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'karthik.rajan@example.com', 'Karthik', 'Rajan', '+91 9876543215', '1991-02-28', 'male', 'donor', '303 Indiranagar', 'Bangalore', 'Karnataka', '560038', point(12.9784, 77.6408), true, now()),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'divya.krishnan@example.com', 'Divya', 'Krishnan', '+91 9876543216', '1994-09-05', 'female', 'donor', '404 Koramangala', 'Bangalore', 'Karnataka', '560034', point(12.9279, 77.6271), true, now()),
  
  -- Donors from Chennai
  ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'surya.venkat@example.com', 'Surya', 'Venkat', '+91 9876543217', '1987-12-10', 'male', 'donor', '505 T Nagar', 'Chennai', 'Tamil Nadu', '600017', point(13.0418, 80.2341), true, now()),
  ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'lakshmi.subramaniam@example.com', 'Lakshmi', 'Subramaniam', '+91 9876543218', '1990-03-25', 'female', 'donor', '606 Adyar', 'Chennai', 'Tamil Nadu', '600020', point(13.0012, 80.2565), true, now()),
  
  -- Donors from Hyderabad
  ('a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'arjun.reddy@example.com', 'Arjun', 'Reddy', '+91 9876543219', '1989-06-17', 'male', 'donor', '707 Banjara Hills', 'Hyderabad', 'Telangana', '500034', point(17.4156, 78.4347), true, now()),
  ('b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'sneha.rao@example.com', 'Sneha', 'Rao', '+91 9876543220', '1995-01-08', 'female', 'donor', '808 Jubilee Hills', 'Hyderabad', 'Telangana', '500033', point(17.4275, 78.4074), true, now()),
  
  -- Donors from Kolkata
  ('c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'debashish.das@example.com', 'Debashish', 'Das', '+91 9876543221', '1986-10-22', 'male', 'donor', '909 Park Street', 'Kolkata', 'West Bengal', '700016', point(22.5551, 88.3518), true, now()),
  ('d0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'mitali.sen@example.com', 'Mitali', 'Sen', '+91 9876543222', '1992-05-14', 'female', 'donor', '1010 Salt Lake', 'Kolkata', 'West Bengal', '700091', point(22.5697, 88.4251), true, now()),
  
  -- Recipients
  ('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'ananya.roy@example.com', 'Ananya', 'Roy', '+91 9876543223', '1993-08-11', 'female', 'recipient', '111 Powai', 'Mumbai', 'Maharashtra', '400076', point(19.1176, 72.9060), true, now()),
  ('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'rajesh.kumar@example.com', 'Rajesh', 'Kumar', '+91 9876543224', '1984-03-19', 'male', 'recipient', '212 Rohini', 'Delhi', 'Delhi', '110085', point(28.7410, 77.1180), true, now()),
  
  -- Hospitals
  ('a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'apollo.hospital@example.com', 'Apollo', 'Hospital', '+91 9876543225', '1980-01-01', 'other', 'hospital', '313 Health Avenue', 'Mumbai', 'Maharashtra', '400050', point(19.0821, 72.8416), true, now()),
  ('b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'aiims.hospital@example.com', 'AIIMS', 'Hospital', '+91 9876543226', '1980-01-01', 'other', 'hospital', '414 Medical Lane', 'Delhi', 'Delhi', '110029', point(28.5672, 77.2100), true, now()),
  
  -- Organizers
  ('c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'redcross.india@example.com', 'Red Cross', 'India', '+91 9876543227', '1980-01-01', 'other', 'organizer', '515 Charity Road', 'Mumbai', 'Maharashtra', '400001', point(19.0760, 72.8777), true, now()),
  ('d6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'bloodalliance@example.com', 'Blood', 'Alliance', '+91 9876543228', '1980-01-01', 'other', 'organizer', '616 Donation Street', 'Bangalore', 'Karnataka', '560001', point(12.9716, 77.5946), true, now());

-- Insert donor profiles with different blood types
INSERT INTO donors (id, user_id, blood_type, weight, last_donation_date, availability_status, total_donations, donation_points, is_eligible, next_eligible_date)
VALUES
  -- A+ donors
  (gen_random_uuid(), 'd0a7f1e2-3b4c-5d6e-7f8a-9b0c1d2e3f4a', 'A+', 75.5, '2023-12-15', 'available', 8, 1600, true, '2024-03-15'),
  (gen_random_uuid(), 'e1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', 'A+', 62.0, '2024-01-20', 'available', 5, 1000, true, '2024-04-20'),
  
  -- A- donors
  (gen_random_uuid(), 'f2e3d4c5-6b7a-8c9d-0e1f-2a3b4c5d6e7f', 'A-', 80.2, '2023-11-10', 'available', 12, 2400, true, '2024-02-10'),
  
  -- B+ donors
  (gen_random_uuid(), 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'B+', 70.8, '2024-02-05', 'available', 3, 600, true, '2024-05-05'),
  
  -- B- donors
  (gen_random_uuid(), 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'B-', 65.3, '2023-10-18', 'available', 7, 1400, true, '2024-01-18'),
  
  -- AB+ donors
  (gen_random_uuid(), 'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'AB+', 78.1, '2023-09-25', 'available', 4, 800, true, '2023-12-25'),
  
  -- AB- donors
  (gen_random_uuid(), 'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'AB-', 58.7, '2024-01-30', 'available', 2, 400, true, '2024-04-30'),
  
  -- O+ donors
  (gen_random_uuid(), 'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'O+', 82.4, '2023-12-05', 'available', 15, 3000, true, '2024-03-05'),
  
  -- O- donors
  (gen_random_uuid(), 'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'O-', 68.9, '2023-11-22', 'available', 10, 2000, true, '2024-02-22'),
  
  -- More donors with different blood types
  (gen_random_uuid(), 'a7b8c9d0-e1f2-3a4b-5c6d-7e8f9a0b1c2d', 'A+', 72.5, '2023-10-12', 'available', 6, 1200, true, '2024-01-12'),
  (gen_random_uuid(), 'b8c9d0e1-f2a3-4b5c-6d7e-8f9a0b1c2d3e', 'B+', 67.0, '2024-02-18', 'available', 4, 800, true, '2024-05-18'),
  (gen_random_uuid(), 'c9d0e1f2-a3b4-5c6d-7e8f-9a0b1c2d3e4f', 'O+', 85.3, '2023-09-30', 'available', 20, 4000, true, '2023-12-30'),
  (gen_random_uuid(), 'd0e1f2a3-b4c5-6d7e-8f9a-0b1c2d3e4f5a', 'AB+', 63.8, '2024-01-15', 'available', 3, 600, true, '2024-04-15');

-- Insert blood drives
INSERT INTO blood_drives (id, organizer_id, title, description, event_date, start_time, end_time, location, address, location_point, expected_donors, registered_donors, contact_phone, contact_email, image_url, is_active)
VALUES
  -- Mumbai blood drives
  (gen_random_uuid(), 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Mumbai Community Blood Drive', 'Join us for a community blood donation event to help save lives in Mumbai.', '2025-07-15', '09:00:00', '17:00:00', 'Bandra Community Center', 'Plot 123, Linking Road, Bandra West, Mumbai', point(19.0596, 72.8295), 100, 65, '+91 9876543227', 'events@redcrossindia.example.com', 'https://images.pexels.com/photos/6823568/pexels-photo-6823568.jpeg', true),
  
  (gen_random_uuid(), 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Corporate Blood Donation Camp', 'Special blood donation drive for corporate employees in Mumbai.', '2025-07-25', '10:00:00', '16:00:00', 'Tech Park Convention Hall', 'BKC Complex, Bandra East, Mumbai', point(19.0662, 72.8693), 150, 98, '+91 9876543227', 'events@redcrossindia.example.com', 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', true),
  
  -- Delhi blood drives
  (gen_random_uuid(), 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Delhi Mega Blood Donation Drive', 'A large-scale blood donation event to address critical shortages in Delhi hospitals.', '2025-08-05', '08:00:00', '18:00:00', 'Pragati Maidan', 'Mathura Road, New Delhi', point(28.6181, 77.2410), 200, 120, '+91 9876543227', 'events@redcrossindia.example.com', 'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg', true),
  
  -- Bangalore blood drives
  (gen_random_uuid(), 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Bangalore Tech Community Drive', 'Blood donation event organized by the tech community in Bangalore.', '2025-07-18', '09:30:00', '16:30:00', 'Electronic City Convention Center', 'Phase 1, Electronic City, Bangalore', point(12.8399, 77.6770), 120, 85, '+91 9876543228', 'events@bloodalliance.example.com', 'https://images.pexels.com/photos/7088476/pexels-photo-7088476.jpeg', true),
  
  (gen_random_uuid(), 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'College Campus Blood Drive', 'Blood donation drive targeting college students in Bangalore.', '2025-08-12', '10:00:00', '15:00:00', 'University Campus', 'Jayanagar, Bangalore', point(12.9250, 77.5938), 80, 45, '+91 9876543228', 'events@bloodalliance.example.com', 'https://images.pexels.com/photos/7088497/pexels-photo-7088497.jpeg', true),
  
  -- Chennai blood drives
  (gen_random_uuid(), 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Chennai Medical College Drive', 'Blood donation event at Chennai Medical College.', '2025-07-30', '09:00:00', '17:00:00', 'Chennai Medical College', 'Anna Nagar, Chennai', point(13.0827, 80.2707), 100, 72, '+91 9876543227', 'events@redcrossindia.example.com', 'https://images.pexels.com/photos/7088524/pexels-photo-7088524.jpeg', true),
  
  -- Hyderabad blood drives
  (gen_random_uuid(), 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Hyderabad Community Health Fair', 'Blood donation as part of a larger community health fair in Hyderabad.', '2025-08-20', '10:00:00', '18:00:00', 'Hitex Exhibition Center', 'Madhapur, Hyderabad', point(17.4725, 78.3765), 150, 95, '+91 9876543228', 'events@bloodalliance.example.com', 'https://images.pexels.com/photos/7088520/pexels-photo-7088520.jpeg', true),
  
  -- Past blood drives
  (gen_random_uuid(), 'c5d6e7f8-a9b0-1c2d-3e4f-5a6b7c8d9e0f', 'Mumbai Winter Drive', 'Winter blood donation drive in Mumbai.', '2024-01-15', '09:00:00', '17:00:00', 'Dadar Community Hall', 'Dadar West, Mumbai', point(19.0178, 72.8478), 80, 75, '+91 9876543227', 'events@redcrossindia.example.com', 'https://images.pexels.com/photos/7088530/pexels-photo-7088530.jpeg', true),
  
  (gen_random_uuid(), 'd6e7f8a9-b0c1-2d3e-4f5a-6b7c8d9e0f1a', 'Bangalore Spring Drive', 'Spring blood donation event in Bangalore.', '2024-03-20', '10:00:00', '16:00:00', 'Koramangala Indoor Stadium', 'Koramangala, Bangalore', point(12.9279, 77.6271), 100, 92, '+91 9876543228', 'events@bloodalliance.example.com', 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg', true);

-- Insert blood requests
INSERT INTO blood_requests (id, requester_id, patient_name, blood_type, units_needed, urgency_level, hospital_name, hospital_address, hospital_location, contact_number, additional_info, status, expires_at)
VALUES
  -- Active requests
  (gen_random_uuid(), 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Aditya Mehta', 'O+', 2, 'high', 'Apollo Hospital', 'Bandra West, Mumbai', point(19.0821, 72.8416), '+91 9876543223', 'Surgery scheduled for tomorrow morning', 'active', now() + interval '2 days'),
  
  (gen_random_uuid(), 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'Meera Kapoor', 'AB-', 3, 'critical', 'AIIMS Hospital', 'Ansari Nagar, Delhi', point(28.5672, 77.2100), '+91 9876543224', 'Emergency transfusion needed for accident victim', 'active', now() + interval '1 day'),
  
  (gen_random_uuid(), 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Rohan Joshi', 'A+', 1, 'normal', 'Lilavati Hospital', 'Bandra West, Mumbai', point(19.0509, 72.8294), '+91 9876543223', 'Scheduled procedure next week', 'active', now() + interval '7 days'),
  
  -- Fulfilled requests
  (gen_random_uuid(), 'f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'Sanjay Verma', 'B+', 2, 'high', 'Max Hospital', 'Saket, Delhi', point(28.5274, 77.2159), '+91 9876543224', 'Needed for surgery', 'fulfilled', now() - interval '2 days'),
  
  -- Expired requests
  (gen_random_uuid(), 'e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Kavita Nair', 'O-', 1, 'normal', 'Hinduja Hospital', 'Mahim, Mumbai', point(19.0367, 72.8397), '+91 9876543223', 'Regular transfusion', 'expired', now() - interval '10 days');

-- Insert sample donations
INSERT INTO donations (id, donor_id, blood_type, donation_date, location, units_donated, status, verified_by, blockchain_hash)
VALUES
  -- Get donor IDs from the donors table
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 0), 'A+', '2023-12-15', 'Apollo Hospital, Mumbai', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'ALGO_TX_ABC123DEF456'),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 1), 'A+', '2024-01-20', 'Red Cross Blood Bank, Mumbai', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', NULL),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 2), 'A-', '2023-11-10', 'AIIMS Hospital, Delhi', 1, 'completed', 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'ALGO_TX_GHI789JKL012'),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 3), 'B+', '2024-02-05', 'Max Hospital, Delhi', 1, 'completed', 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', NULL),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 4), 'B-', '2023-10-18', 'Manipal Hospital, Bangalore', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'ALGO_TX_MNO345PQR678'),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 5), 'AB+', '2023-09-25', 'Apollo Hospital, Bangalore', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', NULL),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 6), 'AB-', '2024-01-30', 'Apollo Hospital, Chennai', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', 'ALGO_TX_STU901VWX234'),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 7), 'O+', '2023-12-05', 'KIMS Hospital, Hyderabad', 1, 'completed', 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d', NULL),
  (gen_random_uuid(), (SELECT id FROM donors LIMIT 1 OFFSET 8), 'O-', '2023-11-22', 'AIIMS Hospital, Delhi', 1, 'completed', 'b4c5d6e7-f8a9-0b1c-2d3e-4f5a6b7c8d9e', 'ALGO_TX_YZA567BCD890');

-- Insert blood drive registrations
INSERT INTO blood_drive_registrations (drive_id, donor_id, registered_at, attended)
VALUES
  -- Get drive IDs and donor IDs from respective tables
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 0), (SELECT id FROM donors LIMIT 1 OFFSET 0), now() - interval '10 days', true),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 0), (SELECT id FROM donors LIMIT 1 OFFSET 1), now() - interval '9 days', true),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 0), (SELECT id FROM donors LIMIT 1 OFFSET 2), now() - interval '8 days', false),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 1), (SELECT id FROM donors LIMIT 1 OFFSET 3), now() - interval '7 days', true),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 1), (SELECT id FROM donors LIMIT 1 OFFSET 4), now() - interval '6 days', true),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 2), (SELECT id FROM donors LIMIT 1 OFFSET 5), now() - interval '5 days', false),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 3), (SELECT id FROM donors LIMIT 1 OFFSET 6), now() - interval '4 days', true),
  ((SELECT id FROM blood_drives LIMIT 1 OFFSET 4), (SELECT id FROM donors LIMIT 1 OFFSET 7), now() - interval '3 days', true);

-- Insert matches between donors and requests
INSERT INTO matches (request_id, donor_id, distance_km, compatibility_score, donor_response, responded_at)
VALUES
  -- Get request IDs and donor IDs from respective tables
  ((SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 0), (SELECT id FROM donors LIMIT 1 OFFSET 7), 3.2, 95, 'accepted', now() - interval '1 day'),
  ((SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 0), (SELECT id FROM donors LIMIT 1 OFFSET 8), 5.7, 88, 'pending', NULL),
  ((SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 1), (SELECT id FROM donors LIMIT 1 OFFSET 6), 2.8, 92, 'accepted', now() - interval '12 hours'),
  ((SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 1), (SELECT id FROM donors LIMIT 1 OFFSET 2), 4.5, 85, 'declined', now() - interval '18 hours'),
  ((SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 2), (SELECT id FROM donors LIMIT 1 OFFSET 0), 1.9, 97, 'pending', NULL);

-- Insert notifications
INSERT INTO notifications (user_id, title, message, type, data, is_read, created_at)
VALUES
  -- Notifications for donors
  ('d0a7f1e2-3b4c-5d6e-7f8a-9b0c1d2e3f4a', 'Blood Request Match Found', 'A A+ blood request matches your profile. Distance: 1.9km', 'blood_request', '{"requestId": "' || (SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 2) || '"}', false, now() - interval '2 hours'),
  ('f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c', 'Blood Request Match Found', 'A O- blood request matches your profile. Distance: 5.7km', 'blood_request', '{"requestId": "' || (SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 0) || '"}', true, now() - interval '1 day'),
  ('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Thank You for Donating!', 'Your recent donation has helped save lives. You earned 200 points!', 'donation_complete', '{"donationId": "' || (SELECT id FROM donations LIMIT 1 OFFSET 7) || '"}', false, now() - interval '5 days'),
  
  -- Notifications for recipients
  ('e1f2a3b4-c5d6-7e8f-9a0b-1c2d3e4f5a6b', 'Donor Found!', 'A donor has accepted your blood request for Aditya Mehta', 'donor_accepted', '{"matchId": "' || (SELECT id FROM matches LIMIT 1 OFFSET 0) || '", "requestId": "' || (SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 0) || '"}', false, now() - interval '23 hours'),
  ('f2a3b4c5-d6e7-8f9a-0b1c-2d3e4f5a6b7c', 'Donor Found!', 'A donor has accepted your blood request for Meera Kapoor', 'donor_accepted', '{"matchId": "' || (SELECT id FROM matches LIMIT 1 OFFSET 2) || '", "requestId": "' || (SELECT id FROM blood_requests WHERE status = 'active' LIMIT 1 OFFSET 1) || '"}', true, now() - interval '11 hours'),
  
  -- Blood drive notifications
  ('d0a7f1e2-3b4c-5d6e-7f8a-9b0c1d2e3f4a', 'Upcoming Blood Drive', 'Mumbai Community Blood Drive is happening on July 15, 2025', 'blood_drive', '{"driveId": "' || (SELECT id FROM blood_drives LIMIT 1 OFFSET 0) || '"}', false, now() - interval '2 days'),
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Upcoming Blood Drive', 'Delhi Mega Blood Donation Drive is happening on August 5, 2025', 'blood_drive', '{"driveId": "' || (SELECT id FROM blood_drives LIMIT 1 OFFSET 2) || '"}', false, now() - interval '3 days');