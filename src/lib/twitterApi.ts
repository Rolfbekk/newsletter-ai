import axios from 'axios';
import NodeCache from 'node-cache';
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// Cache for 24 hours to minimize API calls
const cache = new NodeCache({ stdTTL: 86400 });

// Rate limiting: Track API calls to stay within 100 posts/month limit
class RateLimiter {
  private callsThisMonth: number = 0;
  private lastResetDate: string = this.getCurrentMonth();

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}`;
  }

  private resetIfNewMonth(): void {
    const currentMonth = this.getCurrentMonth();
    if (currentMonth !== this.lastResetDate) {
      this.callsThisMonth = 0;
      this.lastResetDate = currentMonth;
      console.log('Rate limiter reset for new month');
    }
  }

  canMakeRequest(): boolean {
    this.resetIfNewMonth();
    return this.callsThisMonth < 100;
  }

  recordRequest(): void {
    this.resetIfNewMonth();
    this.callsThisMonth++;
    console.log(`Twitter API calls this month: ${this.callsThisMonth}/100`);
  }

  getRemainingCalls(): number {
    this.resetIfNewMonth();
    return Math.max(0, 100 - this.callsThisMonth);
  }
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

interface TwitterUser {
  id: string;
  username: string;
  name: string;
  description?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface TwitterResponse {
  data?: TwitterPost[];
  includes?: {
    users?: TwitterUser[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
  };
}

export class TwitterAPI {
  private bearerToken: string;
  private oauth: OAuth;
  private rateLimiter: RateLimiter;
  private apiKey: string;
  private apiSecret: string;
  private accessToken: string;
  private accessTokenSecret: string;

  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN || '';
    this.apiKey = process.env.TWITTER_API_KEY || '';
    this.apiSecret = process.env.TWITTER_API_SECRET || '';
    this.accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
    this.accessTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET || '';
    
    this.oauth = new OAuth({
      consumer: {
        key: this.apiKey,
        secret: this.apiSecret
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });
    
    this.rateLimiter = new RateLimiter();
    
    if (!this.bearerToken && (!this.apiKey || !this.accessToken)) {
      console.warn('Twitter credentials not found in environment variables');
    }
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.bearerToken && (!this.apiKey || !this.accessToken)) {
      throw new Error('Twitter credentials not configured');
    }

    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error(`Rate limit exceeded. Only ${this.rateLimiter.getRemainingCalls()} calls remaining this month.`);
    }

    try {
      console.log(`Making Twitter API request to: ${endpoint}`);
      console.log(`Parameters:`, params);
      
      let headers: any = {
        'User-Agent': 'NewsletterAI/1.0',
      };

      // Use OAuth 1.0a if we have the credentials, otherwise fall back to Bearer Token
      if (this.apiKey && this.accessToken) {
        const url = `https://api.twitter.com/2${endpoint}`;
        const request_data = {
          url,
          method: 'GET',
        };

        const token = {
          key: this.accessToken,
          secret: this.accessTokenSecret,
        };

        headers['Authorization'] = this.oauth.toHeader(this.oauth.authorize(request_data, token))['Authorization'];
        console.log('Using OAuth 1.0a authentication');
      } else {
        headers['Authorization'] = `Bearer ${this.bearerToken}`;
        console.log('Using Bearer Token authentication');
      }

      const response = await axios.get(`https://api.twitter.com/2${endpoint}`, {
        headers,
        params,
        timeout: 10000,
      });

      this.rateLimiter.recordRequest();
      console.log(`Twitter API response status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error('Twitter API request failed:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        
        if (error.response?.status === 401) {
          throw new Error('Twitter API authentication failed. Please check your credentials.');
        } else if (error.response?.status === 429) {
          throw new Error('Twitter API rate limit exceeded. Please try again later.');
        } else if (error.response?.status === 404) {
          throw new Error('Twitter user not found.');
        } else if (error.response?.status === 403) {
          throw new Error('Twitter API access forbidden. Check your app permissions.');
        }
      }
      throw error;
    }
  }

  private async makeRequestV1(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.apiKey || !this.accessToken) {
      throw new Error('Twitter OAuth credentials not configured');
    }

    if (!this.rateLimiter.canMakeRequest()) {
      throw new Error(`Rate limit exceeded. Only ${this.rateLimiter.getRemainingCalls()} calls remaining this month.`);
    }

    try {
      console.log(`Making Twitter v1.1 API request to: ${endpoint}`);
      console.log(`Parameters:`, params);
      
      const url = `https://api.twitter.com/1.1${endpoint}`;
      const request_data = {
        url,
        method: 'GET',
      };

      const token = {
        key: this.accessToken,
        secret: this.accessTokenSecret,
      };

      const headers = {
        'Authorization': this.oauth.toHeader(this.oauth.authorize(request_data, token))['Authorization'],
        'User-Agent': 'NewsletterAI/1.0',
      };

      const response = await axios.get(url, {
        headers,
        params,
        timeout: 10000,
      });

      this.rateLimiter.recordRequest();
      console.log(`Twitter v1.1 API response status: ${response.status}`);
      return response.data;
    } catch (error) {
      console.error('Twitter v1.1 API request failed:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<TwitterUser | null> {
    const cacheKey = `twitter_user_${username}`;
    
    // Check cache first
    const cached = cache.get<TwitterUser>(cacheKey);
    if (cached) {
      console.log(`Cache hit for Twitter user @${username}`);
      return cached;
    }

    try {
      console.log(`Fetching user info for @${username}`);
      const data = await this.makeRequest('/users/by/username/' + username, {
        'user.fields': 'description,public_metrics'
      });

      console.log(`User lookup response for @${username}:`, JSON.stringify(data, null, 2));

      if (data.data) {
        cache.set(cacheKey, data.data);
        return data.data;
      }
      
      console.log(`No user data found for @${username}`);
      return null;
    } catch (error) {
      console.error(`Error fetching Twitter user @${username}:`, error);
      
      // Try v1.1 API as fallback
      try {
        console.log(`Trying v1.1 API for user @${username}`);
        const v1Data = await this.makeRequestV1('/users/show.json', {
          'screen_name': username
        });
        
        console.log(`v1.1 user lookup response:`, JSON.stringify(v1Data, null, 2));
        
        if (v1Data) {
          const user: TwitterUser = {
            id: v1Data.id_str,
            username: v1Data.screen_name,
            name: v1Data.name,
            description: v1Data.description,
            public_metrics: {
              followers_count: v1Data.followers_count,
              following_count: v1Data.friends_count,
              tweet_count: v1Data.statuses_count
            }
          };
          
          cache.set(cacheKey, user);
          return user;
        }
      } catch (v1Error) {
        console.error(`v1.1 API also failed for @${username}:`, v1Error);
      }
      
      return null;
    }
  }

  async getUserPosts(username: string, maxResults: number = 10): Promise<TwitterPost[]> {
    const cacheKey = `twitter_posts_${username}_${maxResults}`;
    
    // Check cache first
    const cached = cache.get<TwitterPost[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit for Twitter posts from @${username}`);
      return cached;
    }

    try {
      // First get user ID
      const user = await this.getUserByUsername(username);
      if (!user) {
        throw new Error(`User @${username} not found`);
      }

      console.log(`Found user @${username} with ID: ${user.id}`);

      // Try v2 API first, then fall back to v1.1 if needed
      let data;
      try {
        data = await this.makeRequest(`/users/${user.id}/tweets`, {
          'max_results': maxResults,
          'tweet.fields': 'created_at,public_metrics,author_id'
        });
      } catch (error) {
        console.log(`v2 API failed, trying v1.1 API for @${username}`);
        // Fall back to v1.1 API
        data = await this.makeRequestV1(`/statuses/user_timeline.json`, {
          'screen_name': username,
          'count': maxResults,
          'exclude_replies': 'true',
          'include_rts': 'false'
        });
      }

      console.log(`Raw Twitter API response for @${username}:`, JSON.stringify(data, null, 2));

      let posts: TwitterPost[] = [];
      
      // Handle different API response formats
      if (Array.isArray(data)) {
        // v1.1 API response format
        posts = data.map((tweet: any) => ({
          id: tweet.id_str,
          text: tweet.text,
          author_id: tweet.user.id_str,
          created_at: tweet.created_at,
          public_metrics: {
            retweet_count: tweet.retweet_count,
            reply_count: 0, // Not available in v1.1
            like_count: tweet.favorite_count,
            quote_count: 0 // Not available in v1.1
          }
        }));
      } else {
        // v2 API response format
        posts = data.data || [];
      }
      
      // Cache the results
      cache.set(cacheKey, posts);
      
      console.log(`Successfully fetched ${posts.length} posts from @${username}`);
      return posts;
    } catch (error) {
      console.error(`Error fetching posts from @${username}:`, error);
      throw error;
    }
  }

  async getMultipleUserPosts(usernames: string[], postsPerUser: number = 5): Promise<TwitterPost[]> {
    const allPosts: TwitterPost[] = [];
    
    for (const username of usernames) {
      try {
        // Check remaining calls before making request
        if (!this.rateLimiter.canMakeRequest()) {
          console.warn(`Rate limit reached. Skipping @${username}`);
          break;
        }

        const posts = await this.getUserPosts(username, postsPerUser);
        allPosts.push(...posts);
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Failed to fetch from @${username}:`, error);
        // Continue with other users even if one fails
      }
    }
    
    // Sort by engagement (likes + retweets)
    return allPosts.sort((a, b) => {
      const aEngagement = (a.public_metrics?.like_count || 0) + (a.public_metrics?.retweet_count || 0);
      const bEngagement = (b.public_metrics?.like_count || 0) + (b.public_metrics?.retweet_count || 0);
      return bEngagement - aEngagement;
    });
  }

  // Get trending posts from multiple users
  async getTrendingPosts(usernames: string[], totalPosts: number = 20): Promise<TwitterPost[]> {
    const postsPerUser = Math.ceil(totalPosts / usernames.length);
    const allPosts = await this.getMultipleUserPosts(usernames, postsPerUser);
    
    // Return the top posts based on engagement
    return allPosts.slice(0, totalPosts);
  }

  // Get posts by ID (works with Basic plan)
  async getPostsById(postIds: string[]): Promise<TwitterPost[]> {
    const cacheKey = `twitter_posts_by_id_${postIds.join('_')}`;
    
    // Check cache first
    const cached = cache.get<TwitterPost[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit for Twitter posts by ID`);
      return cached;
    }

    try {
      console.log(`Fetching posts by ID: ${postIds.join(', ')}`);
      
      const data = await this.makeRequest('/tweets', {
        'ids': postIds.join(','),
        'tweet.fields': 'created_at,public_metrics,author_id'
      });

      console.log(`Posts by ID response:`, JSON.stringify(data, null, 2));

      const posts = data.data || [];
      
      // Cache the results
      cache.set(cacheKey, posts);
      
      console.log(`Successfully fetched ${posts.length} posts by ID`);
      return posts;
    } catch (error) {
      console.error(`Error fetching posts by ID:`, error);
      throw error;
    }
  }

  // Get trending posts using search (works with Basic plan)
  async getTrendingPostsBySearch(query: string, maxResults: number = 10): Promise<TwitterPost[]> {
    const cacheKey = `twitter_search_${query}_${maxResults}`;
    
    // Check cache first
    const cached = cache.get<TwitterPost[]>(cacheKey);
    if (cached) {
      console.log(`Cache hit for Twitter search: ${query}`);
      return cached;
    }

    try {
      console.log(`Searching tweets for: ${query}`);
      
      const data = await this.makeRequest('/tweets/search/recent', {
        'query': query,
        'max_results': maxResults,
        'tweet.fields': 'created_at,public_metrics,author_id'
      });

      console.log(`Search response:`, JSON.stringify(data, null, 2));

      const posts = data.data || [];
      
      // Cache the results
      cache.set(cacheKey, posts);
      
      console.log(`Successfully fetched ${posts.length} posts from search`);
      return posts;
    } catch (error) {
      console.error(`Error searching tweets:`, error);
      throw error;
    }
  }

  // Get remaining API calls
  getRemainingCalls(): number {
    return this.rateLimiter.getRemainingCalls();
  }

  // Clear cache
  clearCache(): void {
    cache.flushAll();
    console.log('Twitter API cache cleared');
  }

  // Get cache stats
  getCacheStats(): { hits: number; misses: number; keys: number } {
    const stats = cache.getStats();
    return {
      hits: stats.hits,
      misses: stats.misses,
      keys: cache.keys().length
    };
  }
}

export const twitterAPI = new TwitterAPI(); 