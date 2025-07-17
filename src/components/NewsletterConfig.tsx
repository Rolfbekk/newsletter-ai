"use client";

import { useState } from "react";
import SubredditSelector from "./SubredditSelector";
import XUserSelector from "./XUserSelector";
import ContentPreview from "./ContentPreview";
import RedditNewsletterPreview from "./RedditNewsletterPreview";

interface NewsletterConfig {
  subreddits: string[];
  xUsers: string[];
  email: string;
  frequency: "weekly" | "daily";
}

export default function NewsletterConfig() {
  const [config, setConfig] = useState<NewsletterConfig>({
    subreddits: [],
    xUsers: [],
    email: "",
    frequency: "weekly"
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubredditChange = (subreddits: string[]) => {
    setConfig(prev => ({ ...prev, subreddits }));
  };

  const handleXUserChange = (xUsers: string[]) => {
    setConfig(prev => ({ ...prev, xUsers }));
  };

  const handleEmailChange = (email: string) => {
    setConfig(prev => ({ ...prev, email }));
  };

  const handleFrequencyChange = (frequency: "weekly" | "daily") => {
    setConfig(prev => ({ ...prev, frequency }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Fetch content from both Reddit and Twitter
      const params = new URLSearchParams();
      if (config.subreddits.length > 0) {
        params.append('subreddits', config.subreddits.join(','));
        params.append('redditLimit', '5');
      }
      if (config.xUsers.length > 0) {
        params.append('users', config.xUsers.join(','));
        params.append('twitterLimit', '5');
      }

      const response = await fetch(`/api/content?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        // TODO: Save newsletter configuration to database
        // TODO: Send confirmation email
        console.log('Content fetched successfully:', data);
        
        // Show success message
        alert(`Newsletter created successfully! Found ${data.meta.totalPosts} posts from your selected sources.`);
      } else {
        throw new Error(data.error || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error creating newsletter:', error);
      alert(`Error creating newsletter: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return config.subreddits.length > 0;
      case 2:
        return config.xUsers.length > 0;
      case 3:
        return config.email && config.email.includes("@");
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-500"
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  step < currentStep ? "bg-blue-600" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Choose Subreddits</span>
          <span>Select X Users</span>
          <span>Email & Frequency</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        {currentStep === 1 && (
          <SubredditSelector 
            selectedSubreddits={config.subreddits}
            onSubredditChange={handleSubredditChange}
          />
        )}
        
        {currentStep === 2 && (
          <XUserSelector 
            selectedUsers={config.xUsers}
            onUserChange={handleXUserChange}
          />
        )}
        
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Setup</h2>
              <p className="text-gray-600">
                Enter your email and choose how often you'd like to receive your newsletter
              </p>
            </div>

            {/* Email Input */}
            <div className="space-y-4">
              <label htmlFor="email" className="block text-lg font-semibold text-gray-900">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={config.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg"
                required
              />
              <p className="text-sm text-gray-500">
                We'll send your personalized newsletter to this email address
              </p>
            </div>

            {/* Frequency Selection */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-900">
                Newsletter Frequency
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleFrequencyChange("weekly")}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    config.frequency === "weekly"
                      ? "border-blue-400 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-400 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      config.frequency === "weekly"
                        ? "border-blue-400 bg-blue-400"
                        : "border-gray-300"
                    }`}>
                      {config.frequency === "weekly" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">Weekly</div>
                      <div className="text-sm text-gray-500">Every Sunday morning</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFrequencyChange("daily")}
                  className={`p-6 border-2 rounded-xl text-left transition-all ${
                    config.frequency === "daily"
                      ? "border-blue-400 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-blue-400 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      config.frequency === "daily"
                        ? "border-blue-400 bg-blue-400"
                        : "border-gray-300"
                    }`}>
                      {config.frequency === "daily" && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold">Daily</div>
                      <div className="text-sm text-gray-500">Every morning at 8 AM</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentStep < 3 ? (
          <button
            onClick={nextStep}
            disabled={!canProceed()}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            className="px-8 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Newsletter...</span>
              </div>
            ) : (
              "Create Newsletter"
            )}
          </button>
        )}
      </div>

      {/* Content Preview */}
      {(config.subreddits.length > 0 || config.xUsers.length > 0) && (
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <ContentPreview 
            subreddits={config.subreddits}
            xUsers={config.xUsers}
          />
        </div>
      )}

      {/* Reddit Newsletter Preview */}
      {config.subreddits.length > 0 && (
        <div className="mt-8">
          <RedditNewsletterPreview subreddits={config.subreddits} />
        </div>
      )}

      {/* Configuration Preview */}
      {config.subreddits.length > 0 || config.xUsers.length > 0 ? (
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">Your Newsletter Configuration</h3>
          <div className="space-y-3">
            {config.subreddits.length > 0 && (
              <div>
                <span className="text-sm font-medium text-green-700">Reddit Communities:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {config.subreddits.map((subreddit) => (
                    <span key={subreddit} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      r/{subreddit}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {config.xUsers.length > 0 && (
              <div>
                <span className="text-sm font-medium text-green-700">X Users:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {config.xUsers.map((user) => (
                    <span key={user} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      @{user}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {config.email && (
              <div>
                <span className="text-sm font-medium text-green-700">Email:</span>
                <span className="ml-2 text-green-800">{config.email}</span>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-green-700">Frequency:</span>
              <span className="ml-2 text-green-800 capitalize">{config.frequency}</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
} 