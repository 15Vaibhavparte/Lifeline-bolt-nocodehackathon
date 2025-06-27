#!/usr/bin/env node

import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Environment Check Script for Blood Drive App
console.log('🔍 Checking Blood Drive App Environment...\n');

// Check Node.js version
console.log('📦 Node.js version:', process.version);

// Check if this is a production build
const isProduction = process.env.NODE_ENV === 'production';
console.log('🏗️  Environment:', isProduction ? 'Production' : 'Development');

// Check environment variables
const requiredEnvVars = {
  'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
  'VITE_SUPABASE_ANON_KEY': process.env.VITE_SUPABASE_ANON_KEY
};

console.log('\n🔑 Environment Variables:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${key}: NOT SET`);
  }
});

// Check if required dependencies are installed
console.log('\n📚 Checking Dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const criticalDeps = [
    '@supabase/supabase-js',
    'react',
    'react-dom',
    'framer-motion',
    'lucide-react'
  ];

  criticalDeps.forEach(dep => {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep}: installed`);
    } else {
      console.log(`❌ ${dep}: missing`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Check if build files exist
console.log('\n🏗️  Build Files:');
const distExists = fs.existsSync('dist');
const indexExists = fs.existsSync('dist/index.html');

console.log(`${distExists ? '✅' : '❌'} dist/ directory exists`);
console.log(`${indexExists ? '✅' : '❌'} dist/index.html exists`);

// Summary
console.log('\n📋 Summary:');
const allEnvVarsSet = Object.values(requiredEnvVars).every(v => v);
console.log(`Environment Variables: ${allEnvVarsSet ? '✅ All set' : '❌ Missing required vars'}`);
console.log(`Build Status: ${distExists && indexExists ? '✅ Ready' : '❌ Run npm run build'}`);

if (!allEnvVarsSet) {
  console.log('\n💡 To fix environment variables:');
  console.log('1. Create a .env file in the project root');
  console.log('2. Add the following lines:');
  console.log('   VITE_SUPABASE_URL=your_supabase_url');
  console.log('   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.log('3. For production deployment, set these in your hosting platform');
}

if (!distExists || !indexExists) {
  console.log('\n💡 To build the project:');
  console.log('   npm run build');
}
