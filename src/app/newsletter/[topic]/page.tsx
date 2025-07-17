'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NewsletterContent {
  title: string;
  introduction: string;
  sections: Array<{
    title: string;
    content: string;
    type: string;
  }>;
  keyTakeaways: string[];
  conclusion: string;
}

export default function NewsletterPage() {
  const params = useParams();
  const topic = params.topic as string;
  const [newsletterContent, setNewsletterContent] = useState<NewsletterContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For now, we'll show a placeholder since we don't have the actual newsletter content
    // In a real implementation, you'd fetch the newsletter content based on the topic
    setLoading(false);
  }, [topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading newsletter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                📰 {decodeURIComponent(topic)} Newsletter
              </h1>
              <p className="text-gray-600 mt-2">
                Full newsletter view • {new Date().toLocaleDateString()}
              </p>
            </div>
            <Link 
              href="/" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Newsletter Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Newsletter Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">
              📰 {decodeURIComponent(topic)} Newsletter
            </h2>
            <p className="opacity-90">
              Weekly AI-Curated Insights • {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Newsletter Body */}
          <div className="p-8">
            <div className="prose max-w-none">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                🎉 Welcome to Your Personalized Newsletter!
              </h3>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 rounded-r-lg">
                <p className="text-gray-800 text-lg">
                  This is the full newsletter view for <strong>{decodeURIComponent(topic)}</strong>. 
                  In a complete implementation, this would display the actual newsletter content 
                  that was sent via email.
                </p>
              </div>

              {/* Placeholder for newsletter sections */}
              <div className="space-y-6">
                <div className="bg-gray-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    📊 Newsletter Sections
                  </h4>
                  <p className="text-gray-700">
                    This is where the actual newsletter content would be displayed, 
                    including sections, key takeaways, and conclusions.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    🎯 Key Takeaways
                  </h4>
                  <p className="text-gray-700">
                    Important insights and actionable points from this week's newsletter.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    🏁 Conclusion
                  </h4>
                  <p className="text-gray-700">
                    Summary and next steps for the upcoming week.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 text-center space-x-4">
                <Link 
                  href="/template-preview" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Create New Newsletter
                </Link>
                <Link 
                  href="/preferences" 
                  className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  Manage Preferences
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t p-6 text-center">
            <p className="text-gray-600 mb-2">
              This newsletter was intelligently generated by AI analyzing Reddit discussions.
            </p>
            <p className="text-sm text-gray-500">
              You're subscribed to receive weekly newsletters about <strong>{decodeURIComponent(topic)}</strong>.
            </p>
            <div className="mt-4 space-x-4 text-sm">
              <Link href="/unsubscribe" className="text-blue-600 hover:underline">
                Unsubscribe
              </Link>
              <span className="text-gray-400">|</span>
              <Link href="/preferences" className="text-blue-600 hover:underline">
                Manage Preferences
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 