import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetails from './pages/RecipeDetails';
import CreateRecipe from './pages/CreateRecipe';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';
import Header from './components/Header';
import { useApp } from './context/AppContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthCallback() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // After successful authentication, redirect to home
    navigate('/');
  }, [navigate]);

  return null;
}

function App() {
  const { user } = useApp();

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#FFF5F5]">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/search" element={<RecipeSearch />} />
            <Route path="/create" element={<CreateRecipe />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
