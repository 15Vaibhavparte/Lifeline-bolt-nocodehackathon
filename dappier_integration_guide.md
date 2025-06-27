# Complete Dappier AI Copilot Integration Guide
## Blood Donation App - Step-by-Step Implementation

---

## 🧩 1. Dappier Account Setup

### Step 1.1: Create Your Dappier Account
1. **Visit** [Dappier.com](https://dappier.com) and click "Sign Up"
2. **Choose** the "Developer" plan for your blood donation app
3. **Verify** your email address through the confirmation link
4. **Complete** your profile with:
   - Company name: "Lifeline Blood Donation"
   - Use case: "Healthcare/Emergency Services"
   - Expected users: "10,000+ monthly"

### Step 1.2: Initial Workspace Setup
1. **Create a new workspace**: "Blood Donation Platform"
2. **Set up your first project**: "Lifeline AI Assistant"
3. **Configure basic settings**:
   ```
   Project Name: Lifeline Copilot
   Domain: yourdomain.com (or subdomain)
   Industry: Healthcare
   Primary Language: English (with Hindi support)
   ```

### Step 1.3: API Keys and Authentication
1. **Navigate** to Settings → API Keys
2. **Generate** your API key and save it securely:
   ```
   DAPPIER_API_KEY=dpr_live_xxxxxxxxxxxxx
   DAPPIER_PROJECT_ID=proj_xxxxxxxxxxxxx
   ```
3. **Set up** webhook endpoints for your app

---

## ⚙️ 2. Creating the Copilot

### Step 2.1: Create Custom AI Copilot
1. **Go to** Copilots → Create New Copilot
2. **Configure basic settings**:
   ```
   Name: Lifeline Blood Donation Assistant
   Description: AI assistant for blood donors and recipients
   Persona: Helpful, empathetic healthcare assistant
   Tone: Professional yet warm and reassuring
   ```

### Step 2.2: Default Settings for Blood Donation Use Case
```json
{
  "copilot_config": {
    "name": "Lifeline Assistant",
    "personality": "empathetic_healthcare_helper",
    "response_style": "concise_yet_comprehensive",
    "safety_level": "high",
    "medical_disclaimer": true,
    "emergency_escalation": true,
    "supported_languages": ["en", "hi", "ta", "bn"],
    "max_response_length": 300,
    "context_memory": true
  }
}
```

### Step 2.3: Upload Knowledge Base Documents
1. **Prepare your knowledge base files**:
   - `blood_donation_faq.pdf`
   - `eligibility_criteria.docx`
   - `donation_process_guide.pdf`
   - `emergency_protocols.txt`
   - `blood_types_compatibility.csv`

2. **Upload documents** via Dappier dashboard:
   ```
   Knowledge Base → Upload Documents → Select All Files
   Processing: Auto-chunking enabled
   Indexing: Vector embeddings for semantic search
   ```

### Step 2.4: Training with FAQs
**Create FAQ training data**:
```
Q: Who can donate blood?
A: Generally, healthy individuals aged 18-65, weighing at least 50kg can donate blood. You must not have donated in the last 3 months and be free from infections.

Q: How often can I donate blood?
A: You can donate whole blood every 3 months (90 days). Platelet donation can be done every 2 weeks.

Q: Is blood donation safe?
A: Yes, blood donation is completely safe. We use sterile, single-use equipment and follow strict safety protocols.
```

---

## 💬 3. Configuring Intents and Responses

### Intent 1: Registering as a Donor
```json
{
  "intent": "donor_registration",
  "training_phrases": [
    "I want to register as a donor",
    "How do I become a blood donor",
    "Sign me up to donate blood",
    "Register me as donor"
  ],
  "response_template": "I'd be happy to help you register as a blood donor! Here's what you need to do:\n\n1. **Check eligibility**: You must be 18-65 years old, weigh at least 50kg\n2. **Click 'Register as Donor'** in the app\n3. **Complete your profile** with blood type and location\n4. **Verify your identity** through our secure process\n\nWould you like me to check your eligibility first?",
  "follow_up_actions": ["check_eligibility", "start_registration"]
}
```

### Intent 2: Finding Nearby Blood Donors
```json
{
  "intent": "find_donors",
  "training_phrases": [
    "Find blood donors near me",
    "I need O negative blood urgently",
    "Search for donors in my area",
    "Emergency blood needed"
  ],
  "response_template": "I'll help you find compatible blood donors right away!\n\n**To search for donors, I need:**\n• Blood type required: {blood_type}\n• Your location: {location}\n• Urgency level: {urgency}\n\nClick 'Request Blood Now' and I'll instantly alert nearby compatible donors. In emergencies, donors within 10km will be notified immediately.",
  "context_required": ["blood_type", "location", "urgency"]
}
```

### Intent 3: Checking Donation Eligibility
```json
{
  "intent": "check_eligibility",
  "training_phrases": [
    "Can I donate blood",
    "Am I eligible to donate",
    "Check my donation eligibility",
    "Blood donation requirements"
  ],
  "response_template": "Let me check your eligibility to donate blood:\n\n**Basic Requirements:**\n✅ Age: 18-65 years\n✅ Weight: At least 50kg\n✅ Health: No recent illness/medication\n✅ Last donation: At least 3 months ago\n\n**Quick Questions:**\n• How old are you?\n• What's your approximate weight?\n• When did you last donate blood?\n• Are you currently taking any medications?\n\nBased on your answers, I'll confirm your eligibility!",
  "follow_up_questions": ["age", "weight", "last_donation", "medications"]
}
```

### Intent 4: Learning About Donation Camps/Events
```json
{
  "intent": "donation_events",
  "training_phrases": [
    "Blood donation camps near me",
    "Upcoming donation events",
    "When is the next blood drive",
    "Find donation camps"
  ],
  "response_template": "Here are upcoming blood donation events in your area:\n\n**This Week:**\n📅 {event_name} - {date}\n📍 {location}\n⏰ {time}\n👥 {organizer}\n\n**How to participate:**\n1. Click 'Register for Event'\n2. Choose your preferred time slot\n3. Receive confirmation & reminders\n\nWould you like me to register you for any of these events?",
  "dynamic_content": ["events_list", "user_location"]
}
```

### Intent 5: Emergency Request Help
```json
{
  "intent": "emergency_help",
  "training_phrases": [
    "Emergency blood needed",
    "Urgent blood required",
    "Help me find blood now",
    "Critical blood shortage"
  ],
  "response_template": "🚨 **EMERGENCY MODE ACTIVATED** 🚨\n\nI'm immediately alerting all compatible donors in your area!\n\n**What's happening:**\n• Notifying {donor_count} nearby donors\n• Sending push notifications\n• Activating voice alerts\n• Contacting blood banks\n\n**Your request details:**\n• Blood type: {blood_type}\n• Location: {location}\n• Contact: {contact_info}\n\n**Next steps:**\n1. Keep your phone handy for donor calls\n2. Prepare for hospital visit\n3. I'll update you on donor responses\n\nStay strong! Help is on the way. 💪",
  "priority": "highest",
  "alert_all_systems": true
}
```

---

## 🌐 4. Embedding the Copilot in My App

### Step 4.1: Get Dappier Web SDK
1. **Navigate** to Integrations → Web SDK
2. **Copy the integration code**:

```html
<!-- Dappier Copilot Widget -->
<script src="https://cdn.dappier.com/copilot-widget.js"></script>
<div id="dappier-copilot"></div>

<script>
DappierCopilot.init({
  projectId: 'proj_your_project_id',
  apiKey: 'dpr_live_your_api_key',
  containerId: 'dappier-copilot',
  theme: 'custom',
  position: 'bottom-right',
  minimized: true,
  customCSS: `
    .copilot-widget {
      --primary-color: #dc2626;
      --secondary-color: #ffffff;
      --accent-color: #ef4444;
      --border-radius: 12px;
      --font-family: 'Inter', sans-serif;
    }
  `
});
</script>
```

### Step 4.2: Bolt Integration
**For Bolt.new apps:**
1. **Go to** your Bolt project settings
2. **Add custom HTML** in the head section:
```html
<head>
  <!-- Existing head content -->
  <script src="https://cdn.dappier.com/copilot-widget.js"></script>
  <style>
    .dappier-copilot-button {
      background: linear-gradient(135deg, #dc2626, #ef4444) !important;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3) !important;
      border-radius: 50px !important;
    }
    .dappier-chat-container {
      border: 2px solid #dc2626 !important;
      border-radius: 16px !important;
    }
  </style>
</head>
```

3. **Add the widget container** where you want it:
```html
<div id="lifeline-copilot" class="fixed bottom-4 right-4 z-50"></div>
```

### Step 4.3: Custom Styling for Red-and-White Theme
```css
/* Custom Lifeline Theme */
.dappier-copilot-widget {
  --primary-red: #dc2626;
  --light-red: #fef2f2;
  --white: #ffffff;
  --gray: #6b7280;
  
  font-family: 'Inter', -apple-system, sans-serif;
}

.dappier-chat-header {
  background: linear-gradient(135deg, var(--primary-red), #ef4444);
  color: var(--white);
  padding: 16px;
  border-radius: 16px 16px 0 0;
}

.dappier-message-user {
  background: var(--light-red);
  color: var(--primary-red);
  border-radius: 18px 18px 4px 18px;
}

.dappier-message-bot {
  background: var(--white);
  border: 1px solid #e5e7eb;
  border-radius: 18px 18px 18px 4px;
}

.dappier-input-container {
  border-top: 1px solid #e5e7eb;
  padding: 12px;
}

.dappier-send-button {
  background: var(--primary-red);
  color: var(--white);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dappier-send-button:hover {
  background: #b91c1c;
  transform: scale(1.05);
}
```

---

## 🔁 5. Context Passing and Personalization

### Step 5.1: User Attributes Configuration
```javascript
// Pass user context to Dappier
function initializeCopilotWithUser(userData) {
  DappierCopilot.setContext({
    user: {
      id: userData.userId,
      role: userData.role, // 'donor' | 'recipient' | 'hospital'
      bloodType: userData.bloodType,
      location: {
        city: userData.city,
        coordinates: userData.coordinates
      },
      donationHistory: {
        lastDonation: userData.lastDonation,
        totalDonations: userData.totalDonations,
        eligibilityStatus: userData.eligibilityStatus
      },
      preferences: {
        language: userData.preferredLanguage,
        notifications: userData.notificationPrefs
      }
    },
    session: {
      timestamp: new Date().toISOString(),
      source: 'mobile_app',
      urgency: userData.currentUrgency || 'normal'
    }
  });
}

// Example usage when user logs in
const currentUser = {
  userId: 'user_123',
  role: 'donor',
  bloodType: 'O+',
  city: 'Mumbai',
  coordinates: { lat: 19.0760, lng: 72.8777 },
  lastDonation: '2024-01-15',
  totalDonations: 5,
  eligibilityStatus: 'eligible',
  preferredLanguage: 'en',
  notificationPrefs: { emergency: true, events: true }
};

initializeCopilotWithUser(currentUser);
```

### Step 5.2: Dynamic Role-Based Responses
```javascript
// Configure role-specific behavior
DappierCopilot.addContextualResponse({
  condition: 'user.role === "donor"',
  intents: ['greeting', 'help'],
  responseTemplate: `Hi there! 👋 Thanks for being a lifesaver as a blood donor. I'm here to help you with:
  
  • Your donation eligibility and schedule
  • Finding nearby donation camps
  • Tracking your donation impact
  • Answering any donation questions
  
  What can I help you with today?`
});

DappierCopilot.addContextualResponse({
  condition: 'user.role === "recipient"',
  intents: ['greeting', 'help'],
  responseTemplate: `Hello! I'm here to help you find the blood you need quickly and safely. I can assist with:
  
  • Finding compatible donors nearby
  • Emergency blood requests
  • Hospital and blood bank information
  • Understanding the donation process
  
  How can I help you today?`
});
```

### Step 5.3: Secure Context Passing
```javascript
// Encrypt sensitive data before passing to Dappier
function secureContextPass(userData) {
  const sanitizedData = {
    userId: hashUserId(userData.userId), // Hash for privacy
    role: userData.role,
    bloodType: userData.bloodType,
    cityCode: getCityCode(userData.city), // Use city codes instead of names
    eligibilityStatus: userData.eligibilityStatus,
    language: userData.preferredLanguage
  };
  
  return sanitizedData;
}

// Hash function for user ID
function hashUserId(userId) {
  return btoa(userId).substring(0, 8); // Simple base64 hash
}
```

---

## 🔐 6. Securing the Integration

### Step 6.1: Security Best Practices
```javascript
// 1. Environment Variables (Never expose in client code)
const DAPPIER_CONFIG = {
  apiKey: process.env.DAPPIER_API_KEY, // Server-side only
  projectId: process.env.DAPPIER_PROJECT_ID,
  environment: process.env.NODE_ENV || 'development'
};

// 2. Secure initialization through your backend
async function initSecureCopilot(userToken) {
  const response = await fetch('/api/copilot/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    }
  });
  
  const { sessionToken } = await response.json();
  
  DappierCopilot.init({
    sessionToken: sessionToken, // Use session token instead of API key
    projectId: 'proj_your_project_id'
  });
}
```

### Step 6.2: Data Encryption and Anonymization
```javascript
// Anonymize medical data
function anonymizeUserData(userData) {
  return {
    ...userData,
    userId: anonymizeId(userData.userId),
    location: anonymizeLocation(userData.location),
    medicalHistory: null, // Never pass full medical history
    contactInfo: null // Never pass direct contact info
  };
}

function anonymizeLocation(location) {
  // Round coordinates to protect exact location
  return {
    city: location.city,
    coordinates: {
      lat: Math.round(location.coordinates.lat * 100) / 100,
      lng: Math.round(location.coordinates.lng * 100) / 100
    }
  };
}
```

### Step 6.3: GDPR and India PDPB Compliance
```javascript
// GDPR/PDPB Compliance Configuration
const privacyConfig = {
  dataRetention: {
    conversationHistory: '30 days',
    userContext: '90 days',
    analyticsData: '2 years'
  },
  userRights: {
    dataExport: true,
    dataDelete: true,
    dataCorrection: true,
    processingOptOut: true
  },
  consent: {
    required: true,
    granular: true,
    withdrawable: true
  }
};

// Implement user consent check
function checkUserConsent() {
  const consent = localStorage.getItem('dappier_consent');
  if (!consent) {
    showConsentDialog();
    return false;
  }
  return JSON.parse(consent).aiAssistant === true;
}

function showConsentDialog() {
  // Show consent dialog before initializing copilot
  const consentHTML = `
    <div id="consent-dialog">
      <h3>AI Assistant Privacy</h3>
      <p>Our AI assistant helps you with blood donation queries. We process your data to provide personalized assistance.</p>
      <label>
        <input type="checkbox" id="ai-consent"> 
        I consent to AI processing of my data
      </label>
      <button onclick="saveConsent()">Continue</button>
    </div>
  `;
}
```

---

## 📈 7. Monitoring & Improving the Copilot

### Step 7.1: Development Testing
```javascript
// Testing configuration for development
DappierCopilot.init({
  projectId: 'proj_your_project_id',
  environment: 'development',
  debug: true,
  testMode: {
    enabled: true,
    mockResponses: true,
    logAllInteractions: true
  }
});

// Test scenarios
const testScenarios = [
  {
    intent: 'donor_registration',
    userInput: 'I want to register as a donor',
    expectedResponse: 'eligibility_check'
  },
  {
    intent: 'emergency_help',
    userInput: 'I need O negative blood urgently',
    expectedResponse: 'emergency_activation'
  }
];

// Run automated tests
testScenarios.forEach(scenario => {
  DappierCopilot.test(scenario.userInput)
    .then(response => {
      console.log(`✅ Test passed: ${scenario.intent}`);
    })
    .catch(error => {
      console.log(`❌ Test failed: ${scenario.intent}`, error);
    });
});
```

### Step 7.2: Analytics and Tracking
```javascript
// Custom analytics tracking
DappierCopilot.on('message', (data) => {
  // Track user interactions
  analytics.track('copilot_interaction', {
    intent: data.intent,
    userRole: data.context.user.role,
    responseTime: data.responseTime,
    satisfaction: data.satisfaction
  });
});

DappierCopilot.on('intent_not_recognized', (data) => {
  // Track failed intents for improvement
  analytics.track('copilot_intent_failed', {
    userInput: data.input,
    suggestedIntents: data.suggestions
  });
});

// Weekly analytics report
function generateWeeklyReport() {
  const metrics = {
    totalInteractions: analytics.getCount('copilot_interaction'),
    topIntents: analytics.getTopIntents(),
    averageResponseTime: analytics.getAverageResponseTime(),
    userSatisfaction: analytics.getAverageSatisfaction(),
    failedIntents: analytics.getFailedIntents()
  };
  
  console.log('Weekly Copilot Report:', metrics);
}
```

### Step 7.3: Continuous Improvement
```javascript
// Auto-improvement based on user feedback
DappierCopilot.on('feedback', (feedback) => {
  if (feedback.rating < 3) {
    // Send feedback to improvement queue
    improveResponse(feedback.messageId, feedback.comment);
  }
});

function improveResponse(messageId, feedback) {
  // Add to training data for model improvement
  const improvementData = {
    messageId: messageId,
    userFeedback: feedback,
    suggestedImprovement: generateImprovement(feedback),
    timestamp: new Date().toISOString()
  };
  
  // Send to Dappier for model retraining
  DappierAPI.addTrainingData(improvementData);
}
```

---

## 🧪 8. Bonus: Integrate Multilingual + Voice

### Step 8.1: ElevenLabs Voice Integration
```javascript
// ElevenLabs configuration
const elevenLabsConfig = {
  apiKey: process.env.ELEVENLABS_API_KEY,
  voiceId: 'voice_hindi_female', // Warm, empathetic voice
  model: 'eleven_multilingual_v2'
};

// Text-to-speech for copilot responses
async function speakResponse(text, language = 'en') {
  const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': elevenLabsConfig.apiKey
    },
    body: JSON.stringify({
      text: text,
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75
      },
      model_id: elevenLabsConfig.model
    })
  });
  
  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
}

// Integrate with Dappier
DappierCopilot.on('response', (data) => {
  if (userPreferences.voiceEnabled) {
    speakResponse(data.text, data.language);
  }
});
```

### Step 8.2: Lingo Translation Integration
```javascript
// Lingo translation service
const lingoConfig = {
  apiKey: process.env.LINGO_API_KEY,
  supportedLanguages: ['en', 'hi', 'ta', 'bn', 'te', 'mr']
};

// Translate copilot responses
async function translateResponse(text, targetLanguage) {
  if (targetLanguage === 'en') return text;
  
  const response = await fetch('https://api.lingo.com/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${lingoConfig.apiKey}`
    },
    body: JSON.stringify({
      text: text,
      source: 'en',
      target: targetLanguage,
      context: 'healthcare'
    })
  });
  
  const result = await response.json();
  return result.translatedText;
}

