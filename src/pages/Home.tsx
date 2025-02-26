import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const recipeBackgrounds = [
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    title: "Discover Global Cuisines",
    subtitle: "From Italian to Asian, explore flavors from around the world"
  },
  {
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070&auto=format&fit=crop",
    title: "Fresh Ingredients",
    subtitle: "Create magic with seasonal and fresh ingredients"
  },
  {
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop",
    title: "Perfect Your Skills",
    subtitle: "Master the art of cooking with expert guidance"
  },
  {
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2070&auto=format&fit=crop",
    title: "Healthy Living",
    subtitle: "Discover nutritious and delicious recipes"
  }
];

export default function Home() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % recipeBackgrounds.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Dynamic Background */}
      <div className="relative min-h-[90vh] bg-[#2C1810]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/90 via-[#2C1810]/60 to-[#2C1810]/90 z-10" />
          {recipeBackgrounds.map((bg, index) => (
            <img
              key={bg.image}
              src={bg.image}
              alt={bg.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentBgIndex ? 'opacity-60' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex min-h-[90vh] items-center">
          <div className="text-left max-w-2xl">
            <div className="transition-all duration-500 transform">
              <span className="text-[#FF6B6B] font-medium text-lg mb-4 block">
                {recipeBackgrounds[currentBgIndex].subtitle}
              </span>
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">{recipeBackgrounds[currentBgIndex].title}</span>
                <span className="block text-[#FFA07A] mt-2">Kitchen Chef</span>
              </h1>
              <p className="mt-6 text-lg text-gray-300 max-w-lg">
                Turn everyday ingredients into extraordinary meals. Discover recipes that match what's in your kitchen, and let your culinary creativity shine.
              </p>
              <div className="mt-10 flex gap-4">
                <Link
                  to="/search"
                  className="rounded-full px-8 py-4 bg-[#FF6B6B] text-white font-medium hover:bg-[#FF8787] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Background Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {recipeBackgrounds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBgIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBgIndex ? 'bg-[#FF6B6B] w-8' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Show background ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative bg-[#FFF5F5] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#2C1810]">Why Chefs Love Us</h2>
            <div className="w-24 h-1 bg-[#FF6B6B] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-[#2C1810] mb-4">
                Smart Recipe Search
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Find the perfect recipe based on your available ingredients and preferences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="text-xl font-bold text-[#2C1810] mb-4">
                Personalized Experience
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get recipe recommendations tailored to your taste and dietary preferences.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-xl font-bold text-[#2C1810] mb-4">
                Easy to Use
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Simple and intuitive interface to help you find and save your favorite recipes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 