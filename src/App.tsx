import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import { AppProvider } from './context/AppContext';
import RecipeSearch from './pages/RecipeSearch';
import RecipeDetails from './pages/RecipeDetails';
import CreateRecipe from './pages/CreateRecipe';
import Favorites from './pages/Favorites';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#FFF5F5] flex flex-col">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<RecipeSearch />} />
              <Route path="/create" element={<CreateRecipe />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
