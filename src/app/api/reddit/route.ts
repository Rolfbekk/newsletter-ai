import { NextRequest, NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subreddits = searchParams.get('subreddits');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!subreddits) {
      return NextResponse.json(
        { error: 'Subreddits parameter is required' },
        { status: 400 }
      );
    }

    const subredditList = subreddits.split(',').map(s => s.trim()).filter(s => s);
    
    if (subredditList.length === 0) {
      return NextResponse.json(
        { error: 'At least one subreddit is required' },
        { status: 400 }
      );
    }

    // Limit the number of subreddits to prevent abuse
    if (subredditList.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 subreddits allowed per request' },
        { status: 400 }
      );
    }

    console.log(`Fetching posts from subreddits: ${subredditList.join(', ')}`);

    const posts = await redditAPI.getTrendingPosts(subredditList, limit);

    return NextResponse.json({
      success: true,
      data: posts,
      meta: {
        subreddits: subredditList,
        totalPosts: posts.length,
        cacheStats: redditAPI.getCacheStats()
      }
    });

  } catch (error) {
    console.error('Reddit API error:', error);
    
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