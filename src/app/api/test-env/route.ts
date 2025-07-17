import { NextResponse } from 'next/server';

export async function GET() {
  console.log('=== Environment Variables Test ===');
  console.log('AZURE_OPENAI_ENDPOINT:', process.env.AZURE_OPENAI_ENDPOINT || 'NOT SET');
  console.log('AZURE_OPENAI_API_KEY:', process.env.AZURE_OPENAI_API_KEY ? `${process.env.AZURE_OPENAI_API_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('AZURE_OPENAI_DEPLOYMENT:', process.env.AZURE_OPENAI_DEPLOYMENT || 'NOT SET');
  console.log('AZURE_OPENAI_API_VERSION:', process.env.AZURE_OPENAI_API_VERSION || 'NOT SET');
  console.log('=== End Environment Variables Test ===');

  return NextResponse.json({
    success: true,
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || 'NOT SET',
    deployment: process.env.AZURE_OPENAI_DEPLOYMENT || 'NOT SET',
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || 'NOT SET',
    hasApiKey: !!process.env.AZURE_OPENAI_API_KEY
  });
} 