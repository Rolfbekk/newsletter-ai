"use client";

import { useState } from "react";

interface SubredditSelectorProps {
  selectedSubreddits: string[];
  onSubredditChange: (subreddits: string[]) => void;
}

const POPULAR_SUBREDDITS = [
  "programming", "technology", "science", "news", "worldnews",
  "business", "finance", "investing", "startups", "entrepreneur",
  "marketing", "productivity", "selfimprovement", "books", "movies",
  "music", "gaming", "sports", "fitness", "cooking", "travel",
  "photography", "art", "design", "webdev", "datascience",
  "machinelearning", "artificial", "cybersecurity", "blockchain"
];

export default function SubredditSelector({ selectedSubreddits, onSubredditChange }: SubredditSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customSubreddit, setCustomSubreddit] = useState("");

  const filteredSubreddits = POPULAR_SUBREDDITS.filter(subreddit =>
    subreddit.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSubreddits.includes(subreddit)
  );

  const handleSubredditToggle = (subreddit: string) => {
    if (selectedSubreddits.includes(subreddit)) {
      onSubredditChange(selectedSubreddits.filter(s => s !== subreddit));
    } else {
      onSubredditChange([...selectedSubreddits, subreddit]);
    }
  };

  const handleCustomSubredditAdd = () => {
    const cleanSubreddit = customSubreddit.trim().toLowerCase().replace(/^r\//, "");
    if (cleanSubreddit && !selectedSubreddits.includes(cleanSubreddit)) {
      onSubredditChange([...selectedSubreddits, cleanSubreddit]);
      setCustomSubreddit("");
    }
  };

  const handleRemoveSubreddit = (subreddit: string) => {
    onSubredditChange(selectedSubreddits.filter(s => s !== subreddit));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Reddit Communities</h2>
        <p className="text-gray-600">
          Select the subreddits you want to follow for your personalized newsletter
        </p>
      </div>

      {/* Selected Subreddits */}
      {selectedSubreddits.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Communities</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSubreddits.map((subreddit) => (
              <div
                key={subreddit}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full"
              >
                <span className="text-sm font-medium">r/{subreddit}</span>
                <button
                  onClick={() => handleRemoveSubreddit(subreddit)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Subreddit Input */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Add Custom Subreddit</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={customSubreddit}
            onChange={(e) => setCustomSubreddit(e.target.value)}
            placeholder="Enter subreddit name (e.g., 'programming' or 'r/programming')"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) => e.key === "Enter" && handleCustomSubredditAdd()}
          />
          <button
            onClick={handleCustomSubredditAdd}
            disabled={!customSubreddit.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </div>

      {/* Popular Subreddits */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Communities</h3>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search popular subreddits..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Subreddit Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredSubreddits.map((subreddit) => (
            <button
              key={subreddit}
              onClick={() => handleSubredditToggle(subreddit)}
              className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="font-medium text-gray-900">r/{subreddit}</div>
              <div className="text-xs text-gray-500 capitalize">
                {subreddit.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </button>
          ))}
        </div>

        {filteredSubreddits.length === 0 && searchTerm && (
          <div className="text-center py-8 text-gray-500">
            No subreddits found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose 3-5 subreddits for the best newsletter experience</li>
          <li>• Mix different topics to get diverse insights</li>
          <li>• You can add any subreddit by typing its name</li>
          <li>• Popular subreddits tend to have more active discussions</li>
        </ul>
      </div>
    </div>
  );
} 