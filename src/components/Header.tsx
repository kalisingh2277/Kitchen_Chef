import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bars3Icon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, signOut } = useApp();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#2C1810] text-white shadow-lg">
      <style>
        {`
          @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.1); }
            40% { transform: scale(1); }
            60% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          .heart-icon {
            color: #FF6B6B;
            transition: all 0.3s ease;
          }
          .heart-icon:hover {
            animation: heartBeat 1s infinite;
            color: #FF4444;
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(-10deg); }
            20% { transform: rotate(12deg); }
            30% { transform: rotate(-10deg); }
            40% { transform: rotate(9deg); }
            50% { transform: rotate(0deg); }
            100% { transform: rotate(0deg); }
          }
          .chef-emoji {
            display: inline-block;
            font-size: 1.5rem;
            transition: all 0.3s ease;
          }
          .chef-emoji:hover {
            animation: wave 2s infinite;
            cursor: pointer;
          }
        `}
      </style>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="chef-emoji">👩🏻‍🍳</span>
              <span className="text-xl font-bold">Kitchen Chef</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-[#3D261C] focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link to="/search" className="hover:text-gray-300 px-3 py-2 rounded-md">Search Recipes</Link>
            <Link to="/create" className="hover:text-gray-300 px-3 py-2 rounded-md">Create Recipe</Link>
            <Link to="/favorites" className="hover:text-gray-300 px-3 py-2 rounded-md flex items-center group">
              <HeartIcon className="h-5 w-5 mr-1 heart-icon" />
              <span>Favorites</span>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 px-3 py-2 rounded-md">Dashboard</Link>
                <button
                  onClick={handleSignOut}
                  className="bg-[#FF6B6B] hover:bg-[#FF5252] px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-[#FF6B6B] hover:bg-[#FF5252] px-4 py-2 rounded-md transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md hover:bg-[#3D261C]"
              onClick={() => setIsMenuOpen(false)}
            >
              Search Recipes
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md hover:bg-[#3D261C]"
              onClick={() => setIsMenuOpen(false)}
            >
              Create Recipe
            </Link>
            <Link
              to="/favorites"
              className="block px-3 py-2 rounded-md hover:bg-[#3D261C] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <HeartIcon className="h-5 w-5 mr-1 heart-icon" />
              <span>Favorites</span>
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md hover:bg-[#3D261C]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2 rounded-md bg-[#FF6B6B] hover:bg-[#FF5252] transition-colors duration-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="block px-3 py-2 rounded-md bg-[#FF6B6B] hover:bg-[#FF5252] transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 