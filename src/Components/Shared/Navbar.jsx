"use client";

import React, { useContext, useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  CalendarDays,
  PlusCircle,
  ClipboardList,
  UsersRound,
  LogOut,
  Settings, // Added for potential profile settings link
  User // Added for profile icon
} from "lucide-react";
import { AuthContexts } from "../../Providers/AuthProvider";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContexts);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown itself
  const avatarRef = useRef(null); // Ref for the avatar to measure its position

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if click is outside the dropdown and outside the avatar
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          avatarRef.current && !avatarRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    // Close menus when navigating to a new page
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!authContext) {
    return (
      <div className="text-center py-4 bg-red-100 text-red-700">
        Error: Authentication context not found
      </div>
    );
  }

  const { user, logOut } = authContext;

  const handleLogout = async () => {
    try {
      setDropdownOpen(false); // Close dropdown immediately on logout click
      await logOut();
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-white bg-gradient-to-r from-red-500 to-pink-500 shadow-md"
        : "text-gray-600 hover:text-red-600 hover:bg-red-100"
    }`;

  const mainRoutes = (
    <>
      <NavLink to="/" className={navLinkClass}>
        <Home size={16} />
        Home
      </NavLink>
      <NavLink to="/events" className={navLinkClass}>
        <CalendarDays size={16} />
        All Events
      </NavLink>
      {user && ( // These links will also be in the dropdown for mobile/logged-in users
        <>
          <NavLink to="/add-event" className={navLinkClass}>
            <PlusCircle size={16} />
            Add Event
          </NavLink>
          <NavLink to="/my-events" className={navLinkClass}>
            <ClipboardList size={16} />
            My Events
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="https://i.ibb.co/PZ5wgCXR/logoevent.png"
              alt="Eventify"
              className="h-16 w-16"
              whileHover={{ scale: 1.1, rotate: 15 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-pink-500 text-transparent bg-clip-text">
              Eventify
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-3">{mainRoutes}</div>

          {/* Auth or Dropdown */}
          <div className="hidden md:flex items-center relative"> {/* Made this div relative */}
            {user ? (
              <>
                <motion.img
                  ref={avatarRef} 
                  src={user.photoURL || "https://via.placeholder.com/40?text=U"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-pink-400 cursor-pointer object-cover" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                />
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      ref={dropdownRef} 
                      initial={{ opacity: 0, y: -10, scale: 0.95 }} 
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }} 
                      // Positioning the dropdown
                      className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-xl border border-gray-200 z-50 origin-top-right overflow-hidden" 
                    >
                      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <p className="font-semibold text-gray-800 truncate">
                          {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex flex-col py-2">
                        {/* Example: Profile Settings Link */}
                       
                        {/* Duplicated for consistency with mobile menu / main routes */}
                        <Link to="/add-event" className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                           <PlusCircle size={16} />
                           Add Event
                        </Link>
                        <Link to="/my-events" className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                           <ClipboardList size={16} />
                           My Events
                        </Link>
                        <Link to="/events" className="px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200">
                           <CalendarDays size={16} /> 
                           All Events
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-5 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md hover:shadow-lg transition-all duration-300 text-sm font-semibold hover:scale-105 active:scale-95" // Enhanced hover/active effects
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-red-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg pb-4" // Added pb-4, shadow-lg
          >
            <div className="px-4 py-4 space-y-2">
                {/* Mobile version of main routes */}
                <NavLink to="/" className={navLinkClass}>
                    <Home size={16} />
                    Home
                </NavLink>
                <NavLink to="/events" className={navLinkClass}>
                    <CalendarDays size={16} />
                    All Events
                </NavLink>
                {user && (
                    <>
                        <NavLink to="/add-event" className={navLinkClass}>
                            <PlusCircle size={16} />
                            Add Event
                        </NavLink>
                        <NavLink to="/my-events" className={navLinkClass}>
                            <ClipboardList size={16} />
                            My Events
                        </NavLink>
                    </>
                )}
            </div>
            {user && (
              <div className="border-t border-gray-100 mt-2 pt-4 px-4 space-y-2"> {/* Added border-gray-100 */}
                <div className="flex items-center gap-3 pb-3"> {/* Added padding bottom */}
                    <img
                        src={user.photoURL || "https://via.placeholder.com/32?text=U"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border border-pink-300"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-800 truncate">
                            {user.displayName || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                </div>
                {/* Specific links for logged-in user in mobile menu */}
               
                <button
                  onClick={handleLogout}
                  className="block py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
            {!user && (
              <div className="border-t border-gray-100 mt-2 pt-4 px-4">
                <Link
                  to="/login"
                  className="block w-full text-center py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-md text-sm font-semibold mt-2 hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
