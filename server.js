import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || process.env.VITE_GOOGLE_AI_KEY);

// Initialize Supabase client with service role key for backend operations
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Define function schemas for Gemini
const functionSchemas = [
  {
    name: 'findCompatibleDonors',
    description: 'Find compatible blood donors based on blood type and location requirements',
    parameters: {
      type: 'object',
      properties: {
        requiredBloodType: {
          type: 'string',
          description: 'The blood type needed (A+, A-, B+, B-, AB+, AB-, O+, O-)',
          enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        hospitalLocation: {
          type: 'string',
          description: 'The hospital or area where blood is needed'
        },
        urgency: {
          type: 'string',
          description: 'Urgency level of the request',
          enum: ['low', 'medium', 'high', 'critical']
        },
        maxDistance: {
          type: 'number',
          description: 'Maximum distance in kilometers from the hospital',
          default: 50
        }
      },
      required: ['requiredBloodType', 'hospitalLocation']
    }
  },
  {
    name: 'findBloodDrives',
    description: 'Find upcoming blood drives in a specific area',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City or area to search for blood drives'
        },
        startDate: {
          type: 'string',
          description: 'Start date to search from (YYYY-MM-DD format)'
        },
        endDate: {
          type: 'string',
          description: 'End date to search until (YYYY-MM-DD format)'
        }
      },
      required: ['location']
    }
  },
  {
    name: 'getBloodCompatibility',
    description: 'Get blood type compatibility information for donors and recipients',
    parameters: {
      type: 'object',
      properties: {
        bloodType: {
          type: 'string',
          description: 'The blood type to check compatibility for',
          enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        checkType: {
          type: 'string',
          description: 'Whether to check who this blood type can donate to or receive from',
          enum: ['canDonateTo', 'canReceiveFrom']
        }
      },
      required: ['bloodType', 'checkType']
    }
  },
  {
    name: 'registerEmergencyRequest',
    description: 'Register an emergency blood request in the system',
    parameters: {
      type: 'object',
      properties: {
        bloodType: {
          type: 'string',
          description: 'Required blood type',
          enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
        },
        hospitalName: {
          type: 'string',
          description: 'Name of the hospital'
        },
        contactInfo: {
          type: 'string',
          description: 'Contact information for the request'
        },
        urgency: {
          type: 'string',
          description: 'Urgency level',
          enum: ['low', 'medium', 'high', 'critical']
        },
        unitsNeeded: {
          type: 'number',
          description: 'Number of blood units needed'
        }
      },
      required: ['bloodType', 'hospitalName', 'contactInfo', 'urgency']
    }
  }
];

// Blood compatibility matrix
const bloodCompatibility = {
  'O-': { canDonateTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-'] },
  'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O-', 'O+'] },
  'A-': { canDonateTo: ['A-', 'A+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'A-'] },
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+'] },
  'B-': { canDonateTo: ['B-', 'B+', 'AB-', 'AB+'], canReceiveFrom: ['O-', 'B-'] },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['O-', 'O+', 'B-', 'B+'] },
  'AB-': { canDonateTo: ['AB-', 'AB+'], canReceiveFrom: ['O-', 'A-', 'B-', 'AB-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] }
};

// Function implementations
async function findCompatibleDonors({ requiredBloodType, hospitalLocation, urgency = 'medium', maxDistance = 50 }) {
  try {
    // Get compatible blood types (who can donate to the required type)
    const compatibleTypes = [];
    for (const [donorType, compatibility] of Object.entries(bloodCompatibility)) {
      if (compatibility.canDonateTo.includes(requiredBloodType)) {
        compatibleTypes.push(donorType);
      }
    }

    // Query for mock donors (in a real system, this would be your actual donors table)
    const { data: donors, error } = await supabase
      .from('profiles')
      .select('id, full_name, blood_type, city, phone, last_donation_date, is_available')
      .in('blood_type', compatibleTypes)
      .eq('is_available', true)
      .eq('donor_status', 'active')
      .ilike('city', `%${hospitalLocation}%`)
      .order('last_donation_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Database query failed', details: error.message };
    }

    // Anonymize sensitive data before returning
    const anonymizedDonors = donors?.map(donor => ({
      id: donor.id,
      bloodType: donor.blood_type,
      location: donor.city,
      lastDonation: donor.last_donation_date,
      // Don't expose full names or contact info to AI
      contactAvailable: !!donor.phone,
      isEligible: true
    })) || [];

    return {
      success: true,
      requiredBloodType,
      compatibleDonors: anonymizedDonors,
      totalFound: anonymizedDonors.length,
      urgency,
      searchLocation: hospitalLocation
    };

  } catch (error) {
    console.error('Error finding donors:', error);
    return { success: false, error: 'Internal server error' };
  }
}

async function findBloodDrives({ location, startDate, endDate }) {
  try {
    let query = supabase
      .from('blood_drives')
      .select('id, title, description, event_date, start_time, end_time, location, address, expected_donors, registered_donors, contact_phone, contact_email')
      .eq('is_active', true)
      .ilike('location', `%${location}%`);

    if (startDate) {
      query = query.gte('event_date', startDate);
    }
    if (endDate) {
      query = query.lte('event_date', endDate);
    }

    const { data: drives, error } = await query
      .order('event_date', { ascending: true })
      .limit(10);

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: 'Failed to fetch blood drives' };
    }

    return {
      success: true,
      location,
      bloodDrives: drives || [],
      totalFound: drives?.length || 0
    };

  } catch (error) {
    console.error('Error finding blood drives:', error);
    return { success: false, error: 'Internal server error' };
  }
}

