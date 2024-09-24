"use client";

import React from "react";
import { Home, Search } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-5xl font-bold text-center text-orange-500 mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-center text-gray-700 mb-6">
            It looks like you have wandered into an unexpected part of our
            exchange program! The page youre looking for doesnt exist or may
            have moved.
          </p>
          <p className="text-md text-center text-gray-600 mb-8">
            Dont worry, your perfect exchange opportunity is still out there.
            Lets get you back on track!
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300"
            >
              <Home className="mr-2" size={18} />
              Home
            </button>
            <button
              onClick={() => (window.location.href = "/listings")}
              className="flex items-center px-4 py-2 border border-orange-500 text-orange-500 font-medium rounded-lg hover:bg-orange-50 transition-colors duration-300"
            >
              <Search className="mr-2" size={18} />
              Browse listings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
