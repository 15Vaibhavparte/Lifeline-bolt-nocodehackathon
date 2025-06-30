// Quick test script to verify the servers are running
console.log('Testing server connections...');

// Test frontend server
fetch('http://localhost:5173/')
  .then(response => {
    console.log('✅ Frontend server (5173) is running:', response.status);
  })
  .catch(error => {
    console.log('❌ Frontend server (5173) error:', error.message);
  });

// Test backend server
fetch('http://localhost:3002/api/health')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend server (3002) is running:', data);
  })
  .catch(error => {
    console.log('❌ Backend server (3002) error:', error.message);
  });

console.log('Current servers:');
console.log('Frontend: http://localhost:5173');
console.log('Backend: http://localhost:3002');
console.log('AI Dashboard: http://localhost:5173/ai-dashboard');
