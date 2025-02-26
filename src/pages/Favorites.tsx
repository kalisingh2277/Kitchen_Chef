import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

export default function Favorites() {
  const { user, favorites } = useApp();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchFavoriteRecipes();
  }, [user, favorites]);

  const fetchFavoriteRecipes = async () => {
    if (favorites.length === 0) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const recipePromises = favorites.map(async (id) => {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        );
        const data = await response.json();
        return data.meals?.[0];
      });

      const results = await Promise.all(recipePromises);
      setRecipes(results.filter(Boolean));
    } catch (err) {
      setError('Failed to fetch favorite recipes');
      console.error('Error fetching favorite recipes:', err);
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
            Your Favorite Recipes
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            All your saved recipes in one place. Click on any recipe to view the full details.
          </p>
        </div>

        {/* Main Content */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : (
            <div className="text-center text-gray-500 py-12">
              <div className="text-4xl mb-4">❤️</div>
              <p className="text-lg font-medium">No favorite recipes yet</p>
              <p className="mt-2 text-sm text-gray-400">
                Start exploring recipes and save your favorites!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 