// Simple test script to verify the Gemini AI integration is working
import { geminiAI } from './src/services/geminiAI.ts';

async function testGeminiIntegration() {
  console.log('Testing Gemini AI integration...');
  
  try {
    // Test basic connection
    console.log('Testing connection...');
    const connectionTest = await geminiAI.testConnection();
    console.log('Connection test result:', connectionTest);
    
    // Test database
    console.log('Testing database...');
    const dbTest = await geminiAI.testDatabase();
    console.log('Database test result:', dbTest);
    
    // Test blood matching
    console.log('Testing blood matching...');
    const matchingTest = await geminiAI.findBloodMatch('O+', 'Mumbai', 'urgent');
    console.log('Blood matching test result:', matchingTest);
    
    console.log('All tests completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testGeminiIntegration();
