/*
  # Categories Management

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `icon` (text)
      - `color` (text)
      - `budget_limit` (decimal, optional)
      - `is_default` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `categories` table
    - Add policies for users to manage their own categories
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  icon text DEFAULT '📦',
  color text DEFAULT '#6B7280',
  budget_limit decimal(10,2),
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON categories
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS trigger AS $$
BEGIN
  INSERT INTO categories (user_id, name, icon, color, budget_limit, is_default) VALUES
    (NEW.id, 'Mâncare', '🍽️', '#EF4444', 1200.00, true),
    (NEW.id, 'Transport', '🚗', '#3B82F6', 600.00, true),
    (NEW.id, 'Divertisment', '🎮', '#8B5CF6', 300.00, true),
    (NEW.id, 'Cumpărături', '🛍️', '#F59E0B', 800.00, true),
    (NEW.id, 'Utilități', '⚡', '#10B981', 400.00, true),
    (NEW.id, 'Sănătate', '❤️', '#EC4899', 200.00, true),
    (NEW.id, 'Educație', '📚', '#6366F1', 300.00, true),
    (NEW.id, 'Altele', '📦', '#6B7280', 200.00, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default categories for new users
CREATE TRIGGER on_profile_created_categories
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_default_categories();