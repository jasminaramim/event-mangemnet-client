"use client";

import React, { useState, useEffect, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import auth from '../Firebase/firebase.init';
import { AuthContexts } from '../Providers/AuthProvider';
import axios from 'axios';

const Login = () => {
  const { signInWithGoogle, setLoading } = useContext(AuthContexts);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();
const from = location?.state?.from?.pathname || '/';
  // Load saved email if available
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLocalLoading(true);
    setLoading(true);

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err.message);
      if (err.message.includes('auth/invalid-credential')) {
        setErrorMessage('Password is incorrect');
        toast.error('Password is incorrect');
      } else {
        setErrorMessage('Login failed. Please check your credentials.');
        toast.error('Login failed');
      }
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };


  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
      toast.success('Login Successful');
    } catch (err) {
      console.log(err);
      toast.error(err?.message);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background shapes - Changed to red/orange gradients */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-r from-red-700 to-orange-800 rounded-bl-full opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-2/3 h-1/3 bg-gradient-to-r from-red-400 to-orange-700 rounded-tr-full opacity-80"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-r from-red-900 to-red-600 rounded-tl-full opacity-70"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-6 py-10 sm:px-10"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8 relative">
          {/* Back to Home Icon - Changed to red/orange gradient */}
          <div className="absolute top-7 left-3 py-2 px-3 bg-gradient-to-r from-red-800 to-red-600 hover:bg-red-700 rounded-md">
            <Link to="/" className="flex items-center gap-1 text-white">
              <ArrowLeft size={30} />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          <form onSubmit={handleEmailPasswordLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition" // Focus ring changed
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="pl-10 w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition" // Focus ring changed
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded" // Checkbox color changed
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-red-800 hover:text-red-600 hover:underline transition-colors font-medium" // Text color changed
                onClick={() => toast.info('Forgot Password feature coming soon!')}
              >
                Forgot password?
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <motion.button
              type="submit"
              className="w-full py-3 px-4 flex justify-center items-center rounded-full text-white font-semibold text-lg transition duration-300 bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 disabled:opacity-70 disabled:cursor-not-allowed" // Button gradient changed
              disabled={localLoading}
              whileHover={{ scale: localLoading ? 1 : 1.02 }}
              whileTap={{ scale: localLoading ? 1 : 0.98 }}
            >
              {localLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing In...
                </>
              ) : (
                'SIGN IN'
              )}
            </motion.button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-70"
                disabled={localLoading}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Log in with Google
              </button>
              <button
                disabled
                className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 opacity-50 cursor-not-allowed"
              >
                <FaGithub className="w-5 h-5 mr-2" />
                Log in with GitHub
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-red-600 hover:text-red-800 font-medium"> {/* Link color changed */}
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;