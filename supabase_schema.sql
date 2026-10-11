-- ============================================================
-- SRM CAMPUS DIRECTIONS — SUPABASE DATABASE SCHEMA & SEED DATA
-- Campus: SRM Institute of Science and Technology (KTR Main Campus)
-- ============================================================

-- 1. Create table for campus destinations
CREATE TABLE IF NOT EXISTS campus_places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('academic', 'canteen', 'hostel', 'gate', 'amenity')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  short_description TEXT NOT NULL,
  floor_or_building TEXT,
  tags TEXT[] DEFAULT '{}',
  popular_items TEXT[] DEFAULT '{}',
  icon_name TEXT DEFAULT 'MapPin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE campus_places ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (students, visitors, public) to read campus places
CREATE POLICY "Public places can be viewed by all"
  ON campus_places
  FOR SELECT
  USING (true);

-- 4. Policy: Allow inserts, updates, and deletes (Anon / Authenticated)
CREATE POLICY "Allow public insert for admin operations"
  ON campus_places
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update for admin operations"
  ON campus_places
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete for admin operations"
  ON campus_places
  FOR DELETE
  USING (true);

-- 5. Seed Official SRM Kattankulathur Landmarks
INSERT INTO campus_places (id, name, category, latitude, longitude, short_description, floor_or_building, tags, popular_items, icon_name)
VALUES
  -- Canteens & Food Courts
  ('canteen-java', 'Java Green Canteen', 'canteen', 12.8238, 80.0440, 'Popular open-air food joint near Tech Park serving fresh juices, sandwiches, shawarma, and meals.', 'Near Tech Park & UB', ARRAY['Food', 'Juice', 'Outdoor', 'Student Hangout'], ARRAY['Fresh Juices', 'Chicken Shawarma', 'Fried Rice', 'Cold Coffee'], 'Utensils'),
  ('canteen-tp', 'Tech Park Canteen', 'canteen', 12.8234, 80.0446, 'Spacious indoor food court located in the Tech Park building serving South & North Indian combos.', 'Tech Park Ground Floor', ARRAY['AC Food Court', 'Meals', 'Quick Bites'], ARRAY['South Indian Thali', 'Biryani', 'Snacks', 'Tea & Coffee'], 'Coffee'),
  ('canteen-ub', 'UB Food Court & Snacky', 'canteen', 12.8230, 80.0459, 'Multi-vendor food pavilion in University Building with wide variety of snacks, shakes, and fast food.', 'UB Ground Floor', ARRAY['Quick Bites', 'Shakes', 'Bakery'], ARRAY['Waffles', 'Burgers', 'Momos', 'Milkshakes'], 'Pizza'),
  ('canteen-srm-hotel', 'SRM Hotel & Royal Restaurant', 'canteen', 12.8215, 80.0480, 'Fine-dining and multi-cuisine restaurant located right within the SRM Hotel premises.', 'SRM Hotel Complex', ARRAY['Multi-Cuisine', 'Buffet', 'AC Dining'], ARRAY['Buffet Lunch', 'North Indian Curry', 'Continental'], 'Utensils'),
  ('canteen-gazebo', 'Gazebo Cafe', 'canteen', 12.8245, 80.0450, 'Cozy hangout spot for evening tea, snacks, maggi, and quick refreshers between classes.', 'Opposite Central Library', ARRAY['Tea & Snacks', 'Budget Friendly', 'Fast Food'], ARRAY['Ginger Chai', 'Peri Peri Maggi', 'Samosa'], 'Coffee'),
  ('canteen-food-street', 'Campus Food Street & Subway', 'canteen', 12.8222, 80.0455, 'Lively student food hub with Subway outlet, chats, and ice cream parlors.', 'Main Campus Boulevard', ARRAY['Franchises', 'Late Night', 'Beverages'], ARRAY['Subway Subs', 'Belgian Waffles', 'Rolled Ice Cream'], 'Sandwich'),

  -- Academic Blocks
  ('acad-tp', 'Tech Park (TP)', 'academic', 12.8236, 80.0444, 'Iconic 15-story high-tech computing and engineering tower housing CSE, IT, AI, and Placement Cell.', 'Tech Park Tower', ARRAY['CSE', 'IT', 'AI & ML', 'Placements', 'Labs'], ARRAY['Dean Office (1st Floor)', 'Auditorium', 'Supercomputer Lab'], 'Laptop'),
  ('acad-ub', 'University Building (UB)', 'academic', 12.8232, 80.0456, 'Central administrative block, Vice Chancellor office, Admissions, Registrar, and ECE/EEE departments.', 'University Building (UB)', ARRAY['Administration', 'ECE', 'EEE', 'Admissions'], ARRAY['VC Secretariat', 'Accounts Section', 'Seminar Halls'], 'Building2'),
  ('acad-biotech', 'Bio-Tech Park & Life Sciences', 'academic', 12.8248, 80.0435, 'State-of-the-art research facility for Biotechnology, Biomedical, Genetics, and Nanotechnology.', 'Life Sciences Complex', ARRAY['Biotech', 'Biomedical', 'Genetics', 'Research Labs'], ARRAY['Cell Culture Lab', 'Nanotech Center'], 'Microscope'),
  ('acad-mech', 'Mechanical Engineering Block', 'academic', 12.8225, 80.0438, 'Core engineering workshops, Robotics labs, Automobile testing bays, and Aerospace facilities.', 'Basic Engineering Wing', ARRAY['Mechanical', 'Automobile', 'Aerospace', 'Workshops'], ARRAY['CAD/CAM Labs', 'SAE Racing Garages'], 'Wrench'),
  ('acad-esb', 'Electrical Sciences Block (ESB)', 'academic', 12.8219, 80.0448, 'Specialized block for Electronics & Communication, IoT labs, and Power Systems research.', 'North Academic Quad', ARRAY['ECE', 'IoT', 'Power Electronics'], ARRAY['VLSI Design Lab', 'Embedded Systems Hub'], 'Cpu'),
  ('acad-arch', 'School of Architecture & Interior Design', 'academic', 12.8252, 80.0425, 'Creative design studios, drafting halls, model making labs, and open exhibition galleries.', 'Design Campus Wing', ARRAY['Architecture', 'Interior Design', 'Design Studios'], ARRAY['Model Making Lab', 'Exhibition Gallery'], 'Palette'),
  ('acad-som', 'School of Management (MBA Block)', 'academic', 12.8239, 80.0465, 'Home to MBA, BBA, Commerce, executive lecture halls, and corporate case-study rooms.', 'Management Complex', ARRAY['MBA', 'BBA', 'Finance', 'Case Study Rooms'], ARRAY['Stock Market Trading Lab', 'Auditorium'], 'GraduationCap'),
  ('acad-medical', 'SRM Medical College Hospital & Research', 'academic', 12.8270, 80.0475, 'Comprehensive medical college campus housing MBBS, Nursing, Physiotherapy, and lecture theatres.', 'Medical Campus', ARRAY['MBBS', 'Medical Labs', 'Clinical Research'], ARRAY['Anatomy Museum', 'Central Clinical Labs'], 'Stethoscope'),

  -- Hostels
  ('hostel-oori', 'Oori Hostel (Boys)', 'hostel', 12.8210, 80.0415, 'Large residential hostel block for undergraduate boys featuring sports facilities and mess.', 'Boys Hostel Zone', ARRAY['Boys Hostel', 'Mess', 'Gym', 'Wi-Fi'], ARRAY['Dining Hall', 'Badminton Court'], 'Bed'),
  ('hostel-kaari-paari', 'Kaari & Paari Hostels (Boys)', 'hostel', 12.8215, 80.0422, 'Senior undergraduate and international students hostel with attached washrooms and dining.', 'Boys Hostel Zone', ARRAY['AC & Non-AC', 'Mess', 'Study Room'], ARRAY['Recreation Room', 'Reading Hall'], 'BedDouble'),
  ('hostel-adhiyaman', 'Adhiyaman Hostel (Boys)', 'hostel', 12.8202, 80.0418, 'Popular boys hostel wing with solar water heating, high-speed Wi-Fi, and indoor games.', 'Boys Hostel Zone', ARRAY['Boys Hostel', 'Canteen', 'Indoor Games'], ARRAY['Table Tennis Room', 'Common Room'], 'Bed'),
  ('hostel-nelson', 'Nelson Mandela Hostel (International)', 'hostel', 12.8228, 80.0410, 'Premium residential facility for international students and research scholars with customized cuisines.', 'International Hostel Wing', ARRAY['International', 'AC Suites', 'Continental Mess'], ARRAY['Gymnasium', 'Kitchenettes'], 'Globe'),
  ('hostel-senbagam', 'Senbagam Hostel (Girls)', 'hostel', 12.8242, 80.0405, 'Modern multi-story girls residence with 24/7 biometric security, attached mess, and salon.', 'Girls Hostel Campus', ARRAY['Girls Hostel', '24/7 Security', 'Mess', 'Salon'], ARRAY['Dining Hall', 'Indoor Gym'], 'ShieldCheck'),
  ('hostel-meenakshi', 'Meenakshi & Kalpana Chawla Hostels (Girls)', 'hostel', 12.8248, 80.0398, 'Spacious residences for female students with lush green courtyards, laundry, and reading halls.', 'Girls Hostel Campus', ARRAY['Girls Hostel', 'Laundry', 'Reading Rooms'], ARRAY['Counseling Cell', 'Courtyard Garden'], 'Bed'),
  ('hostel-m-block', 'M-Block PG Hostel', 'hostel', 12.8198, 80.0428, 'Postgraduate and PhD scholars residence with quiet research environment and attached dining.', 'PG Residential Quad', ARRAY['PG & PhD', 'Quiet Study', 'High-Speed LAN'], ARRAY['Research Reading Lounge'], 'Home'),

  -- Gates & Transit
  ('gate-main-1', 'Main Gate 1 (GST Road)', 'gate', 12.8208, 80.0495, 'Primary campus entrance facing Grand Southern Trunk (GST) Road, Foot Overbridge, and bus bay.', 'GST Highway Frontage', ARRAY['Main Entrance', 'Bus Stops', 'Security Desk', 'Taxi Bay'], ARRAY['Security Checkpost', 'Auto Stand'], 'DoorOpen'),
  ('gate-potheri', 'Potheri Railway Station Gate', 'gate', 12.8218, 80.0505, 'Pedestrian gate providing direct walking access to Potheri Suburban Railway Station.', 'Opposite Potheri Railway Station', ARRAY['Suburban Train', 'Pedestrian Walkway', 'Quick Transit'], ARRAY['Ticket Counter Link', 'Rickshaw Stand'], 'Train'),
  ('gate-arch', 'SRM Arch Gate', 'gate', 12.8255, 80.0460, 'Grand ceremonial campus arch connecting the university main road to academic quads.', 'Main Campus Spine Road', ARRAY['Ceremonial Gate', 'Visitor Drop-off'], ARRAY['Campus Map Kiosk'], 'Landmark'),
  ('gate-medical', 'SRM Hospital & Medical Gate', 'gate', 12.8265, 80.0478, 'Dedicated 24/7 entry for SRM Hospital, Emergency Ambulance bay, and Medical College.', 'Hospital Access Road', ARRAY['Hospital Entry', 'Ambulance Bay', '24/7 Access'], ARRAY['Emergency Triage Desk'], 'Cross'),

  -- Amenities & Healthcare
  ('amenity-hospital', 'SRM General Hospital & Emergency (24x7)', 'amenity', 12.8272, 80.0482, 'Multi-speciality 1200+ bed hospital with 24/7 Emergency casualty, pharmacy, and diagnostic services.', 'SRM Medical Complex', ARRAY['24/7 Emergency', 'Pharmacy', 'Casualty', 'Diagnostics'], ARRAY['Emergency Ward', '24/7 Medical Store', 'Blood Bank'], 'HeartPulse'),
  ('amenity-library', 'Central Library (Dr. T.P. Ganesan Auditorium)', 'amenity', 12.8235, 80.0452, 'Magnificent multi-floor library with digital resource centers, book loans, and 3000-seat auditorium.', 'Central Library Building', ARRAY['Quiet Study', 'Digital Library', 'Research Journals', 'Auditorium'], ARRAY['Air Conditioned Reading Halls', 'E-Library Lounge'], 'BookOpen'),
  ('amenity-stadium', 'SRM Indoor Stadium & Sports Complex', 'amenity', 12.8220, 80.0400, 'State-of-the-art sports arena with wooden badminton courts, basketball arena, gym, and table tennis.', 'Sports Complex Grounds', ARRAY['Badminton', 'Basketball', 'Gym', 'Fitness'], ARRAY['Olympic Standard Courts', 'Weight Training Gym'], 'Trophy'),
  ('amenity-atm', 'SBI Bank & 24/7 ATM Center', 'amenity', 12.8228, 80.0468, 'Full-service State Bank of India campus branch with multiple 24-hour cash withdrawal ATMs.', 'Adjacent to UB Post Office', ARRAY['Banking', 'ATM', 'Cash Deposit', 'Student Services'], ARRAY['SBI Branch Office', '3x 24hr ATMs'], 'CreditCard'),
  ('amenity-post', 'SRM Campus Post Office & Courier', 'amenity', 12.8226, 80.0470, 'Indian Post office offering speed post, registered mail, parcel delivery, and courier pick-up.', 'Student Services Center', ARRAY['Speed Post', 'Parcels', 'Postal Services'], ARRAY['Parcel Delivery Counter'], 'Mail'),
  ('amenity-clock-tower', 'SRM Clock Tower & Fountain Quad', 'amenity', 12.8237, 80.0450, 'Central campus landmark, photography hub, and meeting point between Tech Park and University Building.', 'Central Campus Plaza', ARRAY['Landmark', 'Meeting Point', 'Gardens'], ARRAY['Fountain Plaza', 'Seating Benches'], 'Clock')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  short_description = EXCLUDED.short_description,
  floor_or_building = EXCLUDED.floor_or_building,
  tags = EXCLUDED.tags,
  popular_items = EXCLUDED.popular_items,
  icon_name = EXCLUDED.icon_name,
  updated_at = NOW();

-- ============================================================
-- 6. Dedicated Admin Users Table (Option 2: Username & Password)
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow reading admin_users table for credential verification
CREATE POLICY "Allow public read for admin verification"
  ON admin_users
  FOR SELECT
  USING (true);

-- Allow admins to update or insert accounts
CREATE POLICY "Allow admin updates on admin_users"
  ON admin_users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Seed default administrator account
INSERT INTO admin_users (username, password, role)
VALUES ('admin', 'srm123', 'admin')
ON CONFLICT (username) DO UPDATE SET
  password = EXCLUDED.password,
  updated_at = NOW();

-- 7. Grant PostgreSQL permissions to Supabase API roles (anon and authenticated)
GRANT ALL ON TABLE admin_users TO anon, authenticated, service_role;
GRANT ALL ON TABLE campus_places TO anon, authenticated, service_role;


