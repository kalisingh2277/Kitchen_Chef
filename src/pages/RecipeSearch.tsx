import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';
import React from 'react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
  calories?: number;
  ingredients?: string[];
  measurements?: string[];
  formattedInstructions?: string[];
}

const foodTypes = [
  'Indian',
  'Italian',
  'Mexican',
  'American',
  'Chinese',
  'Thai',
  'Japanese',
  'French',
  'Greek',
  'Spanish',
  'Turkish',
  'Vietnamese',
  'British'
];

// Additional recipe data for each cuisine
const additionalRecipes: { [key: string]: Recipe[] } = {
  Indian: [
    {
      idMeal: 'custom_1',
      strMeal: 'Butter Chicken',
      strInstructions: 'Traditional Indian curry made with tender chicken in a rich, creamy tomato-based sauce...',
      strMealThumb: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800',
      strArea: 'Indian',
      strCategory: 'Chicken',
      calories: 450
    },
    {
      idMeal: 'custom_2',
      strMeal: 'Palak Paneer',
      strInstructions: 'Creamy spinach curry with fresh paneer cheese...',
      strMealThumb: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800',
      strArea: 'Indian',
      strCategory: 'Vegetarian',
      calories: 380
    },
    {
      idMeal: 'custom_3',
      strMeal: 'Dal Makhani',
      strInstructions: 'Creamy black lentils cooked overnight...',
      strMealThumb: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
      strArea: 'Indian',
      strCategory: 'Vegetarian',
      calories: 320
    }
  ],
  Italian: [
    {
      idMeal: 'custom_4',
      strMeal: 'Homemade Lasagna',
      strInstructions: 'Layers of pasta, rich meat sauce, and creamy bechamel...',
      strMealThumb: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800',
      strArea: 'Italian',
      strCategory: 'Pasta',
      calories: 550
    },
    {
      idMeal: 'custom_5',
      strMeal: 'Risotto ai Funghi',
      strInstructions: 'Creamy mushroom risotto with parmesan...',
      strMealThumb: 'https://images.unsplash.com/photo-1576749872435-ff88a71c1ae2?w=800',
      strArea: 'Italian',
      strCategory: 'Rice',
      calories: 420
    }
  ],
  Chinese: [
    {
      idMeal: 'custom_6',
      strMeal: 'Kung Pao Chicken',
      strInstructions: 'Spicy stir-fried chicken with peanuts...',
      strMealThumb: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800',
      strArea: 'Chinese',
      strCategory: 'Chicken',
      calories: 420
    },
    {
      idMeal: 'custom_7',
      strMeal: 'Mapo Tofu',
      strInstructions: 'Spicy tofu dish with minced pork...',
      strMealThumb: 'https://images.unsplash.com/photo-1582321356533-c0b97706d03e?w=800',
      strArea: 'Chinese',
      strCategory: 'Pork',
      calories: 380
    }
  ],
  Mexican: [
    {
      idMeal: 'custom_8',
      strMeal: 'Enchiladas Verdes',
      strInstructions: 'Corn tortillas filled with chicken and covered in green salsa...',
      strMealThumb: 'https://images.unsplash.com/photo-1534352956036-cd81e27dd615?w=800',
      strArea: 'Mexican',
      strCategory: 'Chicken',
      calories: 460
    },
    {
      idMeal: 'custom_9',
      strMeal: 'Chiles en Nogada',
      strInstructions: 'Poblano chiles filled with picadillo...',
      strMealThumb: 'https://images.unsplash.com/photo-1613514785940-daed77267f7b?w=800',
      strArea: 'Mexican',
      strCategory: 'Vegetarian',
      calories: 420
    }
  ],
  Japanese: [
    {
      idMeal: 'custom_10',
      strMeal: 'Ramen Tonkotsu',
      strInstructions: 'Rich pork bone broth with fresh noodles...',
      strMealThumb: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800',
      strArea: 'Japanese',
      strCategory: 'Noodles',
      calories: 550
    },
    {
      idMeal: 'custom_11',
      strMeal: 'Katsu Curry',
      strInstructions: 'Crispy breaded pork cutlet with curry sauce...',
      strMealThumb: 'https://images.unsplash.com/photo-1604579278540-db35e3c1dd95?w=800',
      strArea: 'Japanese',
      strCategory: 'Curry',
      calories: 480
    }
  ]
};