// Enhanced Dappier with translation
DappierCopilot.addMiddleware('response', async (data) => {
  const userLanguage = data.context.user.language;
  if (userLanguage !== 'en') {
    data.text = await translateResponse(data.text, userLanguage);
  }
  return data;
});
```

### Step 8.3: Voice-to-Text Input
```javascript
// Voice input for low-literacy users
class VoiceInput {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'hi-IN'; // Default to Hindi
  }
  
  async startListening(language = 'hi-IN') {
    this.recognition.lang = language;
    
    return new Promise((resolve, reject) => {
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };
      
      this.recognition.onerror = (event) => {
        reject(event.error);
      };
      
      this.recognition.start();
    });
  }
}

// Integrate voice input with copilot
const voiceInput = new VoiceInput();

document.getElementById('voice-button').addEventListener('click', async () => {
  try {
    const userSpeech = await voiceInput.startListening();
    DappierCopilot.sendMessage(userSpeech);
  } catch (error) {
    console.error('Voice input error:', error);
  }
});
```

---

## 📌 Final Output

### Action Items Checklist

#### **Phase 1: Setup & Configuration**
- [ ] ✅ Create Dappier account and workspace
- [ ] ✅ Set up project with healthcare-specific settings
- [ ] ✅ Generate and secure API keys
- [ ] ✅ Upload knowledge base documents (FAQs, eligibility, etc.)
- [ ] ✅ Configure 5 core intents with training phrases
- [ ] ✅ Test basic copilot functionality

#### **Phase 2: Integration & Styling**
- [ ] ✅ Integrate Dappier Web SDK into Bolt app
- [ ] ✅ Implement red-and-white theme styling
- [ ] ✅ Configure responsive design for mobile
- [ ] ✅ Test widget positioning and behavior
- [ ] ✅ Implement user context passing
- [ ] ✅ Add role-based personalization

#### **Phase 3: Security & Compliance**
- [ ] ✅ Implement secure context passing (no sensitive data)
- [ ] ✅ Add user consent mechanism
- [ ] ✅ Configure data retention policies
- [ ] ✅ Test GDPR/PDPB compliance features
- [ ] ✅ Implement error handling and fallbacks
- [ ] ✅ Add analytics and monitoring

#### **Phase 4: Advanced Features**
- [ ] ✅ Integrate ElevenLabs for voice responses
- [ ] ✅ Add Lingo translation for multilingual support
- [ ] ✅ Implement voice-to-text input
- [ ] ✅ Configure emergency escalation workflows
- [ ] ✅ Test multilingual interactions
- [ ] ✅ Optimize response times

### Code Snippets Summary

#### **Basic Integration**
```html
<script src="https://cdn.dappier.com/copilot-widget.js"></script>
<div id="dappier-copilot"></div>
<script>
DappierCopilot.init({
  projectId: 'proj_your_id',
  theme: 'lifeline_theme',
  position: 'bottom-right'
});
</script>
```

#### **Context Passing**
```javascript
DappierCopilot.setContext({
  user: {
    role: 'donor',
    bloodType: 'O+',
    location: 'Mumbai',
    eligibilityStatus: 'eligible'
  }
});
```

#### **Voice Integration**
```javascript
// Text-to-speech
await speakResponse(responseText, 'hi');

