/*
  # JEEVA Initial Schema Setup

  1. New Tables
    - `hospitals` - Hospital information and details
      - `id` (uuid, primary key)
      - `name` (text, hospital name)
      - `location` (text, city/area)
      - `address` (text, full address)
      - `latitude` (numeric, for map)
      - `longitude` (numeric, for map)
      - `phone` (text, contact number)
      - `rating` (numeric, 1-5 star rating)
      - `total_beds` (integer, total capacity)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `bed_availability` - Real-time bed status
      - `id` (uuid, primary key)
      - `hospital_id` (uuid, foreign key)
      - `available_beds` (integer, currently available)
      - `last_updated` (timestamp)
      - `updated_at` (timestamp)

    - `contact_submissions` - Contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for public read access and authenticated writes
    - Hospitals and availability are publicly readable (emergency access)
    - Contact submissions can be created by anyone (public form)

  3. Indexes
    - Index on hospital location for search
    - Index on hospital_id for bed availability lookups
*/

CREATE TABLE IF NOT EXISTS hospitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  phone text NOT NULL,
  rating numeric DEFAULT 4.5,
  total_beds integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bed_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id uuid NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  available_beds integer NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hospitals are publicly readable"
  ON hospitals FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Bed availability is publicly readable"
  ON bed_availability FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals(location);
CREATE INDEX IF NOT EXISTS idx_bed_availability_hospital ON bed_availability(hospital_id);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);

INSERT INTO hospitals (name, location, address, latitude, longitude, phone, rating, total_beds)
VALUES
  ('CWS Hospital', 'Rourkela', 'Chhend, Rourkela, Odisha 769005', 22.2035, 84.8447, '+91-661-2500000', 4.8, 200),
  ('RGH Government Hospital', 'Rourkela', 'Rourkela, Odisha 769001', 22.2258, 84.8436, '+91-661-2433333', 4.5, 500),
  ('Hi-Tech Medical College', 'Rourkela', 'Near Vedavyas, Rourkela, Odisha 769004', 22.2150, 84.8300, '+91-661-2444444', 4.7, 300);

INSERT INTO bed_availability (hospital_id, available_beds)
VALUES
  ((SELECT id FROM hospitals WHERE name = 'CWS Hospital'), 50),
  ((SELECT id FROM hospitals WHERE name = 'RGH Government Hospital'), 5),
  ((SELECT id FROM hospitals WHERE name = 'Hi-Tech Medical College'), 0);