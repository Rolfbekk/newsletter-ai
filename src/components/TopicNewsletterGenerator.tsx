"use client";

import { useState, useEffect, useRef } from "react";
import AINewsletterDisplay from "./AINewsletterDisplay";
import BriefNewsletterDisplay from "./BriefNewsletterDisplay";
import VisualNewsletterDisplay from "./VisualNewsletterDisplay";
import NewsletterFormatSelector, { NewsletterFormat } from "./NewsletterFormatSelector";
import EmailSignup from "./EmailSignup";

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
  relevanceScore?: number;
}

interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  parent_id: string;
  permalink: string;
}

interface AIGeneratedNewsletter {
  title: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: string;
    type: 'summary' | 'analysis' | 'trends' | 'insights' | 'discussions';
  }>;
  keyTakeaways: string[];
  conclusion: string;
  tone: 'professional' | 'casual' | 'enthusiastic';
}

interface TopicNewsletterData {
  topic: string;
  timeFilter: 'week' | 'month';
  generatedAt: string;
  summary: {
    totalPosts: number;
    totalUpvotes: number;
    totalComments: number;
    averageScore: number;
    subredditsSearched: number;
  };
  topPosts: RedditPost[];
  topComments: RedditComment[];
  insights: string[];
  relatedTopics: string[];
  aiGenerated?: AIGeneratedNewsletter;
}

const SUGGESTED_TOPICS = [
  // Tech & Programming
  "Agentic AI",
  "Machine Learning",
  "React Development",
  "Web Development",
  "Data Science",
  "Cybersecurity",
  "Python Programming",
  "JavaScript Frameworks",
  "Artificial Intelligence",
  
  // Sports
  "Basketball",
  "NBA",
  "Football",
  "Soccer",
  "Baseball",
  "Tennis",
  
  // Entertainment
  "Movies",
  "Television",
  "Music",
  "Gaming",
  "Anime",
  
  // Science & Education
  "Science",
  "Space",
  "Health",
  "Psychology",
  
  // Business & Finance
  "Startup Funding",
  "Cryptocurrency",
  "Investing",
  "Marketing Strategies",
  "Blockchain Technology",
  
  // Lifestyle
  "Cooking",
  "Fitness",
  "Travel",
  "Photography",
  "Art"
];

