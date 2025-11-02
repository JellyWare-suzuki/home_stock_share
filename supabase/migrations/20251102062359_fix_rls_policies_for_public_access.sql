/*
  # Fix RLS Policies for Public Access

  1. Changes
    - Drop existing policies that don't specify roles
    - Create new policies that explicitly allow access to anon and authenticated users
    - This ensures the app works with the Supabase anon key

  2. Security
    - Allow anon and authenticated users full access to items and logs
    - Suitable for family sharing without individual user authentication
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view items" ON items;
DROP POLICY IF EXISTS "Anyone can insert items" ON items;
DROP POLICY IF EXISTS "Anyone can update items" ON items;
DROP POLICY IF EXISTS "Anyone can delete items" ON items;
DROP POLICY IF EXISTS "Anyone can view logs" ON logs;
DROP POLICY IF EXISTS "Anyone can insert logs" ON logs;

-- Create new policies for items table with explicit roles
CREATE POLICY "Public can view items"
  ON items FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert items"
  ON items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update items"
  ON items FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete items"
  ON items FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create new policies for logs table with explicit roles
CREATE POLICY "Public can view logs"
  ON logs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert logs"
  ON logs FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update logs"
  ON logs FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete logs"
  ON logs FOR DELETE
  TO anon, authenticated
  USING (true);