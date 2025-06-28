/*
  # Fix user signup database error

  1. New Functions
    - `handle_new_user()` - Creates a profile record when a new user signs up
  
  2. New Triggers
    - Trigger on `auth.users` table to automatically create profile
  
  3. Security
    - Ensures profile creation happens automatically for new users
    - Maintains data consistency between auth and profiles tables

  This migration fixes the "Database error saving new user" issue by ensuring
  that when a user signs up through Supabase Auth, a corresponding profile
  record is automatically created in the profiles table.
*/

-- Create the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger to automatically create a profile for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();