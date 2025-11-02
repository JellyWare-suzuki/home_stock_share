/*
  # Shopping List Table

  1. New Table
    - `shopping_list`
      - `id` (uuid, primary key) - Unique identifier
      - `item_name` (text) - Name of item to buy
      - `quantity` (integer) - Quantity to purchase
      - `is_completed` (boolean) - Whether item has been purchased
      - `memo` (text) - Additional notes
      - `created_at` (timestamptz) - When added to list
      - `completed_at` (timestamptz, nullable) - When marked as completed

  2. Security
    - Enable RLS
    - Allow public access for anon and authenticated users
    - Suitable for family sharing

  3. Indexes
    - Add index on is_completed for filtering
    - Add index on created_at for sorting
*/

-- Create shopping_list table
CREATE TABLE IF NOT EXISTS shopping_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  is_completed boolean DEFAULT false,
  memo text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_shopping_list_is_completed ON shopping_list(is_completed);
CREATE INDEX IF NOT EXISTS idx_shopping_list_created_at ON shopping_list(created_at DESC);

-- Enable Row Level Security
ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view shopping list"
  ON shopping_list FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert shopping list"
  ON shopping_list FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can update shopping list"
  ON shopping_list FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete shopping list"
  ON shopping_list FOR DELETE
  TO anon, authenticated
  USING (true);