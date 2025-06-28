/*
  # Update default categories function with Romanian categories

  1. Function Updates
    - Updates the create_default_categories function to use Romanian category names
    - Ensures proper error handling and conflict resolution
    
  2. Trigger Management
    - Safely recreates the trigger with proper dependency handling
    
  3. Categories Created
    - Mâncare și băuturi (Food & Drinks)
    - Transport (Transportation)
    - Cumpărături (Shopping)
    - Divertisment (Entertainment)
    - Utilități (Utilities)
    - Sănătate (Health)
    - Educație (Education)
    - Casa și grădina (Home & Garden)
    - Îmbrăcăminte (Clothing)
    - Tehnologie (Technology)
*/

-- First, drop the trigger to remove dependency
DROP TRIGGER IF EXISTS on_profile_created_categories ON profiles;

-- Now we can safely drop the function
DROP FUNCTION IF EXISTS create_default_categories();

-- Create the updated function with Romanian categories
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default Romanian categories for the new user
  -- Using INSERT with ON CONFLICT to handle any potential duplicates
  INSERT INTO categories (user_id, name, icon, color, is_default) VALUES
    (NEW.id, 'Mâncare și băuturi', '🍽️', '#EF4444', true),
    (NEW.id, 'Transport', '🚗', '#3B82F6', true),
    (NEW.id, 'Cumpărături', '🛍️', '#F59E0B', true),
    (NEW.id, 'Divertisment', '🎬', '#8B5CF6', true),
    (NEW.id, 'Utilități', '💡', '#10B981', true),
    (NEW.id, 'Sănătate', '🏥', '#EC4899', true),
    (NEW.id, 'Educație', '📚', '#6366F1', true),
    (NEW.id, 'Casa și grădina', '🏠', '#059669', true),
    (NEW.id, 'Îmbrăcăminte', '👕', '#DC2626', true),
    (NEW.id, 'Tehnologie', '📱', '#7C3AED', true)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create default categories for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger on the profiles table
CREATE TRIGGER on_profile_created_categories
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();