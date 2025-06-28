/*
  # Fix user signup trigger function

  1. Updates
    - Fix the `handle_new_user` trigger function to properly create user profiles
    - Ensure all required fields are populated when a new user signs up
    - Handle the email field correctly from auth.users

  2. Security
    - Maintains existing RLS policies
    - Ensures proper user isolation
*/

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the updated trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    currency,
    language
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'RON',
    'ro'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure the create_default_categories function works properly
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default categories for the new user
  INSERT INTO public.categories (user_id, name, icon, color, is_default) VALUES
    (NEW.id, 'Food & Dining', '🍽️', '#EF4444', true),
    (NEW.id, 'Transportation', '🚗', '#3B82F6', true),
    (NEW.id, 'Shopping', '🛍️', '#8B5CF6', true),
    (NEW.id, 'Entertainment', '🎬', '#F59E0B', true),
    (NEW.id, 'Bills & Utilities', '💡', '#10B981', true),
    (NEW.id, 'Healthcare', '🏥', '#EF4444', true),
    (NEW.id, 'Education', '📚', '#6366F1', true),
    (NEW.id, 'Travel', '✈️', '#06B6D4', true),
    (NEW.id, 'Income', '💰', '#22C55E', true),
    (NEW.id, 'Other', '📦', '#6B7280', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;