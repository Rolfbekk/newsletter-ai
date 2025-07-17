import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';
import { aiService } from '@/lib/aiService';

export async function GET() {
  try {
    console.log('Testing AI newsletter generation...');
    
    // Test with a simple topic
    const topic = 'React Development';
    const timeFilter = 'week' as const;
    
    // Get Reddit content
    const newsletter = await redditAPI.searchTopicContent(topic, timeFilter);
    
    // Generate AI newsletter
    const aiNewsletter = await aiService.generateEngagingNewsletter(
      topic,
      newsletter.topPosts.slice(0, 5), // Use fewer posts for testing
      newsletter.topComments.slice(0, 10), // Use fewer comments for testing
      timeFilter
    );
    
    return NextResponse.json({
      success: true,
      message: 'AI newsletter generation is working correctly',
      testData: {
        topic,
        timeFilter,
        redditPosts: newsletter.topPosts.length,
        redditComments: newsletter.topComments.length,
        aiNewsletter: {
          title: aiNewsletter.title,
          sections: aiNewsletter.sections.length,
          keyTakeaways: aiNewsletter.keyTakeaways.length,
          tone: aiNewsletter.tone
        },
        cacheStats: redditAPI.getCacheStats()
      }
    });
    
  } catch (error) {
    console.error('AI newsletter test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      cacheStats: redditAPI.getCacheStats()
    }, { status: 500 });
  }
} 