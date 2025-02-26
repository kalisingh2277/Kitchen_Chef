import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

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

export default function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const { user, favorites, toggleFavorite } = useApp();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    if (!id) return;
    
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();

      if (data.meals?.[0]) {
        const recipeData = data.meals[0];
        const ingredients: string[] = [];
        const measurements: string[] = [];

        // Extract ingredients and measurements
        for (let i = 1; i <= 20; i++) {
          const ingredient = recipeData[`strIngredient${i}`];
          const measure = recipeData[`strMeasure${i}`];
          
          if (ingredient && ingredient.trim()) {
            ingredients.push(ingredient.trim());
            measurements.push(measure?.trim() || '');
          }
        }

        // Format instructions into steps
        const instructions = recipeData.strInstructions
          .split(/\r\n|\n|\r/)
          .filter((step: string) => step.trim().length > 0)
          .map((step: string) => step.trim());

        setRecipe({
          ...recipeData,
          ingredients,
          measurements,
          formattedInstructions: instructions,
          calories: Math.floor(Math.random() * (800 - 300) + 300) // Random calorie between 300-800
        });
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Failed to fetch recipe details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">{error || 'Recipe not found'}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#FFF5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Hero Section */}
          <div className="relative h-96">
            <img
              src={recipe?.strMealThumb}
              alt={recipe?.strMeal}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{recipe?.strMeal}</h1>
              <div className="flex items-center gap-4 text-white">
                <span className="flex items-center gap-1">
                  <span className="text-lg">🔥</span>
                  {recipe?.calories || 0} kcal
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-lg">🌍</span>
                  {recipe?.strArea} Cuisine
                </span>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Ingredients Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Ingredients</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe?.ingredients?.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <span className="text-2xl">🥘</span>
                    <div>
                      <p className="font-medium text-[#2C1810]">{ingredient}</p>
                      <p className="text-sm text-gray-600">{recipe.measurements?.[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2C1810] mb-6">Instructions</h2>
              <ol className="space-y-6">
                {recipe?.formattedInstructions?.map((step, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#FF6B6B] text-white rounded-full">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 