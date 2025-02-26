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
  ('Curry Leaves'),
  ('Black Lentils'),
  ('Kidney Beans'),
  ('Spinach'),
  ('Cream')
ON CONFLICT (name) DO NOTHING;

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

-- Add recipe ingredients for each recipe
DO $$ 
DECLARE
  recipe_id uuid;
  ingredient_id uuid;
BEGIN
  -- Butter Chicken
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Butter Chicken';
  IF recipe_id IS NOT NULL THEN
    FOR ingredient_id, amount IN 
    SELECT i.id, a.amount
    FROM ingredients i,
    (VALUES 
      ('Chicken', '1 kg'),
      ('Tomatoes', '6 medium'),
      ('Onions', '2 large'),
      ('Garlic', '8 cloves'),
      ('Ginger', '2-inch piece'),
      ('Yogurt', '1 cup'),
      ('Garam Masala', '2 tsp'),
      ('Turmeric', '1 tsp'),
      ('Red Chili Powder', '1 tsp'),
      ('Ghee', '4 tbsp')
    ) AS a(ingredient_name, amount)
    WHERE i.name = a.ingredient_name
    LOOP
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
      VALUES (recipe_id, ingredient_id, amount)
      ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
    END LOOP;
  END IF;

  -- Biryani
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Biryani';
  IF recipe_id IS NOT NULL THEN
    FOR ingredient_id, amount IN 
    SELECT i.id, a.amount
    FROM ingredients i,
    (VALUES 
      ('Basmati Rice', '500g'),
      ('Chicken', '750g'),
      ('Onions', '3 large'),
      ('Yogurt', '1 cup'),
      ('Ginger', '2-inch piece'),
      ('Garlic', '8 cloves'),
      ('Garam Masala', '2 tsp'),
      ('Green Chilies', '4-5'),
      ('Cilantro', '1 cup'),
      ('Ghee', '4 tbsp')
    ) AS a(ingredient_name, amount)
    WHERE i.name = a.ingredient_name
    LOOP
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
      VALUES (recipe_id, ingredient_id, amount)
      ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
    END LOOP;
  END IF;

  -- Palak Paneer
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Palak Paneer';
  IF recipe_id IS NOT NULL THEN
    FOR ingredient_id, amount IN 
    SELECT i.id, a.amount
    FROM ingredients i,
    (VALUES 
      ('Paneer', '250g'),
      ('Spinach', '500g'),
      ('Onions', '1 large'),
      ('Garlic', '6 cloves'),
      ('Ginger', '1-inch piece'),
      ('Garam Masala', '1 tsp'),
      ('Turmeric', '1/2 tsp'),
      ('Green Chilies', '2-3'),
      ('Ghee', '2 tbsp'),
      ('Cream', '1/4 cup')
    ) AS a(ingredient_name, amount)
    WHERE i.name = a.ingredient_name
    LOOP
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
      VALUES (recipe_id, ingredient_id, amount)
      ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
    END LOOP;
  END IF;

  -- Chana Masala
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Chana Masala';
  IF recipe_id IS NOT NULL THEN
    FOR ingredient_id, amount IN 
    SELECT i.id, a.amount
    FROM ingredients i,
    (VALUES 
      ('Chickpeas', '2 cups'),
      ('Onions', '2 medium'),
      ('Tomatoes', '3 medium'),
      ('Ginger', '1-inch piece'),
      ('Garlic', '6 cloves'),
      ('Garam Masala', '1 tsp'),
      ('Cumin Seeds', '1 tsp'),
      ('Coriander Powder', '2 tsp'),
      ('Green Chilies', '2-3'),
      ('Cilantro', '1/2 cup')
    ) AS a(ingredient_name, amount)
    WHERE i.name = a.ingredient_name
    LOOP
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
      VALUES (recipe_id, ingredient_id, amount)
      ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
    END LOOP;
  END IF;

  -- Dal Makhani
  SELECT id INTO recipe_id FROM recipes WHERE title = 'Dal Makhani';
  IF recipe_id IS NOT NULL THEN
    FOR ingredient_id, amount IN 
    SELECT i.id, a.amount
    FROM ingredients i,
    (VALUES 
      ('Black Lentils', '2 cups'),
      ('Kidney Beans', '1/2 cup'),
      ('Onions', '2 large'),
      ('Tomatoes', '4 medium'),
      ('Ginger', '2-inch piece'),
      ('Garlic', '8 cloves'),
      ('Garam Masala', '2 tsp'),
      ('Cream', '1/2 cup'),
      ('Ghee', '4 tbsp'),
      ('Cilantro', '1/4 cup')
    ) AS a(ingredient_name, amount)
    WHERE i.name = a.ingredient_name
    LOOP
      INSERT INTO recipe_ingredients (recipe_id, ingredient_id, amount)
      VALUES (recipe_id, ingredient_id, amount)
      ON CONFLICT (recipe_id, ingredient_id) DO NOTHING;
    END LOOP;
  END IF;
END $$; 