export default function TopicNewsletterGenerator() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newsletterData, setNewsletterData] = useState<TopicNewsletterData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'week' | 'month'>('week');
  const [newsletterFormat, setNewsletterFormat] = useState<NewsletterFormat>('detailed');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const timeDropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);

  // Handle clicks outside the input and suggestions to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current && 
        !dropdownButtonRef.current.contains(event.target as Node) &&
        timeDropdownRef.current && 
        !timeDropdownRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const generateNewsletter = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        topic: topic.trim(),
        timeFilter,
        format: newsletterFormat
      });

      const response = await fetch(`/api/topic-newsletter?${params.toString()}`);
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

  const handleTopicSelect = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
    // Keep suggestions open when typing to allow easy selection
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Close suggestions when input loses focus (with a small delay to allow clicking suggestions)
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleInputFocus = () => {
    // Always show suggestions when input is focused
    setShowSuggestions(true);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getFilteredTopics = () => {
    if (!topic) return SUGGESTED_TOPICS;
    
    const lowerTopic = topic.toLowerCase();
    return SUGGESTED_TOPICS.filter(suggestedTopic => 
      suggestedTopic.toLowerCase().includes(lowerTopic)
    );
  };

  return (
    <div className="space-y-6">
      {/* Topic Input Section */}
      <div className="glass border-subtle rounded-xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            What interests you?
          </h2>
          <p className="text-gray-300">
            Enter a topic and AI will analyze Reddit to create an engaging newsletter for you
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Topic Input */}
          <div className="relative">
            <div className="flex">
              <input
                ref={inputRef}
                type="text"
                value={topic}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder="e.g., Agentic AI, React Development, Startup Funding..."
                className="flex-1 px-4 py-3 bg-black/60 border border-white/20 rounded-l-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg text-white placeholder-gray-400 transition-all focus-ring hover:border-white/30"
              />
              <button
                ref={dropdownButtonRef}
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="px-3 py-3 bg-black/60 border border-l-0 border-white/20 hover:bg-black/80 hover:border-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg 
                  className={`w-5 h-5 text-white transition-transform duration-200 ${showSuggestions ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {topic && (
                <button
                  type="button"
                  onClick={() => {
                    setTopic('');
                    setShowSuggestions(true);
                    inputRef.current?.focus();
                  }}
                  className="px-3 py-3 bg-black/60 border border-l-0 border-white/20 rounded-r-lg hover:bg-red-500/20 hover:border-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
                  title="Clear topic"
                >
                  <svg 
                    className="w-5 h-5 text-white hover:text-red-400 transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {/* Topic Suggestions */}
            {showSuggestions && (
              <div ref={suggestionsRef} className="absolute top-full left-0 right-0 glass border-subtle shadow-2xl z-10 mt-1 max-h-80 overflow-y-auto animate-fade-in">
                <div className="p-2">
                  <div className="text-sm text-gray-400 mb-2 px-2 font-medium">
                    {topic ? 'Filtered topics:' : 'Popular topics:'}
                  </div>
                  
                  {/* Tech & Programming */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Tech & Programming</div>
                    {getFilteredTopics().filter(topic => 
                      ['Agentic AI', 'Machine Learning', 'React Development', 'Web Development', 'Data Science', 'Cybersecurity', 'Python Programming', 'JavaScript Frameworks', 'Artificial Intelligence'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>

                  {/* Sports */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Sports</div>
                    {getFilteredTopics().filter(topic => 
                      ['Basketball', 'NBA', 'Football', 'Soccer', 'Baseball', 'Tennis'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>

                  {/* Entertainment */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Entertainment</div>
                    {getFilteredTopics().filter(topic => 
                      ['Movies', 'Television', 'Music', 'Gaming', 'Anime'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>

                  {/* Science & Education */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Science & Education</div>
                    {getFilteredTopics().filter(topic => 
                      ['Science', 'Space', 'Health', 'Psychology'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>

                  {/* Business & Finance */}
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Business & Finance</div>
                    {getFilteredTopics().filter(topic => 
                      ['Startup Funding', 'Cryptocurrency', 'Investing', 'Marketing Strategies', 'Blockchain Technology'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>

                  {/* Lifestyle */}
                  <div>
                    <div className="text-xs text-gray-400 font-medium px-2 mb-1">Lifestyle</div>
                    {getFilteredTopics().filter(topic => 
                      ['Cooking', 'Fitness', 'Travel', 'Photography', 'Art'].includes(topic)
                    ).map((suggestedTopic) => (
                      <button
                        key={suggestedTopic}
                        onClick={() => handleTopicSelect(suggestedTopic)}
                        className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white hover:text-white transition-colors"
                      >
                        {suggestedTopic}
                      </button>
                    ))}
                  </div>
                  
                  {/* No results message */}
                  {getFilteredTopics().length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      <div className="text-sm">No topics found matching "{topic}"</div>
                      <div className="text-xs mt-1">Try a different search term</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Time Filter */}
          <div className="flex items-center justify-center space-x-4">
            <label className="text-sm font-medium text-gray-300">Time Period:</label>
            <div className="relative">
              <button
                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                className="px-3 py-2 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white transition-all text-base min-w-[120px] pr-8 text-center flex items-center justify-between hover:border-white/30 focus-ring"
              >
                <span>{timeFilter === 'week' ? 'Past Week' : 'Past Month'}</span>
                <svg className={`w-4 h-4 text-white transition-transform duration-200 ml-2 ${showTimeDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showTimeDropdown && (
                <div ref={timeDropdownRef} className="absolute top-full left-0 right-0 mt-1 glass border-subtle rounded-lg shadow-2xl z-20 animate-fade-in">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setTimeFilter('week');
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm ${
                        timeFilter === 'week' ? 'bg-blue-500/20 text-blue-300' : ''
                      }`}
                    >
                      Past Week
                    </button>
                    <button
                      onClick={() => {
                        setTimeFilter('month');
                        setShowTimeDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm ${
                        timeFilter === 'month' ? 'bg-blue-500/20 text-blue-300' : ''
                      }`}
                    >
                      Past Month
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter Format Selector */}
          <NewsletterFormatSelector 
            selectedFormat={newsletterFormat}
            onFormatChange={setNewsletterFormat}
          />

          {/* Generate Button */}
          <button
            onClick={generateNewsletter}
            disabled={isLoading || !topic.trim()}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg tracking-wide btn-animate hover-lift focus-ring"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>AI is analyzing Reddit...</span>
              </div>
            ) : (
              "Generate AI Newsletter"
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/80 border border-red-400 rounded-xl p-4 text-red-100">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {newsletterData && (
        <div className="space-y-6">
          {/* AI-Generated Newsletter */}
          {newsletterData.aiGenerated && (
            <>
              {newsletterFormat === 'brief' && (
                <BriefNewsletterDisplay 
                  aiNewsletter={newsletterData.aiGenerated}
                  topic={newsletterData.topic}
                  timeFilter={timeFilter}
                />
              )}
              {newsletterFormat === 'detailed' && (
                <AINewsletterDisplay 
                  aiNewsletter={newsletterData.aiGenerated}
                  topic={newsletterData.topic}
                  timeFilter={timeFilter}
                />
              )}
              {newsletterFormat === 'visual' && (
                <VisualNewsletterDisplay 
                  aiNewsletter={newsletterData.aiGenerated}
                  topic={newsletterData.topic}
                  timeFilter={timeFilter}
                />
              )}
            </>
          )}

          {/* Email Signup Section */}
          <EmailSignup 
            topic={newsletterData.topic}
            newsletterFormat={newsletterFormat}
            newsletterContent={newsletterData.aiGenerated}
            onSignupSuccess={() => {
              console.log("User successfully signed up for newsletter");
            }}
            onSignupError={(error) => {
              console.error("Newsletter signup error:", error);
            }}
          />

          {/* Raw Data Header */}
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-2">
              Raw Data Analysis
            </h2>
            <p className="text-blue-100">
              {timeFilter === 'week' ? 'Weekly' : 'Monthly'} roundup • {newsletterData.summary.totalPosts} posts • {formatNumber(newsletterData.summary.totalUpvotes)} upvotes
            </p>
            <p className="text-blue-100 text-sm mt-2">
              Searched {newsletterData.summary.subredditsSearched} communities • Generated on {new Date(newsletterData.generatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass border-subtle rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-white">{newsletterData.summary.totalPosts}</div>
              <div className="text-sm text-gray-400">Relevant Posts</div>
            </div>
            <div className="glass border-subtle rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-white">{formatNumber(newsletterData.summary.totalUpvotes)}</div>
              <div className="text-sm text-gray-400">Total Upvotes</div>
            </div>
            <div className="glass border-subtle rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-white">{formatNumber(newsletterData.summary.totalComments)}</div>
              <div className="text-sm text-gray-400">Comments</div>
            </div>
            <div className="glass border-subtle rounded-xl p-4 shadow-lg text-center">
              <div className="text-2xl font-bold text-white">{newsletterData.summary.averageScore}</div>
              <div className="text-sm text-gray-400">Avg Score</div>
            </div>
          </div>

          {/* Insights */}
          {newsletterData.insights.length > 0 && (
            <div className="glass border-subtle rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">💡 Key Insights</h3>
              <div className="space-y-2">
                {newsletterData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                    <div className="text-blue-400 mt-1">•</div>
                    <p className="text-gray-200">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Topics */}
          {newsletterData.relatedTopics.length > 0 && (
            <div className="glass border-subtle rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">🔗 Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {newsletterData.relatedTopics.map((relatedTopic, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setTopic(relatedTopic);
                      generateNewsletter();
                    }}
                    className="px-3 py-1 bg-white/10 text-white rounded-full text-sm hover:bg-blue-400 hover:text-white transition-colors"
                  >
                    {relatedTopic}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Top Posts */}
          <div className="glass border-subtle rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">🔥 Top Posts</h3>
            <div className="space-y-4">
              {newsletterData.topPosts.slice(0, 20).map((post) => (
                <div key={post.id} className="border border-white/10 glass rounded-lg p-4 hover:scale-[1.025] hover:shadow-xl hover:border-blue-400 transition-all duration-200 group relative">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 line-clamp-2 text-lg drop-shadow-sm">{post.title}</h4>
                      {post.selftext && (
                        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                          {truncateText(post.selftext, 150)}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <span>r/{post.subreddit}</span>
                        <span>by u/{post.author}</span>
                        <span>↑ {formatNumber(post.score)}</span>
                        <span>💬 {formatNumber(post.num_comments)}</span>
                        <span>{formatDate(post.created_utc)}</span>
                        {post.relevanceScore && (
                          <span className="text-blue-400 font-medium">
                            Relevance: {post.relevanceScore}
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={`https://reddit.com${post.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 text-blue-400 hover:text-white text-sm font-bold underline underline-offset-2"
                    >
                      View →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Comments */}
          {newsletterData.topComments.length > 0 && (
            <div className="glass border-subtle rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-4">💬 Top Comments</h3>
              <div className="space-y-4">
                {newsletterData.topComments.slice(0, 15).map((comment) => (
                  <div key={comment.id} className="border border-white/10 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-white">u/{comment.author}</span>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>↑ {formatNumber(comment.score)}</span>
                        <span>{formatDate(comment.created_utc)}</span>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {truncateText(comment.body, 200)}
                    </p>
                    <a
                      href={`https://reddit.com${comment.permalink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-white text-xs font-medium mt-2 inline-block"
                    >
                      View comment →
                    </a>
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