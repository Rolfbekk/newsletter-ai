"use client";

import Link from "next/link";

export default function TermsOfService() {
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
                <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
                <p className="text-xl text-gray-300">
                  The rules and guidelines for using NewsletterAI
                </p>
              </div>

              {/* Content */}
              <div className="space-y-8 text-left">
                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Acceptance of Terms</h2>
                  <p className="text-gray-300 mb-4">
                    By accessing and using NewsletterAI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Service Description</h2>
                  <p className="text-gray-300 mb-4">
                    NewsletterAI is an AI-powered newsletter generation service that:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Analyzes Reddit content to create personalized newsletters</li>
                    <li>Delivers curated content to your email address</li>
                    <li>Uses AI to summarize and organize information</li>
                    <li>Provides multiple newsletter formats (Brief, Detailed, Visual)</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
                  <p className="text-gray-300 mb-4">
                    As a user of NewsletterAI, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Provide accurate and complete information when signing up</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Not attempt to circumvent any security measures</li>
                    <li>Respect the intellectual property rights of content creators</li>
                    <li>Not use the service to send spam or malicious content</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Content and Intellectual Property</h2>
                  <p className="text-gray-300 mb-4">
                    NewsletterAI respects intellectual property rights:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>We aggregate publicly available content from Reddit</li>
                    <li>Original content creators retain their rights</li>
                    <li>Our AI-generated summaries are for educational purposes</li>
                    <li>We provide attribution and links to original sources</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Privacy and Data Protection</h2>
                  <p className="text-gray-300 mb-4">
                    Your privacy is important to us. Please review our <Link href="/privacy" className="text-blue-400 hover:text-white">Privacy Policy</Link> to understand how we collect, use, and protect your information.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
                  <p className="text-gray-300 mb-4">
                    We strive to provide reliable service, but we cannot guarantee:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Uninterrupted or error-free service</li>
                    <li>Immediate delivery of newsletters</li>
                    <li>Availability of specific Reddit content</li>
                    <li>Compatibility with all email providers</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                  <p className="text-gray-300 mb-4">
                    NewsletterAI is provided &quot;as is&quot; without warranties of any kind. We are not liable for:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>Any damages resulting from service interruptions</li>
                    <li>Loss of data or content</li>
                    <li>Inaccuracies in AI-generated content</li>
                    <li>Third-party service disruptions</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                  <p className="text-gray-300 mb-4">
                    Our service integrates with third-party platforms:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li><strong>Reddit:</strong> For content aggregation (subject to Reddit&apos;s terms)</li>
                    <li><strong>SendGrid:</strong> For email delivery</li>
                    <li><strong>OpenAI:</strong> For AI content generation</li>
                  </ul>
                  <p className="text-gray-300 mt-4">
                    Use of these services is subject to their respective terms of service.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                  <p className="text-gray-300 mb-4">
                    We may terminate or suspend your access to NewsletterAI:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                    <li>For violation of these terms</li>
                    <li>For fraudulent or abusive behavior</li>
                    <li>At your request</li>
                    <li>For service discontinuation</li>
                  </ul>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                  <p className="text-gray-300 mb-4">
                    We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our website. Continued use of the service constitutes acceptance of updated terms.
                  </p>
                </div>

                <div className="glass border-subtle rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  <p className="text-gray-300 mb-4">
                    If you have questions about these terms, please contact us:
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p>Email: <a href="mailto:rolf@juvosolutions.co" className="text-blue-400 hover:text-white">rolf@juvosolutions.co</a></p>
                    <p>Contact Form: <Link href="/contact" className="text-blue-400 hover:text-white">Contact Us</Link></p>
                  </div>
                </div>
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