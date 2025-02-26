import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface RecipeCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cookingTime: number;
  servings: number;
  cuisine: string;
  calories: number;
  ingredients?: string[];
  measurements?: string[];
  instructions?: string[];
}

export default function RecipeCard({
  id,
  title,
  description,
  imageUrl,
  cookingTime,
  servings,
  cuisine,
  calories
}: RecipeCardProps) {
  const { user, toggleFavorite, isFavorite } = useApp();
  const favorite = isFavorite(id);
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(id);
  };

  // Fallback image if the provided URL is invalid
  const fallbackImageUrl = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2026&auto=format&fit=crop";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = fallbackImageUrl;
  };

  return (
    <div className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-500">
      <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
        <img
          src={imageUrl || fallbackImageUrl}
          alt={title}
          onError={handleImageError}
          className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-4 right-4 flex gap-2">
          <span className="px-3 py-1 bg-[#FF6B6B] text-white text-sm font-medium rounded-full shadow-lg">
            {cuisine}
          </span>
          {user && (
            <button
              onClick={handleFavoriteClick}
              className="p-2 rounded-full bg-white shadow-lg bg-opacity-90 hover:bg-opacity-100 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                className={`w-5 h-5 ${
                  favorite ? 'text-red-500 fill-current' : 'text-gray-600'
                } transition-colors duration-300`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#2C1810] mb-2 group-hover:text-[#FF6B6B] transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-900 transition-colors duration-300">
          {description}
        </p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-lg">⏱️</span>
            <span className="text-sm font-medium text-gray-600">{cookingTime} mins</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-lg">👥</span>
            <span className="text-sm font-medium text-gray-600">{servings} servings</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-gray-600">{calories} kcal</span>
          </div>
          <div className="flex items-center space-x-1 bg-gray-50 px-3 py-1 rounded-full">
            <span className="text-lg">🌍</span>
            <span className="text-sm font-medium text-gray-600">{cuisine}</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/recipe/${id}`)}
          className="mt-4 w-full px-4 py-2 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF8787] transition-colors"
        >
          View Recipe
        </button>
      </div>
    </div>
  );
} 