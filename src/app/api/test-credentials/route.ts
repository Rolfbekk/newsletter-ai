import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    credentials: {}
  };

  // Check Twitter credentials
  const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;
  const twitterApiKey = process.env.TWITTER_API_KEY;
  const twitterApiSecret = process.env.TWITTER_API_SECRET;
  const twitterAccessToken = process.env.TWITTER_ACCESS_TOKEN;
  const twitterAccessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
  
  if (twitterApiKey && twitterAccessToken) {
    results.credentials.twitter = {
      oauth: '✅ Found (OAuth 1.0a)',
      bearerToken: twitterBearerToken ? '✅ Found' : '❌ Missing',
      status: 'Ready to use with OAuth 1.0a'
    };
  } else if (twitterBearerToken && twitterBearerToken !== 'your_bearer_token_here') {
    results.credentials.twitter = {
      bearerToken: '✅ Found',
      oauth: '❌ Missing',
      status: 'Ready to use with Bearer Token'
    };
  } else {
    results.credentials.twitter = {
      bearerToken: '❌ Missing',
      oauth: '❌ Missing',
      status: 'Please configure Twitter credentials',
      instructions: [
        '1. Go to https://developer.twitter.com/en/portal/dashboard',
        '2. Navigate to your app',
        '3. Go to "Keys and Tokens" tab',
        '4. Generate Access Token and Secret',
        '5. Add to .env: TWITTER_ACCESS_TOKEN and TWITTER_ACCESS_TOKEN_SECRET'
      ]
    };
  }

  // Check Reddit credentials (optional)
  const redditClientId = process.env.REDDIT_CLIENT_ID;
  const redditSecret = process.env.REDDIT_SECRET;
  if (redditClientId && redditSecret) {
    results.credentials.reddit = {
      clientId: '✅ Found',
      secret: '✅ Found',
      status: 'Available (using public API for now)'
    };
  } else {
    results.credentials.reddit = {
      status: 'Not configured (using public API)',
      note: 'Reddit public API works without authentication'
    };
  }

  // Check Azure OpenAI
  const azureOpenAIKey = process.env.AZURE_OPENAI_API_KEY;
  const azureOpenAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
  if (azureOpenAIKey && azureOpenAIEndpoint) {
    results.credentials.azureOpenAI = {
      apiKey: '✅ Found',
      endpoint: '✅ Found',
      status: 'Ready for AI features'
    };
  } else {
    results.credentials.azureOpenAI = {
      status: '❌ Missing',
      note: 'Required for AI summarization features'
    };
  }

  return NextResponse.json(results);
} 