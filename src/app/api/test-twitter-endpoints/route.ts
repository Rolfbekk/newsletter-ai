import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET() {
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Basic API connectivity
  try {
    const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=test&max_results=1', {
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'User-Agent': 'NewsletterAI/1.0'
      }
    });
    
    results.tests.push({
      test: 'Basic API connectivity',
      status: response.status === 200 ? '✅ Success' : `❌ Failed (${response.status})`,
      details: {
        status: response.status,
        statusText: response.statusText
      }
    });
  } catch (error) {
    results.tests.push({
      test: 'Basic API connectivity',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Search endpoint
  try {
    const searchData = await twitterAPI.getTrendingPostsBySearch('test', 1);
    results.tests.push({
      test: 'Search endpoint',
      status: searchData.length > 0 ? '✅ Success' : '⚠️ No results',
      details: {
        postsFound: searchData.length
      }
    });
  } catch (error) {
    results.tests.push({
      test: 'Search endpoint',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: User lookup endpoint
  try {
    const userData = await twitterAPI.getUserByUsername('twitter');
    results.tests.push({
      test: 'User lookup endpoint',
      status: userData ? '✅ Success' : '❌ User not found',
      details: userData ? {
        username: userData.username,
        name: userData.name
      } : null
    });
  } catch (error) {
    results.tests.push({
      test: 'User lookup endpoint',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 4: Posts by ID endpoint
  try {
    // Try with a known tweet ID (this is just a test ID)
    const postsData = await twitterAPI.getPostsById(['1234567890']);
    results.tests.push({
      test: 'Posts by ID endpoint',
      status: postsData.length > 0 ? '✅ Success' : '⚠️ No results',
      details: {
        postsFound: postsData.length
      }
    });
  } catch (error) {
    results.tests.push({
      test: 'Posts by ID endpoint',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  return NextResponse.json(results);
} 