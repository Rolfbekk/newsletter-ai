import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET() {
  try {
    console.log('Testing topic-based newsletter functionality...');
    
    // Test topic search
    const newsletter = await redditAPI.searchTopicContent('Agentic AI', 'week');
    
    return NextResponse.json({
      success: true,
      message: 'Topic-based newsletter is working correctly',
      testData: {
        topic: newsletter.topic,
        totalPosts: newsletter.summary.totalPosts,
        totalComments: newsletter.summary.totalComments,
        subredditsSearched: newsletter.summary.subredditsSearched,
        insights: newsletter.insights.length,
        relatedTopics: newsletter.relatedTopics.length,
        topPosts: newsletter.topPosts.length,
        topComments: newsletter.topComments.length,
        cacheStats: redditAPI.getCacheStats()
      }
    });
    
  } catch (error) {
    console.error('Topic newsletter test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cacheStats: redditAPI.getCacheStats()
    }, { status: 500 });
  }
} 