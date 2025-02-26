import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { supabase, sendPasswordResetEmail, verifyOTP } from '../lib/supabase';
import '../styles/animations.css';

const foodImages = [
  'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=2070&auto=format&fit=crop',
];

const foodQuotes = [
  {
    quote: "Cooking is like painting or writing a song. Just as there are only so many notes or colors, there are only so many flavors—it's how you combine them that sets you apart.",
    author: "Wolfgang Puck"
  },
  {
    quote: "Food is not just eating energy. It's an experience.",
    author: "Guy Fieri"
  },
  {
    quote: "The only real stumbling block is fear of failure. In cooking you've got to have a what-the-hell attitude.",
    author: "Julia Child"
  },
  {
    quote: "Cooking is like love. It should be entered into with abandon or not at all.",
    author: "Harriet Van Horne"
  },
  {
    quote: "Food brings people together on many different levels. It's nourishment of the soul and body.",
    author: "Giada De Laurentiis"
  }
];

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

interface AuthFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();
  const { signIn, signUp } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const [formData, setFormData] = useState<AuthFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
      setCurrentQuoteIndex((prev) => (prev + 1) % foodQuotes.length);
    }, 5000);

    // Load registered emails from localStorage
    const savedEmails = localStorage.getItem('registeredEmails');
    if (savedEmails) {
      setRegisteredEmails(JSON.parse(savedEmails));
    }

    return () => clearInterval(imageInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!formData.fullName) {
          throw new Error('Full name is required');
        }
        
        // Check if email is already registered
        if (registeredEmails.includes(formData.email)) {
          throw new Error('This email is already registered. Please sign in instead.');
        }

        // Validate password during sign up
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const message = await signUp(formData.email, formData.password, formData.fullName);
        
        // Save the email to registered emails
        const updatedEmails = [...registeredEmails, formData.email];
        setRegisteredEmails(updatedEmails);
        localStorage.setItem('registeredEmails', JSON.stringify(updatedEmails));
        
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => {
          setIsSignUp(false);
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
          });
        }, 2000);
      } else {
        // Check if email exists for sign in
        if (!registeredEmails.includes(formData.email)) {
          throw new Error('No account found with this email. Please sign up first.');
        }

        await signIn(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Check if email exists
      if (!registeredEmails.includes(resetEmail)) {
        throw new Error('No account found with this email address');
      }

      const { success, error } = await sendPasswordResetEmail(resetEmail);
      if (!success) throw error;

      setSuccess('Password reset instructions have been sent to your email');
      setIsVerifying(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error } = await verifyOTP(resetEmail, verificationCode);
      if (!success) throw error;

      setSuccess('Code verified successfully. You can now set a new password.');
      navigate('/auth/reset-password');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Render forgot password form
  if (isForgotPassword) {
    return (
      <div className="min-h-screen flex">
        {/* Left Panel - Keep the same as main Auth component */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/90 to-transparent z-10" />
          {foodImages.map((image, index) => (
            <img
              key={image}
              src={image}
              alt="Food imagery"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="relative z-20 p-12 flex flex-col justify-center h-full">
            <div className="max-w-md transition-opacity duration-1000">
              <blockquote className="text-2xl font-light text-white italic mb-4">
                "{foodQuotes[currentQuoteIndex].quote}"
              </blockquote>
              <p className="text-[#FFA07A]">- {foodQuotes[currentQuoteIndex].author}</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Forgot Password Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[#FFF5F5]">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#2C1810] mb-2">
                Reset Your Password
              </h2>
              <p className="text-gray-600">
                {!isVerifying 
                  ? 'Enter your email to receive a verification code'
                  : 'Enter the verification code sent to your email'
                }
              </p>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
                {success}
              </div>
            )}

            <form onSubmit={isVerifying ? handleVerifyCode : handleForgotPassword} className="space-y-6">
              {!isVerifying ? (
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-[#2C1810]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
                    required
                  />
                </div>
              ) : (
                <div>
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-[#2C1810]">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full px-8 py-4 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF8787] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading 
                  ? 'Please wait...' 
                  : isVerifying 
                    ? 'Verify Code' 
                    : 'Send Reset Instructions'
                }
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsVerifying(false);
                  setError('');
                  setSuccess('');
                }}
                className="w-full text-center text-[#FF6B6B] hover:text-[#FF8787] font-medium"
              >
                Back to Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main Auth form (Sign In/Sign Up)
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C1810]/90 to-transparent z-10" />
        {foodImages.map((image, index) => (
          <img
            key={image}
            src={image}
            alt="Food imagery"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="relative z-20 p-12 flex flex-col justify-center h-full">
          <div className="max-w-md transition-opacity duration-1000 animate-float">
            <blockquote className="text-2xl font-light text-white italic mb-4 animate-fadeIn stagger-1">
              "{foodQuotes[currentQuoteIndex].quote}"
            </blockquote>
            <p className="text-[#FFA07A] animate-fadeIn stagger-2">
              - {foodQuotes[currentQuoteIndex].author}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FFF5F5]">
        <div className="max-w-md w-full space-y-8 animate-scaleIn">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-2 animate-fadeIn">
              {isSignUp ? 'Join our culinary community' : 'Welcome back, chef!'}
            </h2>
            <p className="text-gray-600 animate-fadeIn stagger-1">
              {isSignUp
                ? 'Start your journey to amazing recipes'
                : 'Sign in to access your recipe collection'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-slideIn">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 animate-success">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#2C1810]">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors focus-ring hover-lift animate-fadeIn stagger-2"
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C1810]">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors focus-ring hover-lift animate-fadeIn stagger-2"
                placeholder="Enter your email"
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#2C1810]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C1810]">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors focus-ring hover-lift animate-fadeIn stagger-3"
                placeholder="Enter your password"
              />
            </div>

            {isSignUp && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>At least 8 characters long</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one lowercase letter</li>
                  <li>At least one number</li>
                </ul>
              </div>
            )}

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2C1810]">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
                  placeholder="Confirm your password"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-[#FF6B6B] hover:text-[#FF8787] font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full px-8 py-4 bg-[#FF6B6B] text-white rounded-xl font-medium hover:bg-[#FF8787] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 animate-fadeIn stagger-4 ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover-scale animate-pulse'
              }`}
            >
              {loading ? (
                <span className="loading-dots">Please wait</span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>

            <p className="mt-6 text-center text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                  setFormData({
                    fullName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    phoneNumber: '',
                  });
                }}
                className="ml-2 text-[#FF6B6B] hover:text-[#FF8787] font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
} 