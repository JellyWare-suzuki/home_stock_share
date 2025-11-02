/*
  # Home Stock Share - Initial Database Setup

  1. New Tables
    - `items`
      - `id` (uuid, primary key) - Unique identifier for each item
      - `name` (text) - Name of the household item
      - `quantity` (integer) - Current stock quantity
      - `category` (text) - Category of the item (optional)
      - `created_at` (timestamptz) - When the item was first added
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `logs`
      - `id` (uuid, primary key) - Unique identifier for each log entry
      - `item_id` (uuid, foreign key) - References the item
      - `item_name` (text) - Snapshot of item name at time of action
      - `action` (text) - Type of action: 'add', 'remove', 'update', 'delete'
      - `quantity_change` (integer) - Amount changed (+/-)
      - `comment` (text) - User comment or reason for action
      - `created_at` (timestamptz) - When the action occurred

  2. Security
    - Enable RLS on both tables
    - Allow all authenticated users to read and write (family sharing scenario)
    - For MVP, simplified security model - can be enhanced with user tracking later

  3. Indexes
    - Add index on logs.item_id for faster log retrieval
    - Add index on logs.created_at for chronological sorting
*/

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  quantity integer NOT NULL DEFAULT 0,
  category text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES items(id) ON DELETE CASCADE,
  item_name text NOT NULL,
  action text NOT NULL,
  quantity_change integer DEFAULT 0,
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_logs_item_id ON logs(item_id);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policies for items table
CREATE POLICY "Anyone can view items"
  ON items FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert items"
  ON items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update items"
  ON items FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete items"
  ON items FOR DELETE
  USING (true);

-- Create policies for logs table
CREATE POLICY "Anyone can view logs"
  ON logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert logs"
  ON logs FOR INSERT
  WITH CHECK (true);