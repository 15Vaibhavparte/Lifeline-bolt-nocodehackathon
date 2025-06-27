# Dappier AI Integration for Lifeline

## 🎯 Overview

This guide explains how to set up and use the Dappier AI integration in the Lifeline blood donation platform. Dappier provides intelligent AI assistance for donors, recipients, and healthcare providers.

## 🔧 Manual Setup Required

### Step 1: Create a Dappier Account
1. Visit [Dappier.com](https://dappier.com) and sign up
2. Choose the "Developer" plan
3. Complete your profile with:
   - Company name: "Lifeline Blood Donation"
   - Use case: "Healthcare/Emergency Services"

### Step 2: Create a Project
1. Create a new workspace: "Blood Donation Platform"
2. Set up a project: "Lifeline AI Assistant"
3. Configure settings:
   ```
   Project Name: Lifeline Copilot
   Industry: Healthcare
   Primary Language: English (with multilingual support)
   ```

### Step 3: Get API Keys
1. Navigate to Settings → API Keys
2. Generate your API key
3. Add these to your `.env` file:
   ```
   VITE_DAPPIER_API_KEY=ak_your_actual_api_key
   VITE_DAPPIER_PROJECT_ID=dm_your_actual_project_id
   VITE_DAPPIER_BASE_URL=https://api.dappier.com
   ```

### Step 4: Upload Knowledge Base Documents
1. Prepare knowledge base files:
   - Blood donation FAQs
   - Eligibility criteria
   - Donation process guide
   - Emergency protocols
   - Blood type compatibility information
2. Upload via Dappier dashboard:
   ```
   Knowledge Base → Upload Documents → Select Files
   ```

### Step 5: Configure Intents
In the Dappier dashboard, create these intents:
1. **donor_registration** - For donor signup
2. **find_donors** - For finding compatible donors
3. **check_eligibility** - For eligibility assessment
4. **donation_events** - For blood drive information
5. **emergency_help** - For emergency blood requests

## 🚀 Using the Integration

### Accessing the AI Dashboard
1. Navigate to **AI Dashboard** in the header menu
2. View AI status and test the copilot

### Testing the Copilot
1. Go to the **Copilot Test** tab
2. Try sample queries like:
   - "I want to register as a donor"
   - "Find blood donors near me"
   - "Am I eligible to donate blood?"
   - "When is the next blood drive?"
   - "I need O negative blood urgently"

### Voice Input
1. Click the microphone icon
2. Speak your query
3. The transcript will appear and be sent to the AI

## 🔒 Privacy & Security

### Data Protection
- User data is anonymized before being sent to Dappier
- Medical information is never shared with the AI
- Exact location coordinates are rounded for privacy
- All communication is encrypted

### User Consent
- Users must explicitly consent to AI processing
- Consent can be withdrawn at any time
- Data retention is limited to 30 days

## 🌐 Multilingual Support

The AI assistant supports:
- English (en-US)
- Hindi (hi-IN)
- Tamil (ta-IN)
- Bengali (bn-IN)

## 🛠️ Troubleshooting

### Common Issues
1. **AI Not Responding**
   - Check your API keys in `.env`
   - Verify internet connection
   - Try refreshing the connection in AI Dashboard

2. **Voice Input Not Working**
   - Grant microphone permissions
   - Check browser compatibility (Chrome/Edge recommended)
   - Try using text input instead

3. **Incorrect Responses**
   - Provide more specific queries
   - Check if you're in the right user role context
   - Report incorrect responses for improvement

## 📞 Support

For Dappier integration support:
- Email: support@dappier.com
- Documentation: https://docs.dappier.com
- Status page: https://status.dappier.com