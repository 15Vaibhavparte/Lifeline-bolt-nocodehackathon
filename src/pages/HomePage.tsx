import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BloodTypeCompatibility } from '../components/BloodTypeCompatibility';
import { 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  Smartphone, 
  Globe, 
  Award,
  ArrowRight,
  Phone,
  MapPin,
  Activity,
  Zap
} from 'lucide-react';
import bloodDropVideo from '../assets/videos/Blood_Drop_Video_Generation_Request.mp4';

export function HomePage() {
  const stats = [
    { label: 'Lives Saved', value: '2,500+', icon: Heart },
    { label: 'Active Donors', value: '15,000+', icon: Users },
    { label: 'Avg Response Time', value: '< 30 min', icon: Clock },
    { label: 'Cities Covered', value: '50+', icon: MapPin },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Matching',
      description: 'AI-powered donor-recipient matching in under 30 seconds',
      color: 'text-yellow-600 bg-yellow-100',
    },
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Tamper-proof donation history and donor verification',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Smartphone,
      title: 'Voice Accessible',
      description: 'Multilingual voice interface for inclusive access',
      color: 'text-green-600 bg-green-100',
    },
    {
      icon: Globe,
      title: 'Real-time Alerts',
      description: 'Instant notifications for emergency blood requests',
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={bloodDropVideo} type="video/mp4" />
          </video>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Gradient overlay for additional styling */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/70 via-primary-700/60 to-primary-800/70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Save Lives with
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Smart Blood
                  </span>
                  Matching
                </h1>
                <p className="text-xl lg:text-2xl text-primary-100 leading-relaxed">
                  Connect blood donors with recipients instantly through AI-powered matching, 
                  blockchain verification, and real-time emergency alerts.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/emergency"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-strong animate-pulse-slow"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Emergency Request
                </Link>
                <Link
                  to="/donor-dashboard"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Become a Donor
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-primary-200">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>24/7 Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-transparent backdrop-blur-sm rounded-4xl p-8 shadow-strong">
                <BloodTypeCompatibility />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all duration-200">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Lifeline?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets compassionate care to create the most efficient 
              blood donation platform in the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-200 group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-6 ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              Ready to Save Lives?
            </h2>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              Join thousands of donors and recipients who trust Lifeline for emergency blood matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-primary-600 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}