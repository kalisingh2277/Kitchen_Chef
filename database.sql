-- Create ingredients table
CREATE TABLE ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create recipes table
CREATE TABLE recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  cooking_time INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  cuisine TEXT NOT NULL,
  instructions TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  calories INTEGER DEFAULT 0,
  prep_time INTEGER DEFAULT 0,
  cooking_time INTEGER DEFAULT 0
);

-- Create recipe_ingredients junction table
CREATE TABLE recipe_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(recipe_id, ingredient_id)
);

-- Create indexes for better performance
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine);

-- Add some sample data
INSERT INTO ingredients (name) VALUES
  ('Chicken'),
  ('Rice'),
  ('Tomatoes'),
  ('Onions'),
  ('Garlic'),
  ('Olive Oil'),
  ('Salt'),
  ('Pepper'),
  ('Pasta'),
  ('Ground Beef');

INSERT INTO recipes (title, description, image_url, cooking_time, servings, cuisine, instructions) VALUES
  (
    'Classic Spaghetti Bolognese',
    'A rich and hearty Italian pasta dish with a meaty tomato sauce.',
    'https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=2008&auto=format&fit=crop',
    45,
    4,
    'Italian',
    ARRAY[
      'Heat olive oil in a large pot over medium heat.',
      'Add onions and garlic, sauté until softened.',
      'Add ground beef and cook until browned.',
      'Add tomatoes and seasonings, simmer for 30 minutes.',
      'Cook pasta according to package instructions.',
      'Serve sauce over pasta with grated cheese.'
    ]
  );

INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT 
  r.id,
  i.id,
  CASE i.name
    WHEN 'Pasta' THEN '400g'
    WHEN 'Ground Beef' THEN '500g'
    WHEN 'Tomatoes' THEN '400g'
    WHEN 'Onions' THEN '1 large'
    WHEN 'Garlic' THEN '3 cloves'
    WHEN 'Olive Oil' THEN '2 tbsp'
    WHEN 'Salt' THEN 'to taste'
    WHEN 'Pepper' THEN 'to taste'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Classic Spaghetti Bolognese'
AND i.name IN ('Pasta', 'Ground Beef', 'Tomatoes', 'Onions', 'Garlic', 'Olive Oil', 'Salt', 'Pepper');

-- Add Indian-specific ingredients
INSERT INTO ingredients (name) VALUES
  ('Basmati Rice'),
  ('Ginger'),
  ('Turmeric'),
  ('Cumin Seeds'),
  ('Coriander Powder'),
  ('Garam Masala'),
  ('Green Chilies'),
  ('Cilantro'),
  ('Yogurt'),
  ('Ghee'),
  ('Cardamom'),
  ('Cinnamon'),
  ('Cloves'),
  ('Bay Leaves'),
  ('Red Chili Powder'),
  ('Chickpeas'),
  ('Paneer'),
  ('Coconut Milk'),
  ('Mustard Seeds'),
  ('Curry Leaves');

