import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET() {
  try {
    console.log('Testing Reddit API authentication...');
    
    // Test with a simple subreddit
    const posts = await redditAPI.getSubredditPosts('programming', 3);
    
    return NextResponse.json({
      success: true,
      message: 'Reddit API authentication successful',
      postsFound: posts.length,
      samplePost: posts[0] ? {
        title: posts[0].title,
        subreddit: posts[0].subreddit,
        score: posts[0].score
      } : null
    });
    
  } catch (error) {
    console.error('Reddit API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 