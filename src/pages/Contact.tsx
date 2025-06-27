import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  Heart,
  MessageCircle,
  Headphones,
  Building,
  Users,
  AlertTriangle
} from 'lucide-react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    urgent: false,
  });

  const contactMethods = [
    {
      icon: Phone,
      title: 'Emergency Hotline',
      description: '24/7 emergency blood requests',
      contact: '108',
      subtext: 'For immediate medical emergencies',
      color: 'bg-red-100 text-red-600',
      urgent: true,
    },
    {
      icon: Phone,
      title: 'Lifeline Support',
      description: 'General inquiries and support',
      contact: '+91 1800-LIFELINE',
      subtext: 'Available 24/7',
      color: 'bg-blue-100 text-blue-600',
      urgent: false,
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Non-urgent questions and feedback',
      contact: 'help@lifeline.org',
      subtext: 'Response within 24 hours',
      color: 'bg-green-100 text-green-600',
      urgent: false,
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Instant support via chat',
      contact: 'Start Chat',
      subtext: 'Available 9 AM - 9 PM',
      color: 'bg-purple-100 text-purple-600',
      urgent: false,
    },
  ];

  const offices = [
    {
      city: 'Mumbai',
      address: '123 Healthcare Plaza, Bandra West, Mumbai 400050',
      phone: '+91 22 1234 5678',
      email: 'mumbai@lifeline.org',
      hours: 'Mon-Fri: 9 AM - 6 PM',
    },
    {
      city: 'Delhi',
      address: '456 Medical Center, Connaught Place, New Delhi 110001',
      phone: '+91 11 2345 6789',
      email: 'delhi@lifeline.org',
      hours: 'Mon-Fri: 9 AM - 6 PM',
    },
    {
      city: 'Bangalore',
      address: '789 Tech Park, Electronic City, Bangalore 560100',
      phone: '+91 80 3456 7890',
      email: 'bangalore@lifeline.org',
      hours: 'Mon-Fri: 9 AM - 6 PM',
    },
  ];

  const categories = [
    'General Inquiry',
    'Technical Support',
    'Donor Registration',
    'Blood Request',
    'Partnership',
    'Feedback',
    'Complaint',
    'Media Inquiry',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Handle form submission
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help 24/7. Reach out for support, partnerships, or emergency assistance.
          </p>
        </motion.div>

        {/* Emergency Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">Medical Emergency?</h3>
              <p className="text-red-700">
                For immediate blood requirements or medical emergencies, call{' '}
                <a href="tel:108" className="font-bold underline">108</a> or use our{' '}
                <a href="/emergency" className="font-bold underline">Emergency Request</a> feature.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {contactMethods.map((method, index) => (
            <div
              key={method.title}
              className={`bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow ${
                method.urgent ? 'ring-2 ring-red-200' : ''
              }`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${method.color}`}>
                <method.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{method.description}</p>
              <div className="font-semibold text-gray-900 mb-1">
                {method.title === 'Live Chat' ? (
                  <button className="text-purple-600 hover:text-purple-700 transition-colors">
                    {method.contact}
                  </button>
                ) : method.title === 'Email Support' ? (
                  <a href={`mailto:${method.contact}`} className="text-green-600 hover:text-green-700 transition-colors">
                    {method.contact}
                  </a>
                ) : (
                  <a href={`tel:${method.contact}`} className="text-blue-600 hover:text-blue-700 transition-colors">
                    {method.contact}
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-500">{method.subtext}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-soft p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Send className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="urgent"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="urgent" className="text-sm text-gray-700">
                  This is an urgent matter requiring immediate attention
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-medium flex items-center justify-center space-x-2"
              >
                <Send className="h-5 w-5" />
                <span>Send Message</span>
              </button>
            </form>
          </motion.div>

          {/* Office Locations & Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {/* Office Locations */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Building className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Offices</h2>
              </div>

              <div className="space-y-6">
                {offices.map((office, index) => (
                  <div key={office.city} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{office.city}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                        <span>{office.address}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <a href={`tel:${office.phone}`} className="hover:text-red-600 transition-colors">
                          {office.phone}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <a href={`mailto:${office.email}`} className="hover:text-red-600 transition-colors">
                          {office.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{office.hours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white rounded-xl shadow-soft p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Headphones className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Quick Help</h2>
              </div>

              <div className="space-y-4">
                <a
                  href="#"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">How to become a donor?</h4>
                  <p className="text-sm text-gray-600 mt-1">Step-by-step guide to registration</p>
                </a>
                <a
                  href="#"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Blood donation eligibility</h4>
                  <p className="text-sm text-gray-600 mt-1">Check if you can donate blood</p>
                </a>
                <a
                  href="#"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Emergency procedures</h4>
                  <p className="text-sm text-gray-600 mt-1">What to do in blood emergencies</p>
                </a>
                <a
                  href="#"
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <h4 className="font-medium text-gray-900">Partnership opportunities</h4>
                  <p className="text-sm text-gray-600 mt-1">Collaborate with Lifeline</p>
                </a>
              </div>
            </div>

            {/* Community Stats */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-white">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold">Join Our Community</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">15,000+</div>
                  <div className="text-red-100 text-sm">Active Donors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2,500+</div>
                  <div className="text-red-100 text-sm">Lives Saved</div>
                </div>
              </div>
              
              <p className="text-red-100 text-sm">
                Be part of a community that's making a real difference in saving lives across India.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}