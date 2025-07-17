import { NextResponse } from 'next/server';

export async function GET() {
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: []
  };

  const bearerToken = process.env.TWITTER_BEARER_TOKEN;

  if (!bearerToken) {
    results.tests.push({
      test: 'Bearer Token',
      status: '❌ Missing',
      error: 'Bearer Token not found in environment'
    });
    return NextResponse.json(results);
  }

  // Test 1: Simple search with Bearer Token only
  try {
    console.log('Testing simple search with Bearer Token...');
    const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=news&max_results=2', {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'NewsletterAI/1.0'
      }
    });

    const data = await response.json();
    
    results.tests.push({
      test: 'Simple search with Bearer Token',
      status: response.status === 200 ? '✅ Success' : `❌ Failed (${response.status})`,
      details: {
        status: response.status,
        postsFound: data.data?.length || 0,
        error: data.errors ? data.errors[0]?.message : null
      }
    });

    // If successful, show some sample data
    if (response.status === 200 && data.data?.length > 0) {
      results.sampleData = data.data.slice(0, 2).map((tweet: any) => ({
        id: tweet.id,
        text: tweet.text?.substring(0, 100) + '...',
        created_at: tweet.created_at
      }));
    }

  } catch (error) {
    results.tests.push({
      test: 'Simple search with Bearer Token',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return NextResponse.json(results);
} 