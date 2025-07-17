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
    const newsletter = await redditAPI.searchTopicContent(topic, timeFilter);

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
    
    if (error instanceof Error) {
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