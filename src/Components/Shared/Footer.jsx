import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
} from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-[#2c0a0a] to-[#3c1616] text-gray-200 py-14 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Column 1: Brand */}
        <div>
          <div className="flex items-center mb-5">
            <img
              src="https://i.ibb.co/PZ5wgCXR/logoevent.png"
              alt="Eventify Logo"
              className="h-[60px] mr-3"
              onError={(e) => {
                e.target.src = '/placeholder-logo.png';
              }}
            />
            <span className="text-2xl font-bold text-white">Eventify</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-300">
            Whether you're hosting a single or multi-day event, Eventify is your
            one-stop solution. Join and explore exciting experiences!
          </p>
          <div className="mt-6">
            <p className="font-semibold text-white mb-2">DOWNLOAD APP</p>
            <div className="flex gap-3">
              <a href="#" className="inline-block">
                <img
                  src="/app-store-badge.png"
                  alt="App Store"
                  className="h-10"
                />
              </a>
              <a href="#" className="inline-block">
                <img
                  src="/google-play-badge.png"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Column 2: Social + Events Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">FOLLOW US</h4>
          <div className="flex gap-3 mb-6">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#d62828] hover:bg-red-700 transition"
            >
              <FaFacebookF className="text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1DA1F2] hover:bg-blue-700 transition"
            >
              <FaTwitter className="text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0077B5] hover:bg-blue-900 transition"
            >
              <FaLinkedinIn className="text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-[#C13584] hover:bg-pink-600 transition"
            >
              <FaInstagram className="text-white" />
            </a>
          </div>

          <h4 className="text-lg font-semibold text-white mb-4">EVENTS INFO</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-red-400 transition">All Events</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Featured Events</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Upcoming Events</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Past Events</a></li>
          </ul>
        </div>

        {/* Column 3: Useful Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">USEFUL LINKS</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-red-400 transition">Home</a></li>
            <li><a href="#" className="hover:text-red-400 transition">About Us</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Services</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Team</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Contact</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Blog</a></li>
          </ul>
        </div>

        {/* Column 4: Subscribe + Help */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">SUBSCRIBE</h4>
          <form className="flex items-center bg-[#511818] rounded-lg overflow-hidden mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="p-3 bg-red-600 hover:bg-red-700 transition"
            >
              <FaEnvelope className="text-white" />
            </button>
          </form>

          <h4 className="text-lg font-semibold text-white mb-4">NEED HELP?</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><a href="#" className="hover:text-red-400 transition">FAQs</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-red-400 transition">Support</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-600 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Eventify. All rights reserved.</p>
        <p className="mt-2">
          Designed by{' '}
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:underline"
          >
            Jasmin
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
