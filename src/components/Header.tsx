import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-gradient-to-r from-[#2C1810] to-[#1F1007] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                👨‍🍳
              </span>
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-[#2C1810]' : 'text-white'
              }`}>
                Kitchen Chef
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/create"
              className={`transition-all duration-300 hover:text-[#FF6B6B] ${
                isScrolled ? 'text-gray-700' : 'text-gray-200'
              }`}
            >
              Start Creating
            </Link>
            <Link
              to="/search"
              className={`transition-all duration-300 hover:text-[#FF6B6B] ${
                isScrolled ? 'text-gray-700' : 'text-gray-200'
              }`}
            >
              Browse Recipes
            </Link>
            {user ? (
              <>
                <Link
                  to="/favorites"
                  className={`transition-all duration-300 hover:text-[#FF6B6B] ${
                    isScrolled ? 'text-gray-700' : 'text-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>❤️</span>
                    <span>Favorites</span>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className={`transition-all duration-300 hover:text-[#FF6B6B] ${
                    isScrolled ? 'text-gray-700' : 'text-gray-200'
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                  className="px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-medium hover:bg-[#FF8787] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2 bg-[#FF6B6B] text-white rounded-full font-medium hover:bg-[#FF8787] transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Get Started
              </Link>
            )}
          </nav>
        </div>
      </div>
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg py-1">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-[#2C1810] hover:bg-gray-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile Settings
          </Link>
          <button
            onClick={() => {
              setIsMenuOpen(false);
              handleSignOut();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-[#2C1810] hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
} 