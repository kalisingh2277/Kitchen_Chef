import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/animations.css';

const validatePassword = (password: string): { isValid: boolean; error: string } => {
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }
  return { isValid: true, error: '' };
};

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the access_token from the URL hash
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (accessToken) {
      // Set the access token in Supabase session
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: '',
      });
    } else {
      // If no access token is present, redirect to the login page
      navigate('/auth');
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate password
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Check if passwords match
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Update password in Supabase
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSuccess('Password updated successfully!');
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-[#FFF5F5]">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2C1810] animate-fadeIn">
              Set New Password
            </h1>
            <p className="text-gray-600 mt-2 animate-fadeIn stagger-1">
              Please enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-slideIn">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 animate-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fadeIn stagger-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#2C1810]">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors focus-ring hover-lift"
                required
              />
            </div>

            <div className="animate-fadeIn stagger-3">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2C1810]">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors focus-ring hover-lift"
                required
              />
            </div>

            <div className="text-sm text-gray-600 animate-fadeIn stagger-4">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className="animate-fadeIn stagger-1">At least 8 characters long</li>
                <li className="animate-fadeIn stagger-2">At least one uppercase letter</li>
                <li className="animate-fadeIn stagger-3">At least one lowercase letter</li>
                <li className="animate-fadeIn stagger-4">At least one number</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-4 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF8787] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-fadeIn stagger-5 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover-scale animate-pulse'
              }`}
            >
              {loading ? (
                <span className="loading-dots">Updating Password</span>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 