// Function to estimate cooking time based on instructions length
const estimateCookingTime = (instructions: string): number => {
  const steps = instructions.split('\r\n').filter(step => step.trim().length > 0);
  return Math.max(30, steps.length * 15); // Minimum 30 mins, otherwise 15 mins per step
};

// Function to estimate servings (if not provided, default to 4)
const estimateServings = (): number => {
  return 4;
};

// Function to estimate calories based on recipe complexity and ingredients
const estimateCalories = (instructions: string): number => {
  const steps = instructions.split('\r\n').filter(step => step.trim().length > 0);
  const baseCalories = 300; // Base calories for a standard meal
  return baseCalories + (steps.length * 20); // Add 20 calories per step as a rough estimate
};

// Add performance optimizations
const RecipeGrid = React.memo(({ recipes }: { recipes: Recipe[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {recipes.map((recipe) => (
      <RecipeCard
        key={recipe.idMeal}
        id={recipe.idMeal}
        title={recipe.strMeal}
        description={recipe.strInstructions?.slice(0, 150) + '...' || 'Delicious recipe awaits...'}
        imageUrl={recipe.strMealThumb}
        cookingTime={estimateCookingTime(recipe.strInstructions || '')}
        servings={estimateServings()}
        cuisine={recipe.strArea || 'International'}
        calories={recipe.calories || estimateCalories(recipe.strInstructions || '')}
        ingredients={recipe.ingredients || []}
        measurements={recipe.measurements || []}
        instructions={recipe.formattedInstructions || []}
      />
    ))}
  </div>
));

// Function to fetch recipes from multiple sources
const fetchRecipesFromAllSources = async (cuisine: string): Promise<Recipe[]> => {
  try {
    let recipes: Recipe[] = [];
    
    // First, try to get recipes from TheMealDB API
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
    const data = await response.json();
    
    if (data.meals) {
      // Fetch detailed information for each recipe
      const apiRecipes = await Promise.all(
        data.meals.slice(0, 10).map(async (meal: any) => {
          try {
            const detailResponse = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detailData = await detailResponse.json();
            
            if (!detailData.meals?.[0]) return null;

            const recipe = detailData.meals[0];
            
            // Extract ingredients and measurements
            const ingredients: string[] = [];
            const measurements: string[] = [];
            
            for (let i = 1; i <= 20; i++) {
              const ingredient = recipe[`strIngredient${i}`];
              const measure = recipe[`strMeasure${i}`];
              
              if (ingredient && ingredient.trim()) {
                ingredients.push(ingredient.trim());
                measurements.push(measure?.trim() || '');
              }
            }

            // Format instructions into clear steps
            const instructions = recipe.strInstructions
              .split(/\r\n|\n|\r/)
              .filter((step: string) => step.trim().length > 0)
              .map((step: string) => step.trim());

            return {
              idMeal: recipe.idMeal,
              strMeal: recipe.strMeal,
              strInstructions: recipe.strInstructions,
              strMealThumb: recipe.strMealThumb,
              strArea: recipe.strArea || cuisine,
              strCategory: recipe.strCategory || 'Main Course',
              calories: estimateCalories(recipe.strInstructions),
              ingredients,
              measurements,
              formattedInstructions: instructions
            };
          } catch (error) {
            console.error(`Error fetching details for recipe ${meal.idMeal}:`, error);
            return null;
          }
        })
      );

      recipes = apiRecipes.filter((recipe): recipe is Recipe => recipe !== null);
    }

    // Add custom recipes for the cuisine if available
    if (additionalRecipes[cuisine]) {
      const formattedCustomRecipes = additionalRecipes[cuisine].map(recipe => ({
        ...recipe,
        formattedInstructions: recipe.strInstructions
          .split(/\r\n|\n|\r/)
          .filter(step => step.trim().length > 0)
          .map(step => step.trim()),
        ingredients: recipe.ingredients || [],
        measurements: recipe.measurements || [],
        rating: 0,
        total_ratings: 0
      }));
      
      recipes = [...recipes, ...formattedCustomRecipes];
    }

    // If no recipes found, add some default recipes
    if (recipes.length === 0) {
      recipes = [
        {
          idMeal: `default_${cuisine}_1`,
          strMeal: `Traditional ${cuisine} Dish`,
          strInstructions: 'This is a traditional dish from this cuisine...',
          strMealThumb: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
          strArea: cuisine,
          strCategory: 'Main Course',
          calories: 450,
          ingredients: ['Ingredient 1', 'Ingredient 2'],
          measurements: ['1 cup', '2 tbsp'],
          formattedInstructions: ['Step 1: Prepare ingredients', 'Step 2: Cook the dish']
        }
      ];
    }

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export default function RecipeSearch() {
  const { user } = useApp();
  const [selectedFoodType, setSelectedFoodType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const recipesPerPage = 12;

  useEffect(() => {
    setPage(1);
    setRecipes([]);
    fetchRecipes(1);
  }, [selectedFoodType, isVegetarian]);

  const fetchRecipes = async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      let allRecipes: Recipe[] = [];
      
      if (selectedFoodType) {
        allRecipes = await fetchRecipesFromAllSources(selectedFoodType);
      } else {
        // Fetch a mix of recipes from different cuisines
        const defaultCuisines = ['Indian', 'Italian', 'Chinese', 'Mexican', 'French'];
        const promises = defaultCuisines.map(cuisine => fetchRecipesFromAllSources(cuisine));
        const results = await Promise.all(promises);
        allRecipes = results.flat();
      }

      // Filter recipes
      const filteredRecipes = allRecipes
        .filter((recipe: Recipe) => {
          // Basic filter to remove unwanted recipes
          if (recipe.strMeal.toLowerCase() === 'migas') return false;

          // Vegetarian filter
          if (isVegetarian) {
            const nonVegKeywords = [
              'chicken', 'beef', 'pork', 'fish', 'lamb', 'meat', 'seafood',
              'prawn', 'shrimp', 'turkey', 'bacon', 'ham', 'sausage'
            ];
            
            // Check if recipe name or category contains non-veg keywords
            const isNonVeg = nonVegKeywords.some(keyword => 
              recipe.strMeal.toLowerCase().includes(keyword) ||
              recipe.strCategory?.toLowerCase().includes(keyword)
            );
            
            return !isNonVeg;
          }

          return true;
        });

      // Calculate pagination
      const startIndex = (pageNum - 1) * recipesPerPage;
      const endIndex = startIndex + recipesPerPage;
      const newRecipes = filteredRecipes.slice(startIndex, endIndex);
      
      if (pageNum === 1) {
        setRecipes(newRecipes);
      } else {
        setRecipes(prev => [...prev, ...newRecipes]);
      }

      // Check if there are more recipes to load
      setHasMore(endIndex < filteredRecipes.length);

      // If no recipes found after filtering, show appropriate message
      if (filteredRecipes.length === 0) {
        setError(
          isVegetarian
            ? 'No vegetarian recipes found for this cuisine. Try a different cuisine or disable vegetarian filter.'
            : 'No recipes found for this cuisine. Try a different cuisine.'
        );
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipes(nextPage);
  };

  return (
    <div className="pt-24 min-h-screen bg-[#FFF5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C1810] mb-4">
            Explore World Cuisines
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover delicious recipes from around the world. Select your preferred cuisine type to start your culinary journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Vegetarian Toggle */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#2C1810]">
                  Vegetarian Only
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={isVegetarian}
                    onChange={(e) => setIsVegetarian(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FF6B6B]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B6B]"></div>
                </label>
              </div>
            </div>

            {/* Cuisine Type Filter */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-[#2C1810] mb-4">
                Cuisine Type
              </h3>
              <div className="space-y-2">
                {foodTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedFoodType(selectedFoodType === type ? null : type)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedFoodType === type
                        ? 'bg-[#FF6B6B] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Recipe Grid */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              {loading && page === 1 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">
                  <p>{error}</p>
                </div>
              ) : recipes.length > 0 ? (
                <div>
                  <RecipeGrid recipes={recipes} />
                  {hasMore && (
                    <div className="mt-8 text-center">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className={`px-6 py-3 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF8787] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                          loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Loading...
                          </span>
                        ) : (
                          'Load More Recipes'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">👨‍🍳</div>
                  <p className="text-lg font-medium">
                    {selectedFoodType
                      ? 'No recipes found for this cuisine'
                      : 'Select a cuisine type to find recipes'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}