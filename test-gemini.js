// Test script for Gemini AI Blood Matching System
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || process.env.VITE_GOOGLE_AI_KEY);

async function testGeminiConnection() {
  console.log('🩸 Testing Lifeline Gemini AI Integration...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic Gemini connection...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const testPrompt = "Hello, can you confirm you're working?";
    const result = await model.generateContent(testPrompt);
    const response = result.response;
    
    console.log('✅ Basic connection successful');
    console.log('Response:', response.text().substring(0, 100) + '...\n');

    // Test function calling capability
    console.log('2. Testing function calling capability...');
    
    const functionSchemas = [
      {
        name: 'findBloodDonors',
        description: 'Find blood donors by type and location',
        parameters: {
          type: 'object',
          properties: {
            bloodType: {
              type: 'string',
              description: 'The blood type needed'
            },
            location: {
              type: 'string',
              description: 'The location to search'
            }
          },
          required: ['bloodType', 'location']
        }
      }
    ];

    const functionModel = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      tools: [{ functionDeclarations: functionSchemas }]
    });

    const functionTestPrompt = "I need O- blood in Mumbai urgently";
    const functionResult = await functionModel.generateContent(functionTestPrompt);
    const functionResponse = functionResult.response;

    const functionCalls = functionResponse.functionCalls();
    
    if (functionCalls && functionCalls.length > 0) {
      console.log('✅ Function calling works!');
      console.log('Function called:', functionCalls[0].name);
      console.log('Parameters:', JSON.stringify(functionCalls[0].args, null, 2));
    } else {
      console.log('⚠️  Function calling not triggered, but connection works');
      console.log('Response:', functionResponse.text());
    }

    console.log('\n🎉 Gemini AI integration test completed successfully!');
    console.log('\nNext steps:');
    console.log('- Start your backend server: npm run server');
    console.log('- Start your frontend: npm run dev');
    console.log('- Open http://localhost:5173 to use the AI assistant');

  } catch (error) {
    console.error('❌ Test failed:', error);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n🔑 API Key Issue:');
      console.log('- Check your .env file has GOOGLE_AI_KEY set');
      console.log('- Get a free API key from https://ai.google.dev/');
      console.log('- Make sure the key is valid and has Gemini API access');
    }
    
    if (error.message.includes('QUOTA_EXCEEDED')) {
      console.log('\n📊 Quota Issue:');
      console.log('- You may have exceeded the free tier limits');
      console.log('- Wait a moment and try again');
      console.log('- Check your usage at https://ai.google.dev/');
    }
  }
}

// Run the test
testGeminiConnection();