-- Add Indian Recipes
INSERT INTO recipes (title, description, image_url, cooking_time, servings, cuisine, instructions) VALUES
  (
    'Butter Chicken',
    'Tender chicken pieces in a rich, creamy tomato-based curry. A classic Indian dish loved worldwide.',
    'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=2070&auto=format&fit=crop',
    60,
    4,
    'Indian',
    ARRAY[
      'Marinate chicken with yogurt, ginger-garlic paste, and spices for 2 hours.',
      'In a large pot, heat butter and cook onions until golden.',
      'Add tomato puree and spices, cook until oil separates.',
      'Add marinated chicken and cook until tender.',
      'Add cream and kasuri methi, simmer for 5 minutes.',
      'Garnish with cream and serve hot with naan.'
    ]
  ),
  (
    'Biryani',
    'Fragrant basmati rice layered with spiced meat or vegetables, a royal Indian delicacy.',
    'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=2070&auto=format&fit=crop',
    90,
    6,
    'Indian',
    ARRAY[
      'Soak basmati rice for 30 minutes, then cook with whole spices.',
      'In a separate pot, cook meat with yogurt and spices until tender.',
      'Layer rice and meat mixture, top with fried onions and saffron milk.',
      'Cover tightly and cook on low heat for 20 minutes.',
      'Let rest for 10 minutes before serving.',
      'Serve hot with raita.'
    ]
  ),
  (
    'Palak Paneer',
    'Cottage cheese cubes in a creamy spinach gravy, a vegetarian favorite.',
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=2070&auto=format&fit=crop',
    45,
    4,
    'Indian',
    ARRAY[
      'Blanch spinach and puree until smooth.',
      'Fry paneer cubes until golden brown.',
      'Sauté onions, ginger, and garlic with spices.',
      'Add spinach puree and simmer for 10 minutes.',
      'Add paneer and cream, cook for 5 more minutes.',
      'Serve hot with roti or naan.'
    ]
  ),
  (
    'Chana Masala',
    'Spiced chickpeas curry, a popular vegetarian dish packed with protein.',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=2070&auto=format&fit=crop',
    40,
    4,
    'Indian',
    ARRAY[
      'Soak chickpeas overnight and pressure cook until tender.',
      'Sauté onions, ginger, and garlic until golden.',
      'Add tomatoes and spices, cook until oil separates.',
      'Add cooked chickpeas and simmer for 15 minutes.',
      'Garnish with cilantro and ginger juliennes.',
      'Serve hot with bhatura or rice.'
    ]
  ),
  (
    'Dal Makhani',
    'Creamy black lentils simmered overnight, a rich and indulgent dish.',
    'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=2070&auto=format&fit=crop',
    180,
    6,
    'Indian',
    ARRAY[
      'Soak black lentils and kidney beans overnight.',
      'Pressure cook with spices until soft.',
      'In a pot, sauté onions, ginger, and garlic.',
      'Add tomato puree and spices, cook until oil separates.',
      'Add cooked lentils and simmer on low heat for 2-3 hours.',
      'Finish with cream and butter, serve hot.'
    ]
  );

-- Add recipe ingredients for Butter Chicken
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT r.id, i.id, 
  CASE i.name
    WHEN 'Chicken' THEN '1 kg'
    WHEN 'Tomatoes' THEN '6 medium'
    WHEN 'Onions' THEN '2 large'
    WHEN 'Garlic' THEN '8 cloves'
    WHEN 'Ginger' THEN '2-inch piece'
    WHEN 'Yogurt' THEN '1 cup'
    WHEN 'Garam Masala' THEN '2 tsp'
    WHEN 'Turmeric' THEN '1 tsp'
    WHEN 'Red Chili Powder' THEN '1 tsp'
    WHEN 'Ghee' THEN '4 tbsp'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Butter Chicken'
AND i.name IN ('Chicken', 'Tomatoes', 'Onions', 'Garlic', 'Ginger', 'Yogurt', 'Garam Masala', 'Turmeric', 'Red Chili Powder', 'Ghee');

-- Add recipe ingredients for Biryani
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT r.id, i.id,
  CASE i.name
    WHEN 'Basmati Rice' THEN '500g'
    WHEN 'Chicken' THEN '750g'
    WHEN 'Onions' THEN '3 large'
    WHEN 'Yogurt' THEN '1 cup'
    WHEN 'Ginger' THEN '2-inch piece'
    WHEN 'Garlic' THEN '8 cloves'
    WHEN 'Garam Masala' THEN '2 tsp'
    WHEN 'Green Chilies' THEN '4-5'
    WHEN 'Cilantro' THEN '1 cup'
    WHEN 'Ghee' THEN '4 tbsp'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Biryani'
AND i.name IN ('Basmati Rice', 'Chicken', 'Onions', 'Yogurt', 'Ginger', 'Garlic', 'Garam Masala', 'Green Chilies', 'Cilantro', 'Ghee');

-- Add recipe ingredients for Palak Paneer
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT r.id, i.id,
  CASE i.name
    WHEN 'Paneer' THEN '250g'
    WHEN 'Spinach' THEN '500g'
    WHEN 'Onions' THEN '1 large'
    WHEN 'Garlic' THEN '6 cloves'
    WHEN 'Ginger' THEN '1-inch piece'
    WHEN 'Garam Masala' THEN '1 tsp'
    WHEN 'Turmeric' THEN '1/2 tsp'
    WHEN 'Green Chilies' THEN '2-3'
    WHEN 'Ghee' THEN '2 tbsp'
    WHEN 'Cream' THEN '1/4 cup'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Palak Paneer'
