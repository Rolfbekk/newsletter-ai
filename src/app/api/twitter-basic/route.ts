import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const topics = searchParams.get('topics');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!topics) {
      return NextResponse.json(
        { error: 'Topics parameter is required' },
        { status: 400 }
      );
    }

    const topicList = topics.split(',').map(t => t.trim()).filter(t => t);
    
    if (topicList.length === 0) {
      return NextResponse.json(
        { error: 'At least one topic is required' },
        { status: 400 }
      );
    }

    // Check remaining API calls
    const remainingCalls = twitterAPI.getRemainingCalls();
    if (remainingCalls < topicList.length) {
      return NextResponse.json(
        { 
          error: `Insufficient API quota. Only ${remainingCalls} calls remaining this month.`,
          remainingCalls 
        },
        { status: 429 }
      );
    }

    console.log(`Fetching trending posts for topics: ${topicList.join(', ')}`);

    const allPosts: any[] = [];
    
    // Fetch posts for each topic
    for (const topic of topicList) {
      try {
        const posts = await twitterAPI.getTrendingPostsBySearch(topic, Math.ceil(limit / topicList.length));
        allPosts.push(...posts);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to fetch posts for topic "${topic}":`, error);
        // Continue with other topics even if one fails
      }
    }
    
    // Sort by engagement (likes + retweets)
    const sortedPosts = allPosts.sort((a, b) => {
      const aEngagement = (a.public_metrics?.like_count || 0) + (a.public_metrics?.retweet_count || 0);
      const bEngagement = (b.public_metrics?.like_count || 0) + (b.public_metrics?.retweet_count || 0);
      return bEngagement - aEngagement;
    });

    // Return top posts
    const topPosts = sortedPosts.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: topPosts,
      meta: {
        topics: topicList,
        totalPosts: topPosts.length,
        remainingCalls: twitterAPI.getRemainingCalls(),
        cacheStats: twitterAPI.getCacheStats(),
        note: "Using Basic plan - posts fetched by topic search instead of user timelines"
      }
    });

  } catch (error) {
    console.error('Twitter Basic API error:', error);
    
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