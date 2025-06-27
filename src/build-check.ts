// Build-time environment verification
console.log('🔧 Build Environment Check');
console.log('==========================');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ SET' : '❌ NOT SET');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ SET' : '❌ NOT SET');
console.log('Mode:', import.meta.env.MODE);
console.log('Prod:', import.meta.env.PROD);
console.log('Dev:', import.meta.env.DEV);

// This will help debug environment issues in production
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ Critical environment variables missing!');
  console.error('📝 Please check Netlify environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - VITE_SUPABASE_ANON_KEY');
}

export {};
