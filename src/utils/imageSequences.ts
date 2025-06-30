// Enhanced placeholder image sequence generator with process steps
// In production, replace these with actual JPG frame sequences

export interface SequenceFrame {
  src: string;
  alt?: string;
}

// Generate enhanced placeholder frames for development using SVG data URIs
const generateProcessSequence = (
  steps: string[], 
  baseColor: string = '3B82F6', 
  topic: string = 'Process'
): SequenceFrame[] => {
  return steps.map((step, index) => ({
    src: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23${baseColor}"/><text x="300" y="200" font-size="18" fill="white" text-anchor="middle" dominant-baseline="middle">${encodeURIComponent(step)}</text></svg>`,
    alt: `${topic} step ${index + 1}: ${step}`
  }));
};

// AI Matching Process Steps
const aiMatchingSteps = [
  'Emergency Request',
  'Blood Type Analysis', 
  'Location Mapping',
  'Donor Availability Check',
  'Compatibility Scoring',
  'Distance Calculation',
  'AI Algorithm Processing',
  'Priority Assessment',
  'Medical History Review',
  'Real-time Data Sync',
  'Multiple Matches Found',
  'Ranking Best Options',
  'Notification Preparation',
  'Instant Alert Dispatch',
  'Response Tracking',
  'Live Status Updates',
  'Donor Confirmation',
  'Route Optimization',
  'ETA Calculation',
  'Hospital Coordination',
  'Final Match Selection',
  'Contact Exchange',
  'Success Confirmation',
  'Data Recording',
  'Mission Complete'
];

// Blockchain Verification Steps
const blockchainSteps = [
  'Donor Registration',
  'Identity Verification',
  'Medical Screening',
  'Blockchain Entry',
  'Digital Certificate',
  'Hash Generation',
  'Network Validation',
  'Smart Contract',
  'Donation Record',
  'Immutable Storage',
  'Verification Badge',
  'Trust Score Update',
  'History Logging',
  'Transparency Proof',
  'Audit Trail',
  'Security Confirmed',
  'Permanent Record',
  'NFT Creation',
  'Achievement Unlock',
  'Verified Status'
];

// Voice Interface Steps
const voiceSteps = [
  'Voice Activation',
  'Language Detection',
  'Speech Recognition',
  'Natural Processing',
  'Intent Understanding',
  'Context Analysis',
  'Command Parsing',
  'Action Mapping',
  'Response Generation',
  'Audio Synthesis',
  'Multi-language Support',
  'Accessibility Mode',
  'Emergency Priority',
  'Hands-free Operation',
  'Voice Confirmation'
];

// Emergency Response Steps  
const emergencySteps = [
  'Emergency Alert',
  'Critical Assessment',
  'Location Tracking',
  'Instant Notification',
  'Donor Network Scan',
  'Priority Matching',
  'Multi-channel Alert',
  'SMS Dispatch',
  'Push Notification',
  'Voice Call Trigger',
  'Response Monitoring',
  'Real-time Updates',
  'Status Dashboard',
  'Coordination Center',
  'Medical Team Alert',
  'Hospital Notification',
  'Ambulance Coordination',
  'Route Optimization',
  'Live Tracking',
  'ETA Updates',
  'Arrival Confirmation',
  'Donation Process',
  'Success Recording',
  'Impact Tracking',
  'Life Saved Confirmation',
  'Thank You Message',
  'Story Documentation',
  'Community Update',
  'Achievement Unlock',
  'Hero Recognition'
];

// Lifeline feature sequences with enhanced visuals
export const lifelineSequences = {
  aiMatching: generateProcessSequence(aiMatchingSteps, 'F59E0B', 'AI Matching'),
  blockchainVerification: generateProcessSequence(blockchainSteps, '3B82F6', 'Blockchain'),
  voiceInterface: generateProcessSequence(voiceSteps, '059669', 'Voice Interface'),
  emergencyResponse: generateProcessSequence(emergencySteps, 'DC2626', 'Emergency Response')
};

// Configuration for different sequence types
export const sequenceConfigs = {
  aiMatching: {
    title: 'AI-Powered Instant Matching',
    description: 'Watch how our AI analyzes thousands of donors in seconds to find the perfect match for emergency blood requests.',
    frames: lifelineSequences.aiMatching,
    frameHeight: 350,
    color: 'text-yellow-600 bg-yellow-100'
  },
  blockchainVerification: {
    title: 'Blockchain-Verified Donors',
    description: 'Every donation is recorded on the blockchain, creating an immutable history of verified, safe blood donations.',
    frames: lifelineSequences.blockchainVerification,
    frameHeight: 350,
    color: 'text-blue-600 bg-blue-100'
  },
  voiceInterface: {
    title: 'Voice-Accessible Interface',
    description: 'Request blood donations in your preferred language with our multilingual voice interface - no barriers to saving lives.',
    frames: lifelineSequences.voiceInterface,
    frameHeight: 350,
    color: 'text-green-600 bg-green-100'
  },
  emergencyResponse: {
    title: 'Real-Time Emergency Alerts',
    description: 'From emergency request to donor notification in under 30 seconds - see how we make every second count.',
    frames: lifelineSequences.emergencyResponse,
    frameHeight: 350,
    color: 'text-red-600 bg-red-100'
  }
};
