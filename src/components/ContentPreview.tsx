"use client";

import { useState } from "react";

interface ContentPreviewProps {
  subreddits: string[];
  xUsers: string[];
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

interface TwitterPost {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
  };
}

export default function ContentPreview({ subreddits, xUsers }: ContentPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    if (subreddits.length === 0 && xUsers.length === 0) {
      setError("Please select at least one subreddit or X user");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (subreddits.length > 0) {
        params.append('subreddits', subreddits.join(','));
        params.append('redditLimit', '3');
      }
      if (xUsers.length > 0) {
        params.append('users', xUsers.join(','));
        params.append('twitterLimit', '3');
      }

      const response = await fetch(`/api/content?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setContent(data);
      } else {
        setError(data.error || 'Failed to fetch content');
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

  const formatTwitterDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Content Preview</h3>
        <button
          onClick={fetchContent}
          disabled={isLoading || (subreddits.length === 0 && xUsers.length === 0)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Fetching...' : 'Fetch Content'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {content && (
        <div className="space-y-6">
          {/* Reddit Content */}
          {content.reddit.posts && content.reddit.posts.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Reddit Posts ({content.reddit.posts.length})
              </h4>
              <div className="space-y-3">
                {content.reddit.posts.map((post: RedditPost) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 mb-1">{post.title}</h5>
                        {post.selftext && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {post.selftext.substring(0, 150)}...
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>r/{post.subreddit}</span>
                          <span>by u/{post.author}</span>
                          <span>↑ {post.score}</span>
                          <span>💬 {post.num_comments}</span>
                          <span>{formatDate(post.created_utc)}</span>
                        </div>
                      </div>
                      <a
                        href={`https://reddit.com${post.permalink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Twitter Content */}
          {content.twitter.posts && content.twitter.posts.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                Twitter Posts ({content.twitter.posts.length})
              </h4>
              <div className="space-y-3">
                {content.twitter.posts.map((post: TwitterPost) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-2">{post.text}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>❤️ {post.public_metrics?.like_count || 0}</span>
                          <span>🔄 {post.public_metrics?.retweet_count || 0}</span>
                          <span>💬 {post.public_metrics?.reply_count || 0}</span>
                          <span>{formatTwitterDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* API Stats */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">API Statistics</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Total Posts:</span>
                <span className="ml-2 font-medium">{content.meta.totalPosts}</span>
              </div>
              {content.twitter.meta.remainingCalls && (
                <div>
                  <span className="text-blue-700">Twitter API Calls Remaining:</span>
                  <span className="ml-2 font-medium">{content.twitter.meta.remainingCalls}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 