import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient, User } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

interface AppContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<string>;
  signOut: () => Promise<void>;
  loading: boolean;
  favorites: string[];
  toggleFavorite: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        throw new Error(error.message);
      }

      if (!data.user || !data.session) {
        throw new Error('Login failed. Please try again.');
      }

      // Update user state
      setUser(data.user);
      
      // Load user's favorites
      const storedFavorites = localStorage.getItem(`favorites_${data.user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }

    } catch (error) {
      console.error('Sign in process error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  const signUp = async (email: string, password: string, fullName: string): Promise<string> => {
    try {
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select()
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      // Create new user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error('Failed to create account. Please try again.');
      }

      // Wait for a short delay to ensure the account is properly created
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create user profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
            created_at: new Date().toISOString()
          }
        ]);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Continue even if profile creation fails, as we can create it later
      }

      // Set user state
      setUser(data.user);

      return 'Account created successfully! You can now sign in.';
    } catch (error) {
      console.error('Signup process error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create account. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setFavorites([]);
    } catch (error) {
      throw error;
    }
  };

  const toggleFavorite = (recipeId: string) => {
    if (!user) return;

    setFavorites(prev => {
      const newFavorites = prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId];
      
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (recipeId: string) => {
    return favorites.includes(recipeId);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    favorites,
    toggleFavorite,
    isFavorite,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 