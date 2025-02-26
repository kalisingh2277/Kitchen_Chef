import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <span className="text-2xl">👨‍🍳</span>
              <span className="text-2xl font-bold text-white">Kitchen Chef</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Recipes
            </Link>
            <Link
              to="/"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Techniques
            </Link>
            <Link
              to="/"
              className="text-gray-200 hover:text-white transition-colors"
            >
              Community
            </Link>
            <Link
              to="/auth"
              className="px-6 py-3 bg-[#FF6B6B] text-white rounded-full font-medium hover:bg-[#FF8787] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 