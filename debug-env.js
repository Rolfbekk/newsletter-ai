// Debug script to check environment variables
require('dotenv').config({ path: '.env.local' });
console.log('Environment variables check:');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'EXISTS' : 'NOT FOUND');
console.log('API Key length:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.length : 0);
console.log('API Key starts with SG.:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.startsWith('SG.') : false);
console.log('First 10 characters:', process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY.substring(0, 10) + '...' : 'N/A');

// Also check if the .env.local file exists
const fs = require('fs');
if (fs.existsSync('.env.local')) {
  console.log('.env.local file exists');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  console.log('File contains SENDGRID_API_KEY:', envContent.includes('SENDGRID_API_KEY'));
} else {
  console.log('.env.local file does not exist');
} 