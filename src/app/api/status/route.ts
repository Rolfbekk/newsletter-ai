import { NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET() {
  try {
    const redditStats = redditAPI.getCacheStats();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      apis: {
        reddit: {
          status: 'operational',
          cache: redditStats,
          rateLimit: 'No limit (respectful crawling)'
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