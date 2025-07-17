import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const users = searchParams.get('users');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!users) {
      return NextResponse.json(
        { error: 'Users parameter is required' },
        { status: 400 }
      );
    }

    const userList = users.split(',').map(u => u.trim().replace('@', '')).filter(u => u);
    
    if (userList.length === 0) {
      return NextResponse.json(
        { error: 'At least one user is required' },
        { status: 400 }
      );
    }

    // Limit the number of users to prevent API abuse
    if (userList.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 users allowed per request to conserve API quota' },
        { status: 400 }
      );
    }

    // Check remaining API calls
    const remainingCalls = twitterAPI.getRemainingCalls();
    if (remainingCalls < userList.length) {
      return NextResponse.json(
        { 
          error: `Insufficient API quota. Only ${remainingCalls} calls remaining this month.`,
          remainingCalls 
        },
        { status: 429 }
      );
    }

    console.log(`Fetching posts from users: ${userList.join(', ')}`);

    const posts = await twitterAPI.getTrendingPosts(userList, limit);

    return NextResponse.json({
      success: true,
      data: posts,
      meta: {
        users: userList,
        totalPosts: posts.length,
        remainingCalls: twitterAPI.getRemainingCalls(),
        cacheStats: twitterAPI.getCacheStats()
      }
    });

  } catch (error) {
    console.error('Twitter API error:', error);
    
    if (error instanceof Error) {
      // Handle specific rate limit errors
      if (error.message.includes('Rate limit exceeded') || error.message.includes('Insufficient API quota')) {
        return NextResponse.json(
          { 
            error: error.message,
            success: false,
            remainingCalls: twitterAPI.getRemainingCalls()
          },
          { status: 429 }
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