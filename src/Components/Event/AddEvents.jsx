"use client";

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AuthContexts } from '../../Providers/AuthProvider';
import axios from 'axios';

const AddEvents = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContexts);

  if (!authContext) {
    console.error('AuthContexts is null. Ensure AddEvents is wrapped in AuthProvider.');
    return <div className="text-center py-4 text-red-600">Error: Authentication context not found</div>;
  }

  const { user } = authContext;

  if (!user) {
    return (
      <div className="text-center py-10 text-red-600">
        Please <a href="/login" className="underline text-blue-600 hover:text-blue-800">log in</a> to add an event.
      </div>
    );
  }

  const [formData, setFormData] = useState({
    title: '',
    name: user.displayName || '',
    dateTime: '',
    location: '',
    image: '', // ✅ new field for image
    description: '',
    maxAttendees: 0,
    creatorEmail: user.email,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxAttendees' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/events", formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success('Event created successfully!');
        setFormData({
          title: '',
          name: user.displayName || '',
          dateTime: '',
          location: '',
          image: '',
          description: '',
          maxAttendees: 0,
          creatorEmail: user.email,
        });
        setTimeout(() => navigate('/'), 1000);
      } else {
        toast.error('Failed to add event');
      }
    } catch (err) {
      console.error('Error adding event:', err);
      toast.error(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full mx-auto bg-white p-8 rounded-3xl shadow-xl border-t-4 border-red-600"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a New Event
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizer Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date and Time
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter event location"
              required
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          {/* ✅ Image Link Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          {/* ✅ Image Preview */}
          {formData.image && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
              <img
                src={formData.image}
                alt="Event preview"
                className="mx-auto w-48 h-32 object-cover rounded-lg shadow-md border"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition resize-none h-32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Attendees (0 for unlimited)
            </label>
            <input
              type="number"
              name="maxAttendees"
              value={formData.maxAttendees}
              onChange={handleChange}
              placeholder="Enter maximum attendee count"
              min="0"
              className="w-full px-4 py-3 rounded-full border border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 flex justify-center items-center rounded-full text-white font-semibold text-lg transition duration-300 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
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
                Creating Event...
              </>
            ) : (
              'Add Event'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddEvents;
