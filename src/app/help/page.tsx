"use client";

import Link from "next/link";

export default function HelpCenter() {
  return (
    <div className="flex-grow bg-gradient-to-br from-black via-gray-900 to-gray-800 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Enhanced static background elements */}
      <div className="absolute top-0 w-full h-full pointer-events-none z-0">
        {/* Static floating orbs */}
        <div className="absolute left-1/4 top-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-fade-in" />
        <div className="absolute right-1/4 bottom-10 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-fade-in" style={{ animationDelay: '0.5s' }} />
        
        {/* Additional static floating elements */}
        <div className="absolute left-1/3 top-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="absolute right-1/3 bottom-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        
        {/* More static floating elements */}
        <div className="absolute left-1/6 top-1/4 w-32 h-32 bg-cyan-500/8 rounded-full blur-xl" />
        <div className="absolute right-1/6 bottom-1/4 w-40 h-40 bg-pink-500/8 rounded-full blur-xl" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative">
          {/* Main content - clean and borderless */}
          <div className="relative p-8 sm:p-12 animate-slide-up">
            <div className="text-center space-y-10 max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
                <p className="text-xl text-gray-300">
                  Everything you need to know about NewsletterAI
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-12">
                <div className="max-w-2xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for help topics..."
                      className="w-full px-4 py-3 bg-black/60 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-white placeholder-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass border-subtle rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Getting Started</h3>
                  <p className="text-gray-300 text-sm">Learn how to create your first newsletter</p>
                </div>

                <div className="glass border-subtle rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Features Guide</h3>
                  <p className="text-gray-300 text-sm">Explore all NewsletterAI features</p>
                </div>

                <div className="glass border-subtle rounded-xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">FAQ</h3>
                  <p className="text-gray-300 text-sm">Find answers to common questions</p>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                
                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How does NewsletterAI work?</h3>
                  <p className="text-gray-300">
                    NewsletterAI analyzes Reddit discussions to create personalized newsletters. Simply enter a topic you&apos;re interested in, and our AI will scour relevant subreddits to find the most engaging posts, comments, and insights. We then generate a comprehensive newsletter tailored to your interests.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">What topics can I create newsletters about?</h3>
                  <p className="text-gray-300">
                    You can create newsletters about virtually any topic that has active Reddit communities. Popular categories include technology, programming, business, sports, science, entertainment, and more. Just enter your topic and we&apos;ll find the most relevant subreddits.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How often are newsletters updated?</h3>
                  <p className="text-gray-300">
                    Newsletters are generated in real-time when you request them. You can choose between weekly or monthly timeframes to get the most relevant content from your chosen period. Each newsletter is fresh and up-to-date with the latest discussions.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Can I customize my newsletter format?</h3>
                  <p className="text-gray-300">
                    Yes! NewsletterAI offers three different formats: Brief (quick overview), Detailed (comprehensive analysis), and Visual (rich formatting with highlights). Choose the format that best suits your reading preferences.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Is my data private and secure?</h3>
                  <p className="text-gray-300">
                    Absolutely. We don&apos;t store personal information and respect Reddit&apos;s terms of service. Your email is only used to send newsletters, and you can unsubscribe at any time. We use secure, authenticated API calls to Reddit to ensure reliable data access.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">How do I unsubscribe from newsletters?</h3>
                  <p className="text-gray-300">
                    Every newsletter email includes an unsubscribe link at the bottom. Click on it to stop receiving newsletters. You can also manage your preferences through the link provided in each email.
                  </p>
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-12 glass border-subtle rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
                <p className="text-gray-300 mb-6">
                  Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Contact Support
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Back to Home */}
              <div className="mt-8 text-center">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-blue-400 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 