import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Helper function for password reset
export const sendPasswordResetEmail = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
      data: {
        email_subject: 'Reset Your Kitchen Chef Password',
        email_template: 'kitchen-chef-reset'
      }
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Helper function for OTP verification
export const verifyOTP = async (email: string, token: string) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });
    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

// Type definitions for our database schema
export type User = {
  id: string;
  username: string;
  email: string;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  image_url: string;
  food_type: string;
  calories: number;
  prep_time: number;
  cooking_time: number;
  servings: number;
  rating?: number;
  total_ratings?: number;
};

export type Rating = {
  id: string;
  user_id: string;
  recipe_id: string;
  rating: number;
  created_at: string;
};

export type Feedback = {
  id: string;
  user_id: string;
  recipe_id: string;
  comment: string;
  created_at: string;
};

export type Ingredient = {
  id: string;
  name: string;
};

export type RecipeIngredient = {
  recipe_id: string;
  ingredient_id: string;
  measurement: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  recipe_id: string;
  saved_at: string;
}; 