import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Edit, 
  Save, 
  X, 
  Heart, 
  Shield, 
  Award,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Droplets,
  Clock,
  Settings,
  Bell,
  Lock,
  Eye,
  Download,
  Wallet
} from 'lucide-react';
import LazyComponent from '../components/LazyComponent';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91 98765 43210',
    bloodType: 'O+',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    address: '123 Main Street, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    weight: '70',
    lastDonation: '2023-11-15',
    medicalConditions: 'None',
    emergencyContact: '+91 87654 32109',
    availability: true,
    notifications: {
      email: true,
      sms: true,
      push: true,
      emergency: true,
    },
  });

  const donationHistory = [
    { 
      id: '1',
      donor_id: 'donor_123',
      date: '2023-11-15', 
      location: 'Apollo Hospital', 
      blood_type: 'O+',
      units_donated: 1,
      status: 'completed',
      donation_date: '2023-11-15',
      blockchain_hash: 'ALGO_TX_ABC123DEF456',
      verified_by: 'dr_smith_123'
    },
    { 
      id: '2',
      donor_id: 'donor_123',
      date: '2023-08-10', 
      location: 'Red Cross Center', 
      blood_type: 'O+',
      units_donated: 1,
      status: 'completed',
      donation_date: '2023-08-10',
      verified_by: 'dr_jones_456'
    },
    { 
      id: '3',
      donor_id: 'donor_123',
      date: '2023-05-20', 
      location: 'City Hospital', 
      blood_type: 'O+',
      units_donated: 1,
      status: 'completed',
      donation_date: '2023-05-20',
      blockchain_hash: 'ALGO_TX_XYZ789GHI012',
      verified_by: 'dr_brown_789'
    },
    { 
      id: '4',
      donor_id: 'donor_123',
      date: '2023-02-14', 
      location: 'Community Drive', 
      blood_type: 'O+',
      units_donated: 1,
      status: 'completed',
      donation_date: '2023-02-14'
    },
  ];

  const achievements = [
    { title: 'Life Saver', description: '10+ donations completed', icon: Heart, earned: true },
    { title: 'Hero', description: '25+ donations completed', icon: Award, earned: false },
    { title: 'Guardian Angel', description: '50+ donations completed', icon: Shield, earned: false },
    { title: 'Regular Donor', description: 'Donated 4 times in a year', icon: Calendar, earned: true },
    { title: 'Blockchain Pioneer', description: 'First donation on blockchain', icon: Wallet, earned: true },
  ];

  const stats = [
    { label: 'Total Donations', value: '12', icon: Heart, color: 'text-red-600 bg-red-100' },
    { label: 'Lives Saved', value: '36', icon: User, color: 'text-blue-600 bg-blue-100' },
    { label: 'Donation Points', value: '2,400', icon: Award, color: 'text-yellow-600 bg-yellow-100' },
    { label: 'Blockchain Records', value: '2', icon: Wallet, color: 'text-purple-600 bg-purple-100' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('notifications.')) {
      const notificationKey = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checked,
        },
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data
    console.log('Profile saved:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const handleRecordToBlockchain = (donationId: string) => {
    console.log('Recording donation to blockchain:', donationId);
    // In a real app, this would update the donation record with blockchain hash
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-red-100 mt-1">Blood Type: {profileData.bloodType}</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm">Verified Donor</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm">{donationHistory.length} Donations</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Wallet className="h-4 w-4" />
                  <span className="text-sm">Blockchain Enabled</span>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 p-3 rounded-lg transition-colors"
          >
            {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            {isEditing && (
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={profileData.bloodType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <p className="text-gray-900 font-semibold text-red-600">{profileData.bloodType}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
              {isEditing ? (
                <input
                  type="number"
                  name="weight"
                  value={profileData.weight}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{profileData.weight} kg</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            {isEditing ? (
              <textarea
                name="address"
                value={`${profileData.address}, ${profileData.city}, ${profileData.state} ${profileData.pincode}`}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">
                {profileData.address}, {profileData.city}, {profileData.state} {profileData.pincode}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  achievement.earned
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.earned ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <achievement.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-yellow-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-yellow-700' : 'text-gray-400'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistoryTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Donation History</h3>
            <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {donationHistory.map((donation) => (
              <LazyComponent 
                key={donation.id}
                importComponent={() => import('../components/BlockchainDonationRecord').then(m => m.BlockchainDonationRecord)}
                donation={donation}
                onRecordToBlockchain={handleRecordToBlockchain}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderWalletTab = () => (
    <div className="space-y-6">
      <LazyComponent 
        importComponent={() => import('../components/AlgorandWallet').then(m => m.AlgorandWallet)}
      />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-2">Blockchain Benefits</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Immutable donation records that can never be altered</li>
          <li>• Transparent verification of your donation history</li>
          <li>• NFT certificates for each verified donation</li>
          <li>• Enhanced trust and credibility in the donation ecosystem</li>
          <li>• Potential for future token rewards and incentives</li>
        </ul>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Email Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <input
              type="checkbox"
              name="notifications.email"
              checked={profileData.notifications.email}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">SMS Notifications</h4>
              <p className="text-sm text-gray-600">Receive updates via SMS</p>
            </div>
            <input
              type="checkbox"
              name="notifications.sms"
              checked={profileData.notifications.sms}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Push Notifications</h4>
              <p className="text-sm text-gray-600">Receive app notifications</p>
            </div>
            <input
              type="checkbox"
              name="notifications.push"
              checked={profileData.notifications.push}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Emergency Alerts</h4>
              <p className="text-sm text-gray-600">Critical blood request notifications</p>
            </div>
            <input
              type="checkbox"
              name="notifications.emergency"
              checked={profileData.notifications.emergency}
              onChange={handleInputChange}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-soft">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
        </div>
        <div className="p-6 space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Eye className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                <p className="text-sm text-gray-600">Control who can see your information</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
          
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="h-5 w-5 text-gray-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Download Data</h4>
                <p className="text-sm text-gray-600">Export your account data</p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account, donations, and blockchain wallet</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'profile'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-4 w-4 inline mr-2" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'history'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Clock className="h-4 w-4 inline mr-2" />
                History
              </button>
              <button
                onClick={() => setActiveTab('wallet')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'wallet'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Wallet className="h-4 w-4 inline mr-2" />
                Blockchain
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'history' && renderHistoryTab()}
          {activeTab === 'wallet' && renderWalletTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </motion.div>
      </div>
    </div>
  );
}
// Default export for lazy loading
export default Profile;
