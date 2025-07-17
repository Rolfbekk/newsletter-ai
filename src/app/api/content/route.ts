import { NextRequest, NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subreddits = searchParams.get('subreddits');
    const users = searchParams.get('users');
    const redditLimit = parseInt(searchParams.get('redditLimit') || '10');
    const twitterLimit = parseInt(searchParams.get('twitterLimit') || '10');

    if (!subreddits && !users) {
      return NextResponse.json(
        { error: 'At least one of subreddits or users parameter is required' },
        { status: 400 }
      );
    }

    const result: any = {
      success: true,
      reddit: { posts: [], meta: {} },
      twitter: { posts: [], meta: {} },
      meta: {
        totalPosts: 0,
        cacheStats: {
          reddit: redditAPI.getCacheStats(),
          twitter: twitterAPI.getCacheStats()
        }
      }
    };

    // Fetch Reddit posts if subreddits are specified
    if (subreddits) {
      try {
        const subredditList = subreddits.split(',').map(s => s.trim()).filter(s => s);
        
        if (subredditList.length > 0) {
          console.log(`Fetching Reddit posts from: ${subredditList.join(', ')}`);
          const redditPosts = await redditAPI.getTrendingPosts(subredditList, redditLimit);
          
          result.reddit = {
            posts: redditPosts,
            meta: {
              subreddits: subredditList,
              totalPosts: redditPosts.length
            }
          };
          result.meta.totalPosts += redditPosts.length;
        }
      } catch (error) {
        console.error('Reddit fetch error:', error);
        result.reddit.error = error instanceof Error ? error.message : 'Failed to fetch Reddit posts';
      }
    }

    // Fetch Twitter posts if users are specified
    if (users) {
      try {
        const userList = users.split(',').map(u => u.trim().replace('@', '')).filter(u => u);
        
        if (userList.length > 0) {
          // Check Twitter API quota
          const remainingCalls = twitterAPI.getRemainingCalls();
          if (remainingCalls < userList.length) {
            result.twitter.error = `Insufficient Twitter API quota. Only ${remainingCalls} calls remaining this month.`;
          } else {
            console.log(`Fetching Twitter posts from: ${userList.join(', ')}`);
            const twitterPosts = await twitterAPI.getTrendingPosts(userList, twitterLimit);
            
            result.twitter = {
              posts: twitterPosts,
              meta: {
                users: userList,
                totalPosts: twitterPosts.length,
                remainingCalls: twitterAPI.getRemainingCalls()
              }
            };
            result.meta.totalPosts += twitterPosts.length;
          }
        }
      } catch (error) {
        console.error('Twitter fetch error:', error);
        result.twitter.error = error instanceof Error ? error.message : 'Failed to fetch Twitter posts';
      }
    }

    // Update cache stats
    result.meta.cacheStats = {
      reddit: redditAPI.getCacheStats(),
      twitter: twitterAPI.getCacheStats()
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Content API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false 
      },
      { status: 500 }
    );
  }
} 