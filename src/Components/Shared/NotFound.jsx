import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12">
      <h1 className="text-9xl font-extrabold text-purple-600 tracking-widest">
        404
      </h1>
      <div className="bg-purple-100 px-3 py-1 text-sm rounded rotate-12 absolute">
        Page Not Found
      </div>
      <p className="mt-6 text-xl text-gray-600">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition duration-300"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
