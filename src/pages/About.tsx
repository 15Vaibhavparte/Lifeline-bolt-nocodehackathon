import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  Shield, 
  Zap, 
  Globe, 
  Award,
  Target,
  Eye,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Advanced algorithms match donors with recipients in under 30 seconds based on location, blood type, and availability.',
    },
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable donation records and donor verification through blockchain technology ensure trust and transparency.',
    },
    {
      icon: Globe,
      title: 'Voice Accessibility',
      description: 'Multilingual voice interface makes the platform accessible to users with varying literacy levels.',
    },
    {
      icon: Heart,
      title: 'Emergency Priority',
      description: 'Critical blood requests are prioritized with instant notifications to nearby compatible donors.',
    },
  ];

  const team = [
    {
      name: 'Dr. Priya Sharma',
      role: 'Chief Medical Officer',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: '15+ years in emergency medicine and blood transfusion services.',
    },
    {
      name: 'Rahul Kumar',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Former Google engineer specializing in healthcare AI and blockchain.',
    },
    {
      name: 'Anjali Patel',
      role: 'Head of Operations',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Healthcare operations expert with 12+ years at leading hospitals.',
    },
    {
      name: 'Vikram Singh',
      role: 'Community Outreach Director',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'NGO veteran focused on healthcare accessibility in rural areas.',
    },
  ];

  const milestones = [
    { year: '2023', title: 'Platform Launch', description: 'Lifeline goes live in Mumbai with 1,000 registered donors' },
    { year: '2023', title: 'First Life Saved', description: 'Emergency blood request successfully fulfilled within 20 minutes' },
    { year: '2024', title: 'Multi-City Expansion', description: 'Platform expands to Delhi, Bangalore, and Chennai' },
    { year: '2024', title: 'Blockchain Integration', description: 'Implemented secure donor verification and donation tracking' },
    { year: '2024', title: '10,000 Donors', description: 'Reached milestone of 10,000+ verified blood donors' },
    { year: '2025', title: 'AI Enhancement', description: 'Advanced AI matching reduces response time to under 30 seconds' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To eliminate blood shortage emergencies by connecting donors with recipients through intelligent technology.',
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'A world where no life is lost due to blood unavailability, powered by community and technology.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously advancing healthcare technology to make blood donation more efficient and accessible.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About Lifeline
            </h1>
            <p className="text-xl lg:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to save lives by revolutionizing blood donation through 
              AI-powered matching, blockchain security, and community-driven innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driven by the belief that technology can solve humanity's greatest challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-soft text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-6">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We're Different</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology meets compassionate care to create the world's most 
              efficient blood donation platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-6 p-8 bg-gray-50 rounded-2xl"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Healthcare professionals, technologists, and community advocates united 
              by a shared mission to save lives
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-soft text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-red-600 font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From concept to life-saving platform - the milestones that shaped Lifeline
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-soft">
                      <div className="text-red-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-white shadow-medium"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-red-100 max-w-3xl mx-auto">
              Real numbers, real lives saved through the power of community and technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '2,500+', label: 'Lives Saved', icon: Heart },
              { number: '15,000+', label: 'Active Donors', icon: Users },
              { number: '50+', label: 'Partner Hospitals', icon: Shield },
              { number: '< 30 min', label: 'Avg Response Time', icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-2xl mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-red-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Whether you're a donor, recipient, healthcare provider, or simply someone who 
              believes in saving lives - there's a place for you in the Lifeline community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-medium">
                Become a Donor
              </button>
              <button className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-semibold transition-colors">
                Partner with Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}