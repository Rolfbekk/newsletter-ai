import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET() {
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: []
  };

  // Test 1: Search for recent tweets (should work with Basic plan)
  try {
    console.log('Testing search endpoint...');
    const searchData = await twitterAPI.getTrendingPostsBySearch('news', 2);
    results.tests.push({
      test: 'Search for recent tweets',
      status: searchData.length > 0 ? '✅ Success' : '⚠️ No results',
      details: {
        postsFound: searchData.length,
        posts: searchData.slice(0, 2).map((post: any) => ({
          id: post.id,
          text: post.text?.substring(0, 50) + '...',
          author_id: post.author_id
        }))
      }
    });
  } catch (error) {
    results.tests.push({
      test: 'Search for recent tweets',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 2: Try to get posts by ID (if we have any from search)
  try {
    console.log('Testing posts by ID...');
    // Use a known tweet ID for testing (this is just an example)
    const testTweetId = '1234567890123456789'; // This will likely fail, but let's see the error
    const postsData = await twitterAPI.getPostsById([testTweetId]);
    results.tests.push({
      test: 'Get posts by ID',
      status: postsData.length > 0 ? '✅ Success' : '⚠️ No results',
      details: {
        postsFound: postsData.length
      }
    });
  } catch (error) {
    results.tests.push({
      test: 'Get posts by ID',
      status: '❌ Failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  // Test 3: Check API limits
  results.tests.push({
    test: 'API Limits',
    status: 'ℹ️ Info',
    details: {
      remainingCalls: twitterAPI.getRemainingCalls(),
      cacheStats: twitterAPI.getCacheStats()
    }
  });

  return NextResponse.json(results);
} 