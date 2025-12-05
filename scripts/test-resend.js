/**
 * Test Resend API Key
 * Run: node scripts/test-resend.js
 */

import { Resend } from 'resend';

// Manually load the API key - update this with your key
const RESEND_API_KEY = 're_6WGVdx4s_AaCPURLFTZkxrZhQR83MvW6F';
const FROM_EMAIL = 'ZY Bodybuilding <onboarding@resend.dev>';

const resend = new Resend(RESEND_API_KEY);

async function testResendKey() {
  console.log('🔑 Testing Resend API Key...\n');
  console.log('API Key:', RESEND_API_KEY?.substring(0, 10) + '...');
  console.log('From Email:', FROM_EMAIL);
  console.log('\n📧 Attempting to send test email...\n');

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: ['delivered@resend.dev'], // Resend test email
      subject: 'Test Email from ZY Bodybuilding',
      html: '<h1>Test Email</h1><p>If you receive this, your Resend API key is working!</p>',
    });

    console.log('✅ SUCCESS!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
    if (result.error) {
      console.log('\n❌ Error in result:', result.error);
    }
    
    if (result.data) {
      console.log('\n✅ Email sent successfully!');
      console.log('Message ID:', result.data.id);
    }

  } catch (error) {
    console.error('\n❌ FAILED!');
    console.error('Error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
    
    if (error.statusCode === 403) {
      console.log('\n💡 403 Error - Your API key is invalid or has been revoked.');
      console.log('Please check:');
      console.log('1. Go to https://resend.com/api-keys');
      console.log('2. Create a new API key');
      console.log('3. Update RESEND_API_KEY in .env.local');
    }
  }
}

testResendKey();
