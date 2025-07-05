import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onNavigate, currentView = 'home' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavigation = (view) => {
    onNavigate(view);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleNavigation('home');
  };

  const isActive = (view) => currentView === view;

  const getUserInitials = (user) => {
    if (!user) return '';
    const { firstName, lastName } = user;
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
        {/* Logo/Brand */}
        <div className="flex-shrink-0">
          <button 
            onClick={() => handleNavigation('home')}
            className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
          >
            ResumeChecker
          </button>
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-8 mx-8">
          <button
            onClick={() => handleNavigation('home')}
            className={`font-medium text-sm transition-colors duration-300 relative group ${
              isActive('home') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Home
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              isActive('home') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </button>
          <button
            onClick={() => handleNavigation('upload')}
            className={`font-medium text-sm transition-colors duration-300 relative group ${
              isActive('upload') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Upload Resume
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              isActive('upload') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </button>
          <button
            onClick={() => handleNavigation('compare')}
            className={`font-medium text-sm transition-colors duration-300 relative group ${
              isActive('compare') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Compare
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              isActive('compare') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </button>
          <button
            onClick={() => handleNavigation('versions')}
            className={`font-medium text-sm transition-colors duration-300 relative group ${
              isActive('versions') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Versions
            <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${
              isActive('versions') ? 'w-full' : 'w-0 group-hover:w-full'
            }`}></span>
          </button>
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center space-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getUserInitials(user)}
                </div>
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleNavigation('profile');
                      setIsUserMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => handleNavigation('auth')}
                className="px-5 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavigation('auth')}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-600/30"
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex flex-col cursor-pointer p-2" onClick={toggleMenu}>
          <span className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-all duration-300 rounded ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-all duration-300 rounded ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 rounded ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white border-t border-gray-200 shadow-lg ${isMenuOpen ? 'block animate-slideDown' : 'hidden'}`}>
        <div className="px-8 py-4 space-y-4">
          <button
            onClick={() => handleNavigation('home')}
            className={`block w-full text-left font-medium py-3 border-b border-gray-100 transition-colors duration-300 ${
              isActive('home') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavigation('upload')}
            className={`block w-full text-left font-medium py-3 border-b border-gray-100 transition-colors duration-300 ${
              isActive('upload') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => handleNavigation('compare')}
            className={`block w-full text-left font-medium py-3 border-b border-gray-100 transition-colors duration-300 ${
              isActive('compare') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Compare
          </button>
          <button
            onClick={() => handleNavigation('versions')}
            className={`block w-full text-left font-medium py-3 border-b border-gray-100 transition-colors duration-300 ${
              isActive('versions') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Versions
          </button>
          
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleNavigation('profile');
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-5 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Profile Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-all duration-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('auth')}
                  className="w-full px-5 py-2 text-gray-700 bg-transparent border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavigation('auth')}
                  className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-all duration-300"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
