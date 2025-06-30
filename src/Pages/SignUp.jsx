"use client";

import React, { useState, useContext } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom'; // Ensure Link is imported from react-router-dom
import { toast } from 'react-toastify'; // Ensure Toaster is imported and used where needed, or integrate with toast-hot-toast if preferred
import axios from 'axios';
import { AuthContexts } from '../Providers/AuthProvider';

const SignUp = () => {
  const { createUser, signInWithGoogle, userProfileUpdate, setLoading } = useContext(AuthContexts);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for email/password sign-up
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Basic password validation (example: minimum length)
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long.');
        toast.error('Password too short!');
        setLoading(false);
        return;
      }

      // Create user with Firebase
      const result = await createUser(formData.email, formData.password);
      const firebaseUser = result.user;

      // Update Firebase user profile
      await userProfileUpdate(formData.name, null); // Add photoURL if needed

      // Prepare user data for MongoDB
      const userData = {
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
        role: 'user', // Add role or other fields as needed
      };

      // Save user to MongoDB
      await axios.post('https://event-mangemnet-server-5.onrender.com/users', userData, {
        withCredentials: true,
      });

      toast.success('🎉 Account created successfully!');
      navigate('/'); // Redirect to dashboard or desired route
    } catch (err) {
      console.error("Firebase Sign-Up Error:", err.message); // More specific error logging
      // Enhance user-friendly error messages based on Firebase error codes
      let userFriendlyError = "An unexpected error occurred. Please try again.";
      if (err.message.includes("auth/email-already-in-use")) {
        userFriendlyError = "This email is already in use. Please try logging in or use a different email.";
      } else if (err.message.includes("auth/weak-password")) {
        userFriendlyError = "Password is too weak. Please choose a stronger one.";
      } else if (err.message.includes("auth/invalid-email")) {
        userFriendlyError = "The email address is not valid.";
      }
      setError(userFriendlyError);
      toast.error(`❌ ${userFriendlyError}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google sign-up
  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const firebaseUser = result.user;

      // Prepare user data for MongoDB
      const userData = {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date().toISOString(),
        role: 'user',
      };

      // Save user to MongoDB
      await axios.post('https://event-mangemnet-server-5.onrender.com/users', userData, {
        withCredentials: true,
      });

      toast.success('🎉 Signed up with Google successfully!');
      navigate('/');
    } catch (err) {
      console.error('Google Sign-Up Error:', err.message);
      setError(err.message);
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-inter"> {/* Added font-inter */}
      {/* Toast container from react-toastify, or remove if you use react-hot-toast globally */}
      {/* <ToastContainer position="top-center" /> */}

      {/* Left Column - Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 order-2 md:order-1"> {/* Order change for mobile */}
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100"> {/* Added card styling */}
          <div className="mb-8 text-center"> {/* Centered content for smaller screens */}
            <h1 className="text-3xl font-bold text-gray-800">Create Your Account</h1>
            <p className="text-gray-600 mt-2">Start your journey today</p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col space-y-3 mb-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition hover:scale-105 active:scale-95 duration-300" // Added rounded-full, hover effects
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Sign up with Google
            </button>
            <button
              disabled // GitHub login not implemented
              className="w-full flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 opacity-50 cursor-not-allowed" // Added rounded-full
            >
              <FaGithub className="w-5 h-5 mr-2" />
              Sign up with GitHub
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Form for email/password sign-up */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-none" // Rounded-full, red focus
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-none" // Rounded-full, red focus
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 transition outline-none" // Rounded-full, red focus
                required
              />
            </div>

            {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>} {/* Error message color updated */}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-medium rounded-full shadow-md transition duration-200 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed" // Red gradient, rounded-full, hover effects
              disabled={setLoading} // Changed to `setLoading` directly
            >
              Create Your Free Account
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500"> {/* Increased margin-top */}
            By signing up, you agree to our{' '}
            <a href="#" className="text-red-600 hover:underline font-medium"> {/* Red link */}
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-red-600 hover:underline font-medium"> {/* Red link */}
              Privacy Policy
            </a>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account?</span>{' '}
            <Link to="/login" className="font-medium text-red-600 hover:underline"> {/* Red link */}
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Marketing Section (Eventify Red Theme) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-red-700 to-red-800 text-white p-8 md:p-12 flex items-center justify-center order-1 md:order-2 rounded-b-3xl md:rounded-bl-none md:rounded-tr-3xl shadow-lg"> {/* Red gradient, rounded corners, order change for mobile */}
        <div className="max-w-md text-center md:text-left">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold mb-3 leading-tight">Join Our <span className="text-red-200">Event-Full</span> Community!</h2> {/* Enhanced heading */}
            <p className="text-red-100 text-lg">
              Connect, Create, and Experience Unforgettable Moments with People Worldwide.
            </p>
          </div>

          {/* Benefit List */}
          <ul className="space-y-3 mb-10 text-red-100 text-md list-disc list-inside">
            <li>Discover unique events tailored to your interests.</li>
            <li>Effortlessly create and manage your own events.</li>
            <li>Connect with a vibrant network of event enthusiasts.</li>
            <li>Get inspired by diverse and exciting event ideas.</li>
          </ul>

          {/* Illustration/Graphic placeholder instead of tech logos */}
          <div className="flex justify-center md:justify-start">
            <img 
              src="https://placehold.co/250x150/ef4444/ffffff?text=Eventify+Graphic" 
              alt="Event illustration" 
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
