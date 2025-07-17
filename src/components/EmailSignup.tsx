"use client";

import { useState } from "react";

interface EmailSignupProps {
  topic: string;
  newsletterFormat: string;
  newsletterContent?: {
    title: string;
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      type: string;
    }>;
    keyTakeaways: string[];
    conclusion: string;
  };
  onSignupSuccess?: () => void;
  onSignupError?: (error: string) => void;
}

export default function EmailSignup({ 
  topic, 
  newsletterFormat, 
  newsletterContent,
  onSignupSuccess, 
  onSignupError 
}: EmailSignupProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/email-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          topic,
          newsletterFormat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSignedUp(true);
        onSignupSuccess?.();
      } else {
        setError(data.error || "Failed to sign up for newsletter");
        onSignupError?.(data.error || "Failed to sign up for newsletter");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      setError(errorMessage);
      onSignupError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendTestNewsletter = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-test-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          topic,
          newsletterFormat,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError(null);
        // Show success message with message ID
        alert(`Test newsletter sent successfully! Check your email.\nMessage ID: ${data.messageId}`);
      } else {
        setError(data.error || "Failed to send test newsletter");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendActualNewsletter = async () => {
    if (!newsletterContent) {
      setError("No newsletter content available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/send-newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          topic,
          newsletterFormat,
          newsletterContent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setError(null);
        alert(`Newsletter sent successfully! Check your email.\nMessage ID: ${data.messageId}`);
      } else {
        setError(data.error || "Failed to send newsletter");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Network error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSignedUp) {
    return (
      <div className="glass border-subtle rounded-xl p-6 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">Successfully Signed Up!</h3>
          <p className="text-gray-300">
            You're now subscribed to receive weekly newsletters about <span className="text-blue-400 font-semibold">{topic}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleSendTestNewsletter}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Test Newsletter"}
            </button>
            {newsletterContent && (
              <button
                onClick={handleSendActualNewsletter}
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Real Newsletter"}
              </button>
            )}
            <button
              onClick={() => {
                setIsSignedUp(false);
                setEmail("");
              }}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Sign Up Another Email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border-subtle rounded-xl p-6 shadow-2xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          Get Your Weekly Newsletter
        </h3>
        <p className="text-gray-300">
          Sign up to receive your weekly digest of <span className="text-blue-400 font-semibold">{topic}</span> news
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400 transition-all"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-900/80 border border-red-400 rounded-lg p-3 text-red-100">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email.trim()}
          className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Signing up...</span>
            </div>
          ) : (
            "Sign Up for Newsletter"
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          We'll send you a weekly newsletter about {topic}. You can unsubscribe at any time.
        </p>
      </div>
    </div>
  );
} 