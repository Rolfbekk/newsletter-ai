import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    TWITTER_BEARER_TOKEN: process.env.TWITTER_BEARER_TOKEN ? 
      `${process.env.TWITTER_BEARER_TOKEN.substring(0, 20)}...` : 
      'NOT_FOUND',
    TWITTER_API_KEY: process.env.TWITTER_API_KEY ? 
      `${process.env.TWITTER_API_KEY.substring(0, 10)}...` : 
      'NOT_FOUND',
    TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN ? 
      `${process.env.TWITTER_ACCESS_TOKEN.substring(0, 20)}...` : 
      'NOT_FOUND',
    TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET ? 
      `${process.env.TWITTER_ACCESS_TOKEN_SECRET.substring(0, 10)}...` : 
      'NOT_FOUND',
    NODE_ENV: process.env.NODE_ENV,
    // Check if .env.local is being loaded
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT ? 'FOUND' : 'NOT_FOUND'
  };

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    environment: envVars,
    note: "This shows what Next.js can actually read from environment variables"
  });
} 