import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET() {
  try {
    console.log('Testing basketball topic search...');
    
    // Test basketball search
    const newsletter = await redditAPI.searchTopicContent('basketball', 'week');
    
    return NextResponse.json({
      success: true,
      message: 'Basketball topic search is working correctly',
      testData: {
        topic: newsletter.topic,
        totalPosts: newsletter.summary.totalPosts,
        totalComments: newsletter.summary.totalComments,
        subredditsSearched: newsletter.summary.subredditsSearched,
        subreddits: ['nba', 'basketball', 'CollegeBasketball', 'NBADiscussion', 'basketballtips'],
        insights: newsletter.insights.length,
        relatedTopics: newsletter.relatedTopics.length,
        topPosts: newsletter.topPosts.length,
        topComments: newsletter.topComments.length,
        cacheStats: redditAPI.getCacheStats()
      }
    });
    
  } catch (error) {
    console.error('Basketball topic search test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cacheStats: redditAPI.getCacheStats()
    }, { status: 500 });
  }
} 