AND i.name IN ('Paneer', 'Spinach', 'Onions', 'Garlic', 'Ginger', 'Garam Masala', 'Turmeric', 'Green Chilies', 'Ghee', 'Cream');

-- Add recipe ingredients for Chana Masala
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT r.id, i.id,
  CASE i.name
    WHEN 'Chickpeas' THEN '2 cups'
    WHEN 'Onions' THEN '2 medium'
    WHEN 'Tomatoes' THEN '3 medium'
    WHEN 'Ginger' THEN '1-inch piece'
    WHEN 'Garlic' THEN '6 cloves'
    WHEN 'Garam Masala' THEN '1 tsp'
    WHEN 'Cumin Seeds' THEN '1 tsp'
    WHEN 'Coriander Powder' THEN '2 tsp'
    WHEN 'Green Chilies' THEN '2-3'
    WHEN 'Cilantro' THEN '1/2 cup'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Chana Masala'
AND i.name IN ('Chickpeas', 'Onions', 'Tomatoes', 'Ginger', 'Garlic', 'Garam Masala', 'Cumin Seeds', 'Coriander Powder', 'Green Chilies', 'Cilantro');

-- Add recipe ingredients for Dal Makhani
INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
SELECT r.id, i.id,
  CASE i.name
    WHEN 'Black Lentils' THEN '2 cups'
    WHEN 'Kidney Beans' THEN '1/2 cup'
    WHEN 'Onions' THEN '2 large'
    WHEN 'Tomatoes' THEN '4 medium'
    WHEN 'Ginger' THEN '2-inch piece'
    WHEN 'Garlic' THEN '8 cloves'
    WHEN 'Garam Masala' THEN '2 tsp'
    WHEN 'Cream' THEN '1/2 cup'
    WHEN 'Ghee' THEN '4 tbsp'
    WHEN 'Cilantro' THEN '1/4 cup'
  END
FROM recipes r, ingredients i
WHERE r.title = 'Dal Makhani'
AND i.name IN ('Black Lentils', 'Kidney Beans', 'Onions', 'Tomatoes', 'Ginger', 'Garlic', 'Garam Masala', 'Cream', 'Ghee', 'Cilantro');

-- Create reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, recipe_id)
);

-- Add indexes for better performance
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

-- Add calories to recipes
UPDATE recipes SET calories = 
  CASE title
    WHEN 'Butter Chicken' THEN 490
    WHEN 'Biryani' THEN 650
    WHEN 'Palak Paneer' THEN 325
    WHEN 'Chana Masala' THEN 310
    WHEN 'Dal Makhani' THEN 425
    WHEN 'Classic Spaghetti Bolognese' THEN 580
  END
WHERE title IN ('Butter Chicken', 'Biryani', 'Palak Paneer', 'Chana Masala', 'Dal Makhani', 'Classic Spaghetti Bolognese');

-- Add calories column to recipes table if not exists
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS calories INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS prep_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS cooking_time INTEGER DEFAULT 0;

-- Create admin_notifications table
CREATE TABLE admin_notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type TEXT NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index for better performance
CREATE INDEX idx_admin_notifications_status ON admin_notifications(status);
CREATE INDEX idx_admin_notifications_created_at ON admin_notifications(created_at);

-- Create a function to update recipe calories
CREATE OR REPLACE FUNCTION update_recipe_calories()
RETURNS void AS $$
BEGIN
  -- Update Butter Chicken (based on standard recipe per serving)
  UPDATE recipes SET calories = 490 WHERE title = 'Butter Chicken';
  
  -- Update Biryani
  UPDATE recipes SET calories = 650 WHERE title = 'Biryani';
  
  -- Update Palak Paneer
  UPDATE recipes SET calories = 325 WHERE title = 'Palak Paneer';
  
  -- Update Chana Masala
  UPDATE recipes SET calories = 310 WHERE title = 'Chana Masala';
  
  -- Update Dal Makhani
  UPDATE recipes SET calories = 425 WHERE title = 'Dal Makhani';
  
  -- Update Spaghetti Bolognese
  UPDATE recipes SET calories = 580 WHERE title = 'Classic Spaghetti Bolognese';
END;
$$ LANGUAGE plpgsql;

-- Execute the function to update calories
SELECT update_recipe_calories(); 