// Speech-to-text
const userSpeech = await voiceInput.startListening('hi-IN');
DappierCopilot.sendMessage(userSpeech);
```

### Production Readiness Checklist

#### **Technical Requirements**
- [ ] ✅ All API keys secured in environment variables
- [ ] ✅ Error handling implemented for all API calls
- [ ] ✅ Rate limiting configured
- [ ] ✅ Responsive design tested on mobile devices
- [ ] ✅ Accessibility features implemented
- [ ] ✅ Performance optimized (< 3s load time)

#### **Content & Training**
- [ ] ✅ All 5 core intents trained with 10+ examples each
- [ ] ✅ Knowledge base includes all necessary documents
- [ ] ✅ Emergency escalation workflows configured
- [ ] ✅ Multilingual responses tested
- [ ] ✅ Medical disclaimers included in responses
- [ ] ✅ Fallback responses for unrecognized intents

#### **Security & Compliance**
- [ ] ✅ User consent mechanism implemented
- [ ] ✅ Data anonymization working correctly
- [ ] ✅ GDPR/PDPB compliance verified
- [ ] ✅ Secure API communication (HTTPS only)
- [ ] ✅ Session management implemented
- [ ] ✅ No sensitive data exposed in client-side code

#### **Monitoring & Analytics**
- [ ] ✅ User interaction tracking configured
- [ ] ✅ Error monitoring with Sentry integrated
- [ ] ✅ Performance metrics collection
- [ ] ✅ Weekly analytics reports automated
- [ ] ✅ Feedback collection mechanism
- [ ] ✅ Continuous improvement pipeline

### **🎉 Your Dappier AI Copilot is Production-Ready!**

Once all checkboxes are completed, your blood donation app will have a fully functional, secure, and multilingual AI copilot that can help donors and recipients 24/7. The copilot will understand context, provide personalized responses, and escalate emergencies appropriately.

**Next Steps:**
1. Deploy to production environment
2. Monitor user interactions for first week
3. Gather feedback and iterate
4. Expand knowledge base based on real user queries
5. Add more languages as needed

Your lifesaving app is ready to help connect donors and recipients! 🩸❤️