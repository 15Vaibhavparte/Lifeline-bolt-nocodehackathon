import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">Lifeline</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Connecting blood donors with recipients through intelligent matching, 
              real-time alerts, and community-driven blood drive organization.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/donor-dashboard" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Become a Donor
                </Link>
              </li>
              <li>
                <Link to="/recipient-dashboard" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Find Blood
                </Link>
              </li>
              <li>
                <Link to="/blood-drives" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Blood Drives
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-500" />
                <span className="text-gray-300">+91 1800-LIFELINE</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-500" />
                <span className="text-gray-300">help@lifeline.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-500" />
                <span className="text-gray-300">Mumbai, India</span>
              </div>
            </div>
            
            {/* Emergency Contact */}
            <div className="mt-6 p-4 bg-primary-900 rounded-lg">
              <h4 className="font-semibold text-primary-200 mb-2">24/7 Emergency</h4>
              <p className="text-primary-300 text-sm">
                Call <span className="font-bold">108</span> for medical emergencies
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Lifeline. All rights reserved. Saving lives through technology.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
                Accessibility
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
                Sitemap
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 text-sm transition-colors">
                Careers
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}