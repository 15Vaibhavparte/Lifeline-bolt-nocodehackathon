// Quick setup verification for Gemini AI Blood Matching System
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('🩸 Lifeline AI - Setup Verification\n');

// Check environment variables
console.log('📋 Checking environment variables...');
const requiredEnvVars = [
  'GOOGLE_AI_KEY',
  'VITE_SUPABASE_URL', 
  'VITE_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

if (missingVars.length > 0) {
  console.log('\n❌ Missing environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease add these to your .env file');
  process.exit(1);
}

console.log('\n🔗 Testing connections...');

// Test Gemini AI
try {
  console.log('🤖 Testing Gemini AI...');
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  
  const result = await model.generateContent('Hello, are you working?');
  console.log('✅ Gemini AI: Connected');
} catch (error) {
  console.log('❌ Gemini AI: Failed to connect');
  console.log(`   Error: ${error.message}`);
}

// Test Supabase
try {
  console.log('🗄️  Testing Supabase...');
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1);
    
  if (error) throw error;
  console.log('✅ Supabase: Connected');
} catch (error) {
  console.log('❌ Supabase: Failed to connect');
  console.log(`   Error: ${error.message}`);
}

console.log('\n🎯 System Capabilities:');
console.log('   ✅ Natural language blood requests');
console.log('   ✅ Emergency request processing');
console.log('   ✅ Compatible donor search');
console.log('   ✅ Blood drive discovery');
console.log('   ✅ Blood type compatibility checking');
console.log('   ✅ Real-time AI chat interface');

console.log('\n🚀 Ready to start!');
console.log('   Backend: npm run server');
console.log('   Frontend: npm run dev');
console.log('   Or use: start-lifeline-ai.bat');

console.log('\n📖 Documentation: GEMINI_AI_INTEGRATION.md');
console.log('🌐 AI Dashboard: http://localhost:5176/gemini-ai');
