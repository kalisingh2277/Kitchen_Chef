import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % foodImages.length);
      setCurrentQuoteIndex((prev) => (prev + 1) % foodQuotes.length);
    }, 5000);

    return () => clearInterval(imageInterval);
  }, []);

  const [formData, setFormData] = useState<AuthFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

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

        // Validate password during sign up
        const validation = validatePassword(formData.password);
        if (!validation.isValid) {
          throw new Error(validation.error);
        }
        
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const message = await signUp(formData.email, formData.password, formData.fullName);
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
        await signIn(formData.email, formData.password);
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
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

      {/* Right Panel - Sign In/Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FFF5F5]">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2C1810] mb-2">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600">
              {isSignUp
                ? 'Join our community of food lovers'
                : 'Sign in to access your recipes'}
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
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
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
                className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-[#2C1810]">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2C1810]">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-colors pr-12"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-[#2C1810] mb-2">Password Requirements:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center space-x-2 ${
                      formData.password.length >= 8 ? 'text-green-600' : ''
                    }`}>
                      <span>{formData.password.length >= 8 ? '✓' : '•'}</span>
                      <span>At least 8 characters long</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${
                      /[A-Z]/.test(formData.password) ? 'text-green-600' : ''
                    }`}>
                      <span>{/[A-Z]/.test(formData.password) ? '✓' : '•'}</span>
                      <span>At least one uppercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${
                      /[a-z]/.test(formData.password) ? 'text-green-600' : ''
                    }`}>
                      <span>{/[a-z]/.test(formData.password) ? '✓' : '•'}</span>
                      <span>At least one lowercase letter</span>
                    </li>
                    <li className={`flex items-center space-x-2 ${
                      /[0-9]/.test(formData.password) ? 'text-green-600' : ''
                    }`}>
                      <span>{/[0-9]/.test(formData.password) ? '✓' : '•'}</span>
                      <span>At least one number</span>
                    </li>
                  </ul>
                </div>
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