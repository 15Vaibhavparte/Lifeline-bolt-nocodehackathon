import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, Bell, User, Phone, LogOut, Settings, Mic, Brain, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationSystem } from '../NotificationSystem';
import { useAuthContext } from '../../contexts/AuthContext';
import { LanguageSwitcher } from '../LanguageSwitcher';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, profile, signOut } = useAuthContext();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Find Donors', href: '/recipient-dashboard' },
    { name: 'Donate Blood', href: '/donor-dashboard' },
    { name: 'Blood Drives', href: '/blood-drives' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
              <div className="absolute inset-0 bg-primary-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity animate-pulse-slow"></div>
            </div>
            <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
              Lifeline
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 border-b-2 border-primary-600'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* AI Dashboard Link */}
            <Link
              to="/ai-dashboard"
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              title="Dappier AI Dashboard"
            >
              <Brain className="h-5 w-5" />
            </Link>

            {/* Voice Settings Link */}
            <Link
              to="/voice-settings"
              className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              title="Voice & Accessibility Settings"
            >
              <Mic className="h-5 w-5" />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher variant="minimal" className="hidden sm:block" />

            {/* Emergency Button */}
            <Link
              to="/emergency"
              className="hidden sm:flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-medium animate-pulse-slow"
            >
              <Phone className="h-4 w-4" />
              <span>Emergency</span>
            </Link>

            {user ? (
              <>
                {/* Notifications */}
                <NotificationSystem />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {profile?.first_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="hidden sm:inline font-medium">
                      {profile?.first_name || 'User'}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-medium border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          {profile?.role && (
                            <span className="inline-block mt-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full capitalize">
                              {profile.role}
                            </span>
                          )}
                        </div>
                        
                        <Link
                          to="/ai-dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Brain className="h-4 w-4" />
                          <span>AI Dashboard</span>
                        </Link>
                        
                        <Link
                          to="/voice-settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Mic className="h-4 w-4" />
                          <span>Voice Settings</span>
                        </Link>
                        
                        <Link
                          to="/language-settings"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Globe className="h-4 w-4" />
                          <span>Language Settings</span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          to="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>

                        {/* Role-specific links */}
                        {profile?.role === 'donor' && (
                          <Link
                            to="/donor-dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Heart className="h-4 w-4" />
                            <span>Donor Dashboard</span>
                          </Link>
                        )}

                        {profile?.role === 'recipient' && (
                          <Link
                            to="/recipient-dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span>Recipient Dashboard</span>
                          </Link>
                        )}

                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleSignOut}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              /* Auth Buttons for non-logged in users */
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile AI Dashboard Link */}
              <Link
                to="/ai-dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
              >
                🧠 AI Dashboard
              </Link>
              
              {/* Mobile Voice Settings Link */}
              <Link
                to="/voice-settings"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Mic className="h-4 w-4" />
                <span>Voice Settings</span>
              </Link>
              
              {/* Mobile Language Settings Link */}
              <Link
                to="/language-settings"
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Globe className="h-4 w-4" />
                <span>Language Settings</span>
              </Link>
              
              {/* Mobile Emergency Button */}
              <Link
                to="/emergency"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-md font-medium transition-colors mt-4"
              >
                🚨 Emergency Request
              </Link>

              {/* Mobile Auth Buttons */}
              {!user && (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center border border-primary-600 text-primary-600 px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center bg-primary-600 text-white px-3 py-2 rounded-md font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile User Actions */}
              {user && (
                <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
}