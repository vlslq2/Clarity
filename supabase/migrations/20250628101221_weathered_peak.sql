/*
  # Update existing categories to Romanian

  1. Changes
    - Updates all existing English categories to Romanian equivalents
    - Preserves user customizations for non-default categories
    - Only updates categories that match common English names

  2. Security
    - Updates are scoped to specific category names to avoid overwriting custom categories
*/

-- Update existing English categories to Romanian equivalents
UPDATE categories SET 
  name = 'Mâncare și băuturi',
  icon = '🍽️'
WHERE name IN ('Food & Dining', 'Food', 'Dining', 'Groceries', 'Restaurants');

UPDATE categories SET 
  name = 'Transport',
  icon = '🚗'
WHERE name IN ('Transportation', 'Transport', 'Car', 'Gas', 'Public Transport');

UPDATE categories SET 
  name = 'Cumpărături',
  icon = '🛍️'
WHERE name IN ('Shopping', 'Retail', 'Purchases', 'General');

UPDATE categories SET 
  name = 'Divertisment',
  icon = '🎬'
WHERE name IN ('Entertainment', 'Movies', 'Games', 'Fun');

UPDATE categories SET 
  name = 'Utilități',
  icon = '💡'
WHERE name IN ('Bills & Utilities', 'Utilities', 'Bills', 'Electric', 'Gas', 'Water', 'Internet');

UPDATE categories SET 
  name = 'Sănătate',
  icon = '🏥'
WHERE name IN ('Healthcare', 'Health', 'Medical', 'Doctor', 'Pharmacy');

UPDATE categories SET 
  name = 'Educație',
  icon = '📚'
WHERE name IN ('Education', 'School', 'Books', 'Learning');

UPDATE categories SET 
  name = 'Casa și grădina',
  icon = '🏠'
WHERE name IN ('Home & Garden', 'Home', 'Garden', 'House', 'Maintenance');

UPDATE categories SET 
  name = 'Îmbrăcăminte',
  icon = '👕'
WHERE name IN ('Clothing', 'Clothes', 'Fashion', 'Apparel');

UPDATE categories SET 
  name = 'Tehnologie',
  icon = '📱'
WHERE name IN ('Technology', 'Tech', 'Electronics', 'Software', 'Hardware');

UPDATE categories SET 
  name = 'Venituri',
  icon = '💰'
WHERE name IN ('Income', 'Salary', 'Revenue', 'Earnings');

UPDATE categories SET 
  name = 'Altele',
  icon = '📦'
WHERE name IN ('Other', 'Miscellaneous', 'General', 'Uncategorized');

-- Update any remaining common English categories
UPDATE categories SET 
  name = 'Călătorii',
  icon = '✈️'
WHERE name IN ('Travel', 'Vacation', 'Trip');

UPDATE categories SET 
  name = 'Sport și fitness',
  icon = '⚽'
WHERE name IN ('Sports', 'Fitness', 'Gym', 'Exercise');

UPDATE categories SET 
  name = 'Cadouri',
  icon = '🎁'
WHERE name IN ('Gifts', 'Presents');

UPDATE categories SET 
  name = 'Animale de companie',
  icon = '🐕'
WHERE name IN ('Pets', 'Pet Care', 'Animals');