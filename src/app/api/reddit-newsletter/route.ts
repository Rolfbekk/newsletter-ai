import { NextRequest, NextResponse } from 'next/server';
import { redditAPI } from '@/lib/redditApi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subreddits = searchParams.get('subreddits');
    const timeFilter = searchParams.get('timeFilter') as 'week' | 'month' || 'week';
    const includeAnalysis = searchParams.get('includeAnalysis') === 'true';

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

    console.log(`Generating Reddit newsletter for: ${subredditList.join(', ')} (${timeFilter})`);

    const result: {
      success: boolean;
      newsletter: {
        title: string;
        subreddits: string[];
        timeFilter: string;
        generatedAt: string;
        summary: {
          totalPosts: number;
          totalUpvotes: number;
          totalComments: number;
          averageScore: number;
        };
        topPosts: any[];
        insights: string[];
        trendingTopics?: any[];
        topContributors?: any[];
      };
      meta: {
        cacheStats: any;
      };
    } = {
      success: true,
      newsletter: {
        title: `Reddit Newsletter: ${subredditList.join(', ')}`,
        subreddits: subredditList,
        timeFilter,
        generatedAt: new Date().toISOString(),
        summary: {
          totalPosts: 0,
          totalUpvotes: 0,
          totalComments: 0,
          averageScore: 0
        },
        topPosts: [],
        insights: []
      },
      meta: {
        cacheStats: redditAPI.getCacheStats()
      }
    };

    if (includeAnalysis) {
      // Get comprehensive domain analysis
      const analysis = await redditAPI.getDomainAnalysis(subredditList, timeFilter);
      
      result.newsletter.summary = analysis.engagementStats;
      result.newsletter.topPosts = analysis.topPosts;
      result.newsletter.trendingTopics = analysis.trendingTopics;
      result.newsletter.topContributors = analysis.topContributors;
      
      // Generate insights
      result.newsletter.insights = generateInsights(analysis);
      
    } else {
      // Get simple trending posts
      const posts = await redditAPI.getTrendingPosts(subredditList, 20);
      
      result.newsletter.topPosts = posts;
      result.newsletter.summary = {
        totalPosts: posts.length,
        totalUpvotes: posts.reduce((sum, post) => sum + post.score, 0),
        totalComments: posts.reduce((sum, post) => sum + post.num_comments, 0),
        averageScore: posts.length > 0 ? Math.round(posts.reduce((sum, post) => sum + post.score, 0) / posts.length) : 0
      };
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Reddit Newsletter API error:', error);
    
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

function generateInsights(analysis: {
  engagementStats: {
    averageScore: number;
    totalComments: number;
    totalPosts: number;
  };
  trendingTopics: Array<{
    keyword: string;
    frequency: number;
    totalScore: number;
  }>;
  topContributors: Array<{
    username: string;
    totalScore: number;
    postsCount: number;
  }>;
  timeFilter: string;
  totalPosts: number;
}): string[] {
  const insights: string[] = [];
  
  // Engagement insights
  if (analysis.engagementStats.averageScore > 100) {
    insights.push(`🔥 High engagement detected! Average post score: ${analysis.engagementStats.averageScore} upvotes`);
  }
  
  if (analysis.engagementStats.totalComments > 1000) {
    insights.push(`💬 Active community with ${analysis.engagementStats.totalComments} total comments`);
  }
  
  // Trending topics insights
  if (analysis.trendingTopics.length > 0) {
    const topTopic = analysis.trendingTopics[0];
    insights.push(`📈 Trending topic: "${topTopic.keyword}" appeared ${topTopic.frequency} times with ${topTopic.totalScore} total upvotes`);
  }
  
  // Top contributors insights
  if (analysis.topContributors.length > 0) {
    const topContributor = analysis.topContributors[0];
    insights.push(`👑 Top contributor: u/${topContributor.username} with ${topContributor.totalScore} total upvotes across ${topContributor.postsCount} posts`);
  }
  
  // Community activity insights
  const avgCommentsPerPost = Math.round(analysis.engagementStats.totalComments / analysis.engagementStats.totalPosts);
  if (avgCommentsPerPost > 20) {
    insights.push(`💭 Highly engaged community averaging ${avgCommentsPerPost} comments per post`);
  }
  
  // Time-based insights
  if (analysis.timeFilter === 'week') {
    insights.push(`📅 Weekly roundup: ${analysis.totalPosts} posts analyzed from the past week`);
  } else {
    insights.push(`📅 Monthly roundup: ${analysis.totalPosts} posts analyzed from the past month`);
  }
  
  return insights;
} 