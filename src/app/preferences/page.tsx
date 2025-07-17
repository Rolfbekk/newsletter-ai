'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PreferencesPage() {
  const [email, setEmail] = useState('user@example.com');
  const [topics, setTopics] = useState(['cybersecurity', 'technology']);
  const [frequency, setFrequency] = useState('weekly');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const availableTopics = [
    'cybersecurity',
    'technology',
    'programming',
    'artificial intelligence',
    'machine learning',
    'web development',
    'data science',
    'devops'
  ];

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleTopic = (topic: string) => {
    if (topics.includes(topic)) {
      setTopics(topics.filter(t => t !== topic));
    } else {
      setTopics([...topics, topic]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                ⚙️ Newsletter Preferences
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your newsletter subscription settings
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              {/* Email Settings */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📧 Email Settings
                </h2>
                <div className="space-y-4">
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
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Newsletter Topics */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📰 Newsletter Topics
                </h2>
                <p className="text-gray-600 mb-4">
                  Select the topics you're interested in receiving newsletters about:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTopics.map((topic) => (
                    <label key={topic} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {topic.replace('-', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frequency Settings */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  📅 Newsletter Frequency
                </h2>
                <div className="space-y-3">
                  {[
                    { value: 'daily', label: 'Daily', description: 'Receive newsletters every day' },
                    { value: 'weekly', label: 'Weekly', description: 'Receive newsletters once a week' },
                    { value: 'biweekly', label: 'Bi-weekly', description: 'Receive newsletters every two weeks' },
                    { value: 'monthly', label: 'Monthly', description: 'Receive newsletters once a month' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={frequency === option.value}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notification Settings */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  🔔 Notification Settings
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Email notifications</span>
                      <p className="text-xs text-gray-500">Receive email notifications when new newsletters are available</p>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">Special announcements</span>
                      <p className="text-xs text-gray-500">Receive notifications about new features and updates</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('user@example.com');
                      setTopics(['cybersecurity']);
                      setFrequency('weekly');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Reset to Defaults
                  </button>
                  <Link
                    href="/unsubscribe"
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Unsubscribe
                  </Link>
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Preferences'}
                </button>
              </div>

              {/* Success Message */}
              {saved && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Preferences saved successfully!
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            ℹ️ About Your Newsletter
          </h3>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>
              • Your newsletters are AI-curated from Reddit discussions and other sources
            </p>
            <p>
              • You can change your preferences at any time
            </p>
            <p>
              • Unsubscribing will stop all future newsletters immediately
            </p>
            <p>
              • Your data is protected and never shared with third parties
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 