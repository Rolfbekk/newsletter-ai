'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [unsubscribing, setUnsubscribing] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setUnsubscribing(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUnsubscribed(true);
    } catch (err) {
      setError('Failed to unsubscribe. Please try again.');
    } finally {
      setUnsubscribing(false);
    }
  };

  if (unsubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Successfully Unsubscribed
          </h1>
          <p className="text-gray-600 mb-6">
            You have been unsubscribed from all newsletters. We're sorry to see you go!
          </p>
          <div className="space-y-3">
            <Link
              href="/preferences"
              className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Resubscribe
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
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
                📧 Unsubscribe
              </h1>
              <p className="text-gray-600 mt-2">
                We're sorry to see you go
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

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">📧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Unsubscribe from Newsletters
              </h2>
              <p className="text-gray-600">
                We're sorry to see you go! Please let us know why you're unsubscribing 
                so we can improve our service.
              </p>
            </div>

            <form onSubmit={handleUnsubscribe} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              {/* Reason for Unsubscribing */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Unsubscribing (Optional)
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a reason...</option>
                  <option value="too-frequent">Too frequent emails</option>
                  <option value="not-relevant">Content not relevant</option>
                  <option value="too-many">Too many emails</option>
                  <option value="quality">Poor content quality</option>
                  <option value="technical">Technical issues</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Link
                  href="/preferences"
                  className="text-blue-600 hover:underline"
                >
                  Manage Preferences Instead
                </Link>
                <button
                  type="submit"
                  disabled={unsubscribing}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {unsubscribing ? 'Unsubscribing...' : 'Unsubscribe'}
                </button>
              </div>
            </form>

            {/* Alternative Options */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                💡 Before You Go...
              </h3>
              <div className="text-blue-800 space-y-2 text-sm">
                <p>
                  • You can <Link href="/preferences" className="underline">manage your preferences</Link> instead of unsubscribing
                </p>
                <p>
                  • Change your email frequency to receive fewer emails
                </p>
                <p>
                  • Select only the topics you're interested in
                </p>
                <p>
                  • You can always resubscribe later
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 