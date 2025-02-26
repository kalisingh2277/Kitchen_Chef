import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import RecipeCard from '../components/RecipeCard';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
}

// Common ingredients list
const commonIngredients = [
  'Chicken', 'Beef', 'Pork', 'Fish',
  'Rice', 'Pasta', 'Potatoes', 'Bread',
  'Tomatoes', 'Onions', 'Garlic', 'Bell Peppers',
  'Carrots', 'Broccoli', 'Spinach', 'Mushrooms',
  'Eggs', 'Milk', 'Cheese', 'Butter',
  'Olive Oil', 'Soy Sauce', 'Ginger', 'Lemon',
  'Salt', 'Pepper', 'Cumin', 'Paprika',
  'Flour', 'Sugar', 'Honey', 'Vinegar'
].sort();

export default function CreateRecipe() {
  const { user } = useApp();
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllRecipes, setShowAllRecipes] = useState(false);

  // Filter ingredients based on search term
  const filteredIngredients = commonIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle ingredient selection
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Search for recipes when ingredients are selected
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      searchRecipes();
    } else {
      setRecipes([]);
    }
  }, [selectedIngredients]);

  const searchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      // First, get all recipes that contain the first ingredient
      const mainIngredient = selectedIngredients[0];
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(mainIngredient)}`
      );
      const data = await response.json();

      if (data.meals) {
        // Fetch detailed information for each recipe
        const detailedRecipes = await Promise.all(
          data.meals.map(async (meal: any) => {
            const detailResponse = await fetch(
              `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
            );
            const detailData = await detailResponse.json();
            return detailData.meals[0];
          })
        );

        if (showAllRecipes) {
          // Show all recipes that contain at least one selected ingredient
          setRecipes(detailedRecipes);
        } else {
          // Filter recipes that contain all selected ingredients
          const filteredRecipes = detailedRecipes.filter(recipe => {
            const recipeIngredients = Array.from({ length: 20 }, (_, i) => {
              const ingredient = recipe[`strIngredient${i + 1}`];
              return ingredient ? ingredient.trim().toLowerCase() : '';
            }).filter(Boolean);

            return selectedIngredients.every(ingredient =>
              recipeIngredients.some(ri =>
                ri.includes(ingredient.toLowerCase())
              )
            );
          });

          setRecipes(filteredRecipes);
        }
      } else {
        setRecipes([]);
      }
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="pt-24 min-h-screen bg-[#FFF5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#2C1810] mb-4">
            Create from Your Ingredients
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Select the ingredients you have, and we'll suggest recipes you can make.
          </p>
          {!user && (
            <Link
              to="/auth"
              className="inline-block px-6 py-3 bg-[#FF6B6B] text-white rounded-full font-medium hover:bg-[#FF8787] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Sign in to save your favorite recipes ❤️
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ingredients Selection Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#2C1810] mb-2">
                  Your Ingredients
                </h3>
                <p className="text-sm text-gray-500">
                  Selected: {selectedIngredients.length} ingredients
                </p>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search ingredients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                />
              </div>

              {/* Selected Ingredients */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FF6B6B] text-white shadow-sm"
                    >
                      {ingredient}
                      <button
                        onClick={() => toggleIngredient(ingredient)}
                        className="ml-2 focus:outline-none hover:text-red-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Display Mode Toggle */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showAllRecipes}
                    onChange={(e) => {
                      setShowAllRecipes(e.target.checked);
                      if (selectedIngredients.length > 0) {
                        searchRecipes();
                      }
                    }}
                    className="rounded text-[#FF6B6B] focus:ring-[#FF6B6B]"
                  />
                  <span>Show recipes with any of these ingredients</span>
                </label>
              </div>

              {/* Available Ingredients */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-[#FF6B6B] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Recipe Suggestions */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-12">
                  <p>{error}</p>
                </div>
              ) : recipes.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-[#2C1810]">
                      {showAllRecipes ? 'Recipes With Selected Ingredients' : 'Perfect Matches'}
                    </h2>
                    <span className="text-gray-500">
                      {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'} found
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.idMeal}
                        id={recipe.idMeal}
                        title={recipe.strMeal}
                        description={recipe.strInstructions.slice(0, 100) + '...'}
                        imageUrl={recipe.strMealThumb}
                        cookingTime={estimateCookingTime(recipe.strInstructions)}
                        servings={estimateServings()}
                        cuisine={recipe.strArea || 'International'}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <div className="text-4xl mb-4">🥘</div>
                  <p className="text-lg font-medium">
                    {selectedIngredients.length > 0
                      ? 'No recipes found with these ingredients'
                      : 'Select ingredients to find matching recipes'}
                  </p>
                  {selectedIngredients.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-400">
                        Try selecting fewer ingredients or different combinations
                      </p>
                      <button
                        onClick={() => setShowAllRecipes(true)}
                        className="text-[#FF6B6B] hover:text-[#FF8787] font-medium"
                      >
                        Or show recipes with any of these ingredients →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 