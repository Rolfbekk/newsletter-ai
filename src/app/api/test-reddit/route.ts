import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET() {
  try {
    console.log('Testing Reddit API...');
    
    // Test basic subreddit fetch
    const posts = await redditAPI.getSubredditPosts('programming', 5);
    
    // Test domain analysis
    const analysis = await redditAPI.getDomainAnalysis(['programming', 'webdev'], 'week');
    
    return NextResponse.json({
      success: true,
      message: 'Reddit API is working correctly',
      testData: {
        basicPosts: posts.length,
        analysisPosts: analysis.totalPosts,
        trendingTopics: analysis.trendingTopics.length,
        topContributors: analysis.topContributors.length,
        cacheStats: redditAPI.getCacheStats()
      }
    });
    
  } catch (error) {
    console.error('Reddit API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cacheStats: redditAPI.getCacheStats()
    }, { status: 500 });
  }
} 