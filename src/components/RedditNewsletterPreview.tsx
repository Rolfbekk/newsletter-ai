"use client";

import { useState } from "react";

interface RedditNewsletterPreviewProps {
  subreddits: string[];
}

interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  url: string;
  author: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
}

interface TrendingTopic {
  keyword: string;
  frequency: number;
  totalScore: number;
  averageScore: number;
  samplePosts: RedditPost[];
}

interface TopContributor {
  username: string;
  postsCount: number;
  totalScore: number;
  totalComments: number;
  averageScore: number;
  topPost: RedditPost;
}

interface NewsletterData {
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
  topPosts: RedditPost[];
  trendingTopics?: TrendingTopic[];
  topContributors?: TopContributor[];
  insights?: string[];
}

export default function RedditNewsletterPreview({ subreddits }: RedditNewsletterPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterData, setNewsletterData] = useState<NewsletterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month'>('week');
  const [includeAnalysis, setIncludeAnalysis] = useState(true);

  const generateNewsletter = async () => {
    if (subreddits.length === 0) {
      setError("Please select at least one subreddit");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        subreddits: subreddits.join(','),
        timeFilter,
        includeAnalysis: includeAnalysis.toString()
      });

      const response = await fetch(`/api/reddit-newsletter?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setNewsletterData(data.newsletter);
      } else {
        setError(data.error || 'Failed to generate newsletter');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Reddit Newsletter Generator</h3>
          <button
            onClick={generateNewsletter}
            disabled={isLoading || subreddits.length === 0}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Newsletter'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as 'week' | 'month')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Level</label>
            <select
              value={includeAnalysis ? 'true' : 'false'}
              onChange={(e) => setIncludeAnalysis(e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="true">Comprehensive Analysis</option>
              <option value="false">Simple Posts Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Selected Communities</label>
            <div className="text-sm text-gray-600">
              {subreddits.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {subreddits.map((subreddit) => (
                    <span key={subreddit} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
                      r/{subreddit}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400">No subreddits selected</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {newsletterData && (
        <div className="space-y-6">
          {/* Newsletter Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{newsletterData.title}</h2>
            <p className="text-orange-100">
              {timeFilter === 'week' ? 'Weekly' : 'Monthly'} roundup • {newsletterData.summary.totalPosts} posts • {formatNumber(newsletterData.summary.totalUpvotes)} upvotes
            </p>
            <p className="text-orange-100 text-sm mt-2">
              Generated on {new Date(newsletterData.generatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-orange-600">{newsletterData.summary.totalPosts}</div>
              <div className="text-sm text-gray-600">Total Posts</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-green-600">{formatNumber(newsletterData.summary.totalUpvotes)}</div>
              <div className="text-sm text-gray-600">Total Upvotes</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{formatNumber(newsletterData.summary.totalComments)}</div>
              <div className="text-sm text-gray-600">Total Comments</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{newsletterData.summary.averageScore}</div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>

          {/* Insights */}
          {newsletterData.insights && newsletterData.insights.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💡 Community Insights</h3>
              <div className="space-y-2">
                {newsletterData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <div className="text-orange-600 mt-1">•</div>
                    <p className="text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Topics */}
          {newsletterData.trendingTopics && newsletterData.trendingTopics.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Trending Topics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsletterData.trendingTopics.slice(0, 6).map((topic) => (
                  <div key={topic.keyword} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{topic.keyword}</h4>
                      <span className="text-sm text-gray-500">{topic.frequency} posts</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>↑ {formatNumber(topic.totalScore)}</span>
                      <span>Avg: {topic.averageScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Posts */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔥 Top Posts</h3>
            <div className="space-y-4">
              {newsletterData.topPosts.slice(0, 10).map((post) => (
                <div key={post.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
                      {post.selftext && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {post.selftext.substring(0, 150)}...
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>r/{post.subreddit}</span>
                        <span>by u/{post.author}</span>
                        <span>↑ {formatNumber(post.score)}</span>
                        <span>💬 {formatNumber(post.num_comments)}</span>
                        <span>{formatDate(post.created_utc)}</span>
                      </div>
                    </div>
                    <a
                      href={`https://reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-orange-600 hover:text-orange-800 text-sm font-medium"
                    >
                      View →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          {newsletterData.topContributors && newsletterData.topContributors.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">👑 Top Contributors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newsletterData.topContributors.map((contributor) => (
                  <div key={contributor.username} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">u/{contributor.username}</h4>
                      <span className="text-sm text-gray-500">{contributor.postsCount} posts</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>↑ {formatNumber(contributor.totalScore)}</span>
                      <span>💬 {formatNumber(contributor.totalComments)}</span>
                      <span>Avg: {contributor.averageScore}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 