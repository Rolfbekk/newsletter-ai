import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';
import { twitterAPI } from '@/lib/twitterApi';

export async function GET() {
  try {
    const redditStats = redditAPI.getCacheStats();
    const twitterRemainingCalls = twitterAPI.getRemainingCalls();
    const twitterStats = twitterAPI.getCacheStats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apis: {
        reddit: {
          status: 'operational',
          cache: redditStats,
          rateLimit: 'No limit (respectful crawling)'
        },
        twitter: {
          status: twitterRemainingCalls > 0 ? 'operational' : 'quota_exceeded',
          remainingCalls: twitterRemainingCalls,
          cache: twitterStats,
          rateLimit: '100 calls per month'
        }
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 