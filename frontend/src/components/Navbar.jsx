import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const { checkAuth, isCheckingAuth, authUser, logout } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, []);
  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
        {/* Logo/Brand */}
        <div className="flex-shrink-0">
          <button 
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
          >
            ResumeChecker
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8 mx-8">
          <button
            className={`font-medium text-sm transition-colors duration-300 relative group`}
          >
            Home
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-full`}></span>
          </button>
          <button
            className={`font-medium text-sm transition-colors duration-300 relative group text-blue-600`}
          >
            Upload Resume
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-full`}></span>
          </button>
          <button
            className={`font-medium text-sm transition-colors duration-300 relative group text-blue-600`}
          >
            Compare
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-full`}></span>
          </button>
          <button
            className={`font-medium text-sm transition-colors duration-300 relative group text-blue-600`}
          >
            Versions
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 w-full`}></span>
          </button>
        </div>

        {/* User Actions */} 
        <div className="hidden md:flex items-center space-4">
          {authUser ? (
            <div className="relative">
              <button
                onClick={()=>{logout();navigate('/')}}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="px-5 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;