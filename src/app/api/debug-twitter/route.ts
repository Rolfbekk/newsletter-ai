import { NextRequest, NextResponse } from 'next/server';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'twitter';

    const results: any = {
      success: true,
      username,
      steps: []
    };

    // Step 1: Check credentials
    results.steps.push({
      step: 'Check credentials',
      status: '✅ OAuth credentials found',
      details: {
        hasApiKey: !!process.env.TWITTER_API_KEY,
        hasApiSecret: !!process.env.TWITTER_API_SECRET,
        hasAccessToken: !!process.env.TWITTER_ACCESS_TOKEN,
        hasAccessTokenSecret: !!process.env.TWITTER_ACCESS_TOKEN_SECRET,
        remainingCalls: twitterAPI.getRemainingCalls()
      }
    });

    // Step 2: Try to get user info
    try {
      const user = await twitterAPI.getUserByUsername(username);
      results.steps.push({
        step: 'Get user info',
        status: user ? '✅ Success' : '❌ User not found',
        details: user ? {
          id: user.id,
          username: user.username,
          name: user.name,
          followers: user.public_metrics?.followers_count
        } : null
      });

      // Step 3: Try to get tweets
      if (user) {
        try {
          const posts = await twitterAPI.getUserPosts(username, 3);
          results.steps.push({
            step: 'Get user tweets',
            status: posts.length > 0 ? '✅ Success' : '⚠️ No tweets found',
            details: {
              postsCount: posts.length,
              posts: posts.slice(0, 2).map((post: any) => ({
                id: post.id,
                text: post.text?.substring(0, 100) + '...',
                created_at: post.created_at,
                likes: post.public_metrics?.like_count
              }))
            }
          });
        } catch (error) {
          results.steps.push({
            step: 'Get user tweets',
            status: '❌ Failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    } catch (error) {
      results.steps.push({
        step: 'Get user info',
        status: '❌ Failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return NextResponse.json(results);

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 