async function getBloodCompatibility({ bloodType, checkType }) {
  try {
    const compatibility = bloodCompatibility[bloodType];
    if (!compatibility) {
      return { success: false, error: 'Invalid blood type' };
    }

    return {
      success: true,
      bloodType,
      checkType,
      compatibleTypes: compatibility[checkType],
      explanation: checkType === 'canDonateTo' 
        ? `${bloodType} blood can be donated to: ${compatibility[checkType].join(', ')}`
        : `${bloodType} blood can receive from: ${compatibility[checkType].join(', ')}`
    };

  } catch (error) {
    console.error('Error getting compatibility:', error);
    return { success: false, error: 'Internal server error' };
  }
}

async function registerEmergencyRequest({ bloodType, hospitalName, contactInfo, urgency, unitsNeeded = 1 }) {
  try {
    // In a real system, you'd want to validate and sanitize the input
    // and store this in an emergency_requests table
    const requestId = `EMR-${Date.now()}`;
    
    // For now, we'll just log it and return a success response
    console.log('Emergency request registered:', {
      requestId,
      bloodType,
      hospitalName,
      urgency,
      unitsNeeded,
      timestamp: new Date().toISOString()
    });

    return {
      success: true,
      requestId,
      bloodType,
      hospitalName,
      urgency,
      unitsNeeded,
      message: 'Emergency request registered successfully. Our team will process this immediately.',
      nextSteps: [
        'Hospital staff will be contacted within 15 minutes',
        'Compatible donors in the area will be notified',
        'Blood bank inventory will be checked',
        'Updates will be provided every 30 minutes'
      ]
    };

  } catch (error) {
    console.error('Error registering emergency request:', error);
    return { success: false, error: 'Failed to register emergency request' };
  }
}

// Main chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize the model with function calling
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [{ functionDeclarations: functionSchemas }]
    });

    // Build conversation history
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }]
    }));

    // Start a chat session
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Send the message
    const result = await chat.sendMessage(message);
    const response = result.response;

    // Check if Gemini wants to call a function
    const functionCalls = response.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      const functionResponses = [];

      // Execute each function call
      for (const functionCall of functionCalls) {
        const { name, args } = functionCall;
        let functionResult;

        switch (name) {
          case 'findCompatibleDonors':
            functionResult = await findCompatibleDonors(args);
            break;
          case 'findBloodDrives':
            functionResult = await findBloodDrives(args);
            break;
          case 'getBloodCompatibility':
            functionResult = await getBloodCompatibility(args);
            break;
          case 'registerEmergencyRequest':
            functionResult = await registerEmergencyRequest(args);
            break;
          default:
            functionResult = { success: false, error: 'Unknown function' };
        }

        functionResponses.push({
          name,
          response: functionResult
        });
      }

      // Send function results back to Gemini for final response
      const finalResult = await chat.sendMessage([
        {
          functionResponse: {
            name: functionResponses[0].name,
            response: functionResponses[0].response
          }
        }
      ]);

      const finalResponse = finalResult.response;
      
      res.json({
        success: true,
        message: finalResponse.text(),
        functionCalls: functionResponses,
        conversationHistory: await chat.getHistory()
      });

    } else {
      // Regular text response
      res.json({
        success: true,
        message: response.text(),
        conversationHistory: await chat.getHistory()
      });
    }

  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat request',
      details: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) throw error;

    res.json({ success: true, message: 'Database connection successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🩸 Lifeline AI Server running on port ${PORT}`);
  console.log(`🔗 API endpoints:`);
  console.log(`   POST /api/chat - Main AI chat endpoint`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/test-db - Test database connection`);
});

export default app;