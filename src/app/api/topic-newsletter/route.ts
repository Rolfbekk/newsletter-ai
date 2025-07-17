import { NextRequest, NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';
import { aiService } from '@/lib/aiService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const timeFilter = searchParams.get('timeFilter') as 'week' | 'month' || 'week';
    const format = searchParams.get('format') as 'brief' | 'detailed' | 'visual' || 'detailed';

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic parameter is required' },
        { status: 400 }
      );
    }

    if (topic.length < 2) {
      return NextResponse.json(
        { error: 'Topic must be at least 2 characters long' },
        { status: 400 }
      );
    }

    console.log(`Generating topic-based newsletter for: "${topic}" (${timeFilter})`);

    // Search for topic-based content
    console.log(`Starting Reddit API search for topic: "${topic}"`);
    const newsletter = await redditAPI.searchTopicContent(topic, timeFilter);
    console.log(`Reddit API search completed. Found ${newsletter.topPosts.length} posts and ${newsletter.topComments.length} comments`);

    // Generate AI-powered engaging newsletter
    console.log(`Generating AI newsletter in ${format} format...`);
    const aiNewsletter = await aiService.generateEngagingNewsletter(
      topic,
      newsletter.topPosts,
      newsletter.topComments,
      timeFilter,
      format
    );

    const result = {
      success: true,
      newsletter: {
        ...newsletter,
        aiGenerated: aiNewsletter
      },
      meta: {
        cacheStats: redditAPI.getCacheStats(),
        searchQuery: topic,
        timeFilter
      }
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Topic Newsletter API error:', error);
    
    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for specific Reddit API errors
      if (error.message.includes('Rate limit exceeded')) {
        return NextResponse.json(
          { 
            error: 'Reddit API rate limit exceeded. Please try again in a few minutes.',
            success: false,
            retryAfter: 60
          },
          { status: 429 }
        );
      }
      
      if (error.message.includes('timeout') || error.message.includes('ECONNABORTED')) {
        return NextResponse.json(
          { 
            error: 'Request timeout. Reddit API is taking too long to respond.',
            success: false,
            retryAfter: 30
          },
          { status: 408 }
        );
      }
      
      if (error.message.includes('Network error') || error.message.includes('ENOTFOUND')) {
        return NextResponse.json(
          { 
            error: 'Network connectivity issue. Unable to reach Reddit API.',
            success: false,
            retryAfter: 60
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: error.message,
          success: false 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
} 