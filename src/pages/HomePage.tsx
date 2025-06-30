import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BloodTypeCompatibility } from '../components/BloodTypeCompatibility';
import { ScrollDrivenImageSequence } from '../components/ScrollDrivenImageSequence';
import { sequenceConfigs } from '../utils/imageSequences';
import { 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  Smartphone, 
  Globe, 
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

      {/* Features Section - Scroll Driven Image Sequences */}
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
              Experience the technology that makes life-saving blood donation faster, 
              safer, and more accessible than ever before.
            </p>
          </motion.div>

          {/* Scroll-driven sequences grid */}
          <div className="space-y-20">
            {Object.entries(sequenceConfigs).map(([key, config], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
              >
                {/* Content side */}
                <div className="flex-1 space-y-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config.color} mb-4`}>
                    {key === 'aiMatching' && <Zap className="h-8 w-8" />}
                    {key === 'blockchainVerification' && <Shield className="h-8 w-8" />}
                    {key === 'voiceInterface' && <Smartphone className="h-8 w-8" />}
                    {key === 'emergencyResponse' && <Globe className="h-8 w-8" />}
                  </div>
                  
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      {config.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Feature highlights */}
                  <div className="space-y-3">
                    {key === 'aiMatching' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">Match donors in under 30 seconds</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">99.8% compatibility accuracy</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-700">Smart location-based prioritization</span>
                        </div>
                      </>
                    )}
                    {key === 'blockchainVerification' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">Immutable donation records</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">Verified donor authenticity</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700">Transparent trust system</span>
                        </div>
                      </>
                    )}
                    {key === 'voiceInterface' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Multi-language support</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Accessibility for all users</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700">Hands-free emergency requests</span>
                        </div>
                      </>
                    )}
                    {key === 'emergencyResponse' && (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">Instant alert dispatch</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">Real-time response tracking</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-700">24/7 emergency support</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Sequence side */}
                <div className="flex-1">
                  <ScrollDrivenImageSequence
                    images={config.frames}
                    frameHeight={config.frameHeight}
                    containerClassName="shadow-2xl"
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Additional features showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-20 bg-white rounded-3xl p-8 shadow-soft"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Advanced Technology Stack
              </h3>
              <p className="text-gray-600">
                Built with cutting-edge technologies for maximum reliability and performance
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">Real-time Sync</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">HIPAA Compliant</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">AI Powered</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <p className="font-medium text-gray-900">Global Network</p>
              </div>
            </div>
          </motion.div>
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

// Default export for lazy loading
export default HomePage;
