/*
  # Recurring Payments Management

  1. New Tables
    - `recurring_payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `category_id` (uuid, references categories)
      - `account_id` (uuid, references accounts, optional)
      - `name` (text)
      - `amount` (decimal)
      - `frequency` (text: daily, weekly, monthly, yearly)
      - `next_payment_date` (date)
      - `last_payment_date` (date, optional)
      - `is_active` (boolean, default true)
      - `icon` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `recurring_payments` table
    - Add policies for users to manage their own recurring payments
*/

-- Create frequency types enum
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly', 'yearly');

-- Create recurring_payments table
CREATE TABLE IF NOT EXISTS recurring_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE RESTRICT NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  name text NOT NULL,
  amount decimal(12,2) NOT NULL,
  frequency frequency_type NOT NULL DEFAULT 'monthly',
  next_payment_date date NOT NULL,
  last_payment_date date,
  is_active boolean DEFAULT true,
  icon text DEFAULT '💳',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recurring_payments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own recurring payments"
  ON recurring_payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recurring payments"
  ON recurring_payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recurring payments"
  ON recurring_payments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recurring payments"
  ON recurring_payments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER update_recurring_payments_updated_at
  BEFORE UPDATE ON recurring_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_recurring_payments_user_id ON recurring_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_next_date ON recurring_payments(next_payment_date);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_active ON recurring_payments(is_active);